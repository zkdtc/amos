/**
 * X (Twitter) post adapter.
 *
 * Reality check: X has aggressively locked down public scraping since 2024.
 * There's no clean "fetch by URL" path that works reliably across all posts.
 * AMOS therefore offers three input modes with graceful fallbacks:
 *
 *   1. Server-fetch via Nitter mirror   — works ~60% of the time
 *   2. Server-fetch via syndication API — works for some posts
 *   3. Manual paste                     — 100% reliable, user pastes text
 *
 * All three end up in the same `XPost` schema and feed the same search index.
 * Like YouTube transcripts, posts are RESEARCH ONLY — never trade signals.
 */

export interface XPost {
  id: string;                  // tweet/post id (numeric string)
  url: string;                 // canonical https URL
  author: string;              // handle without @
  authorDisplay?: string;      // display name
  text: string;                // plain-text body (URLs, mentions kept)
  createdAt?: string;          // ISO if known
  fetchedAt: string;           // ISO when we captured it
  source: 'nitter' | 'syndication' | 'manual';
  metrics?: {
    replies?: number;
    reposts?: number;
    likes?: number;
    views?: number;
  };
  tags?: string[];             // user-applied tags (e.g. 'NVDA', 'macro')
  raw?: string;                // raw payload for debugging
}

const STORAGE_KEY = 'amos-x-posts-v1';

// ── ID / URL parsing ──────────────────────────────────────────────────

// Matches an X / Twitter / Nitter post URL anywhere in a string.
// (Non-anchored so it works inside a multi-line paste.)
const URL_RE =
  /https?:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com|nitter\.[\w.]+)\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})/i;
// For strict whole-string parsing (URL-input field), anchor it.
const URL_RE_STRICT =
  /^https?:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com|nitter\.[\w.]+)\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})\/?(?:\?\S*)?$/i;

export function parsePostUrl(input: string): { author: string; id: string } | null {
  const s = input.trim();
  if (!s) return null;
  // Strict whole-string first (URL input field)
  const strict = s.match(URL_RE_STRICT);
  if (strict) return { author: strict[1], id: strict[2] };
  // Then non-anchored (paste containing other text)
  const m = s.match(URL_RE);
  if (m) return { author: m[1], id: m[2] };
  // Bare numeric ID
  if (/^\d{15,25}$/.test(s)) return { author: '', id: s };
  return null;
}

export function canonicalPostUrl(author: string, id: string): string {
  return `https://x.com/${author || 'i'}/status/${id}`;
}

// ── Server-side fetch via Vite proxy ──────────────────────────────────

/**
 * Try to fetch a post by URL. Returns an XPost or throws with a clear reason.
 * Hits `/api/x/post?url=…` which the Vite dev server resolves through one of
 * several backends.
 */
export async function fetchPost(input: string): Promise<XPost> {
  const parsed = parsePostUrl(input);
  if (!parsed) throw new Error(`Could not parse "${input}" as an X post URL or numeric ID.`);
  const url = canonicalPostUrl(parsed.author, parsed.id);
  const r = await fetch(`/api/x/post?url=${encodeURIComponent(url)}`);
  if (!r.ok) {
    let detail = '';
    try { detail = (await r.json()).error ?? ''; } catch { /* ignore */ }
    throw new Error(
      `Could not fetch post (HTTP ${r.status}). ${detail || 'X has locked down public scraping; use Manual Paste below instead.'}`
    );
  }
  const j = await r.json() as Omit<XPost, 'fetchedAt'> & { fetchedAt?: string };
  return {
    ...j,
    url: j.url || url,
    fetchedAt: j.fetchedAt || new Date().toISOString()
  };
}

// ── Manual paste parser ───────────────────────────────────────────────

/**
 * Parse a pasted block into an XPost.  Accepts several common shapes:
 *
 *   - Just the post text (will use placeholder author/id)
 *   - "@handle\n<text>\n<url>"
 *   - Full X embed JSON (oEmbed)
 *   - Raw HTML copy from x.com  (we strip tags)
 *
 * Returns null if nothing usable could be parsed.
 */
export function parseManualPaste(raw: string): XPost | null {
  if (!raw.trim()) return null;

  // 1. oEmbed JSON
  try {
    const j = JSON.parse(raw);
    if (j?.html && j?.author_name) {
      const url = j.url ?? '';
      const parsed = parsePostUrl(url);
      const text = htmlToText(j.html).trim();
      return {
        id: parsed?.id ?? String(Date.now()),
        url: url || canonicalPostUrl(parsed?.author ?? '', parsed?.id ?? ''),
        author: parsed?.author ?? (j.author_name || '').replace(/^@/, ''),
        authorDisplay: j.author_name,
        text,
        fetchedAt: new Date().toISOString(),
        source: 'manual',
        raw
      };
    }
  } catch { /* not JSON */ }

  // 2. Look for a post URL in the paste
  const urlMatch = raw.match(URL_RE);
  let url = '';
  let author = '';
  let id = '';
  if (urlMatch) {
    url = urlMatch[0];
    author = urlMatch[1];
    id = urlMatch[2];
  }

  // 3. @handle line
  const handleLine = raw.split(/\r?\n/).find((l) => /^\s*@[A-Za-z0-9_]{1,15}\s*$/.test(l));
  if (handleLine && !author) author = handleLine.replace(/^\s*@/, '').trim();

  // 4. Strip HTML if present, drop the URL/handle lines from the text
  let text = /[<>]/.test(raw) ? htmlToText(raw) : raw;
  if (url) text = text.split(url).join('');
  if (handleLine) text = text.split(handleLine).join('');
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  if (!text) return null;
  return {
    id: id || `manual-${Date.now()}`,
    url: url || canonicalPostUrl(author, id),
    author: author || 'unknown',
    text,
    fetchedAt: new Date().toISOString(),
    source: 'manual',
    raw
  };
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// ── Library persistence ──────────────────────────────────────────────

export function loadLibrary(): XPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as XPost[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveLibrary(items: XPost[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

// ── Search ───────────────────────────────────────────────────────────

export interface XSearchHit {
  post: XPost;
  score: number;
  highlightHtml: string;
}

const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','of','to','in','on','at','for','by','with',
  'is','are','was','were','be','been','being','have','has','had','do','does','did',
  'this','that','these','those','it','its','as','from','i','you','he','she','we','they'
]);

export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s$@#-]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t) && t.length > 1);
}

export function searchPosts(posts: XPost[], query: string, limit = 50): XSearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const hits: XSearchHit[] = [];
  for (const p of posts) {
    const hay = (p.text + ' @' + p.author + ' ' + (p.tags ?? []).join(' ')).toLowerCase();
    let score = 0;
    const matched: string[] = [];
    for (const tok of tokens) {
      if (hay.includes(tok)) {
        score += 1;
        matched.push(tok);
        if (/^\$[a-z]{2,5}$/.test(tok)) score += 2;            // $TICKER bonus
        if (tok.startsWith('@') && hay.includes(tok)) score += 1; // @handle bonus
      }
    }
    if (score === 0) continue;
    hits.push({
      post: p,
      score,
      highlightHtml: highlight(p.text, matched)
    });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

function highlight(text: string, matches: string[]): string {
  const esc = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  if (matches.length === 0) return esc;
  const pat = matches
    .map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
    .join('|');
  return esc.replace(new RegExp(`(${pat})`, 'gi'), '<mark>$1</mark>');
}

export function formatRelativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (!isFinite(t)) return '—';
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}


// ── Follow list (handles to auto-scan) ────────────────────────────────

export interface XFollow {
  handle: string;             // without @
  addedAt: string;            // ISO
  lastScanAt?: string;        // ISO
  lastError?: string;
  enabled: boolean;
}

const FOLLOW_KEY = 'amos-x-follows-v1';
const HANDLE_RE = /^[A-Za-z0-9_]{1,15}$/;

export function loadFollows(): XFollow[] {
  try {
    const raw = localStorage.getItem(FOLLOW_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as XFollow[];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export function saveFollows(items: XFollow[]): void {
  try { localStorage.setItem(FOLLOW_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

export function isValidHandle(h: string): boolean {
  const clean = h.replace(/^@/, '').trim();
  return HANDLE_RE.test(clean);
}

export function normaliseHandle(h: string): string {
  return h.replace(/^@/, '').trim();
}

/** Server-side scan: returns the latest posts for a given handle, newest first. */
/* ─── Time-window filtering ─────────────────────────────────────── */

export type ScanWindow = '1h' | '1d' | '1w' | '1mo' | '3mo' | '6mo' | '1y' | 'all';

export const SCAN_WINDOWS: Array<{ value: ScanWindow; labelKey: string; hours: number | null }> = [
  { value: '1h',  labelKey: 'xWin1h',  hours: 1 },
  { value: '1d',  labelKey: 'xWin1d',  hours: 24 },
  { value: '1w',  labelKey: 'xWin1w',  hours: 24 * 7 },
  { value: '1mo', labelKey: 'xWin1mo', hours: 24 * 30 },
  { value: '3mo', labelKey: 'xWin3mo', hours: 24 * 90 },
  { value: '6mo', labelKey: 'xWin6mo', hours: 24 * 180 },
  { value: '1y',  labelKey: 'xWin1y',  hours: 24 * 365 },
  { value: 'all', labelKey: 'xWinAll', hours: null }
];

/** Returns the unix-second cutoff for a given window relative to `now` (default: Date.now()). */
export function windowSinceSec(window: ScanWindow, now: number = Date.now()): number | undefined {
  const entry = SCAN_WINDOWS.find((w) => w.value === window);
  if (!entry || entry.hours == null) return undefined;
  return Math.floor((now - entry.hours * 3600 * 1000) / 1000);
}

/** Filters a post list to those whose createdAt (or fetchedAt fallback) falls inside the window. */
export function filterPostsByWindow(
  posts: XPost[],
  window: ScanWindow,
  now: number = Date.now()
): XPost[] {
  const sinceSec = windowSinceSec(window, now);
  if (sinceSec == null) return posts; // 'all'
  return posts.filter((p) => {
    const iso = p.createdAt || p.fetchedAt;
    if (!iso) return false;
    const ts = Math.floor(new Date(iso).getTime() / 1000);
    return Number.isFinite(ts) && ts >= sinceSec;
  });
}

export async function scanProfile(
  handle: string,
  opts: { limit?: number; window?: ScanWindow } = {}
): Promise<XPost[]> {
  const h = normaliseHandle(handle);
  if (!isValidHandle(h)) throw new Error(`Invalid handle "${handle}"`);
  const limit = opts.limit ?? 50;
  const qs = new URLSearchParams({ handle: h, limit: String(limit) });
  if (opts.window) {
    const since = windowSinceSec(opts.window);
    if (since != null) qs.set('since', String(since));
  }
  const r = await fetch(`/api/x/profile?${qs.toString()}`);
  if (!r.ok) {
    let msg = `HTTP ${r.status}`;
    try { msg = (await r.json()).error || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  const j = await r.json() as { posts: XPost[] };
  return (j.posts ?? []).map((p) => ({
    ...p,
    fetchedAt: p.fetchedAt || new Date().toISOString()
  }));
}

/** Merge incoming posts into a library, deduping by id. Newest first. */
export function mergePosts(existing: XPost[], incoming: XPost[]): XPost[] {
  const seen = new Set(existing.map((p) => p.id));
  const added = incoming.filter((p) => !seen.has(p.id));
  const merged = [...added, ...existing];
  merged.sort((a, b) => +new Date(b.createdAt ?? b.fetchedAt) - +new Date(a.createdAt ?? a.fetchedAt));
  return merged;
}
