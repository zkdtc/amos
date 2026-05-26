/**
 * YouTube transcript adapter.
 *
 * Fetches captions via YouTube's public timedtext endpoint — no API key required.
 *   GET https://www.youtube.com/api/timedtext?lang=<lang>&v=<videoId>&fmt=json3
 *
 * Browsers can't hit youtube.com cross-origin so we proxy through Vite:
 *   /api/youtube/timedtext?v=<id>&lang=<lang>&fmt=json3
 *   /api/youtube/watch?v=<id>   (used to discover available caption tracks)
 *
 * This is a RESEARCH ONLY tool. Transcripts can be auto-generated and
 * imperfect. The AMOS guardrails treat the search results as evidence
 * candidates, never as trade signals.
 */

export interface TranscriptCue {
  start: number;   // seconds
  duration: number;
  text: string;
}

export interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
  name?: string;
  kind?: 'asr' | 'standard'; // asr = auto-generated
}

export interface VideoTranscript {
  videoId: string;
  url: string;             // canonical https URL
  title: string;
  channel?: string;
  fetchedAt: string;       // ISO
  language: string;
  cues: TranscriptCue[];
  source: 'live' | 'cached';
  raw?: unknown;
}

const STORAGE_KEY = 'amos-yt-transcripts-v1';
/* ─── Disk persistence ──────────────────────────────────────────────────── */
async function saveToDisk(key: string, data: unknown): Promise<void> {
  try {
    await fetch(`/api/user-data/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch { /* graceful */ }
}
async function loadFromDisk<T>(key: string): Promise<T | null> {
  try {
    const r = await fetch(`/api/user-data/${key}`);
    if (!r.ok) return null;
    const d = await r.json();
    return d as T;
  } catch { return null; }
}



// ── ID extraction ─────────────────────────────────────────────────────

export function extractVideoId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  // Bare 11-char id
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    const v = u.searchParams.get('v');
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    if (u.hostname === 'youtu.be') {
      const m = u.pathname.replace(/^\//, '').match(/^[A-Za-z0-9_-]{11}/);
      if (m) return m[0];
    }
    // /embed/<id> or /shorts/<id> or /live/<id>
    const m = u.pathname.match(/\/(embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/);
    if (m) return m[2];
  } catch {
    /* not a URL */
  }
  // last-ditch: try to find any 11-char id in the string
  const m = s.match(/[A-Za-z0-9_-]{11}/);
  return m ? m[0] : null;
}

export function youtubeWatchUrl(videoId: string, atSec?: number): string {
  return `https://www.youtube.com/watch?v=${videoId}${atSec ? `&t=${Math.floor(atSec)}s` : ''}`;
}

// ── Metadata + caption-track discovery (scrapes /watch page) ─────────

interface DiscoveredMeta {
  title: string;
  channel?: string;
  tracks: CaptionTrack[];
}

export async function discoverMeta(videoId: string): Promise<DiscoveredMeta> {
  let title = `YouTube video ${videoId}`;
  let channel: string | undefined;
  let tracks: CaptionTrack[] = [];

  // Scrape the watch page HTML — it contains both the title/channel AND the
  // real `captionTracks` array (with signed baseUrls).
  try {
    const r = await fetch(`/api/youtube/watch?v=${videoId}`);
    if (r.ok) {
      const html = await r.text();

      // Title (prefer the JSON-embedded one — survives YouTube's title suffix).
      const mt = html.match(/"videoDetails":\{"videoId":"[^"]+","title":"([^"]+)"/);
      if (mt) title = decodeJsonString(mt[1]);
      else {
        const mt2 = html.match(/<title>([^<]+?)\s*-\s*YouTube<\/title>/);
        if (mt2) title = mt2[1];
      }

      const mc = html.match(/"author":"([^"]+)"/);
      if (mc) channel = decodeJsonString(mc[1]);

      // captionTracks block. Use a non-greedy match anchored by the next sibling
      // ("audioTracks" or "translationLanguages") so we capture nested arrays.
      const mCap = html.match(/"captionTracks":(\[.*?\])\s*,\s*"(?:audioTracks|translationLanguages|defaultAudioTrackIndex)"/s);
      if (mCap) {
        try {
          const arr = JSON.parse(mCap[1]) as Array<{
            baseUrl: string; languageCode: string; kind?: string; name?: { simpleText?: string };
          }>;
          tracks = arr.map((t) => ({
            // baseUrls in the HTML are \u0026-escaped (encoded ampersands).
            // JSON.parse already turns \u0026 into &, but be defensive.
            baseUrl: t.baseUrl.replace(/\\u0026/g, '&'),
            languageCode: t.languageCode,
            name: t.name?.simpleText,
            kind: t.kind === 'asr' ? 'asr' : 'standard'
          }));
        } catch (e) {
          console.warn('[yt] captionTracks JSON parse failed', e);
        }
      }
    }
  } catch { /* ignore */ }

  // Fallback metadata via noembed if we still don't have a title.
  if (title === `YouTube video ${videoId}`) {
    try {
      const r = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      if (r.ok) {
        const j = await r.json();
        if (j?.title) title = j.title;
        if (j?.author_name && !channel) channel = j.author_name;
      }
    } catch { /* ignore */ }
  }

  return { title, channel, tracks };
}

function decodeJsonString(s: string): string {
  // Handles \" \\ \/ \uXXXX inside an already-extracted JSON string body.
  try { return JSON.parse('"' + s + '"'); } catch { return s; }
}

// ── Transcript fetch ──────────────────────────────────────────────────

/**
 * Fetch transcript cues for a given video.
 *
 * Strategy:
 *   1) Try a direct `timedtext` request with the preferred language.
 *   2) If empty, scrape /watch HTML to discover caption tracks and pick the
 *      best-available track (preferred lang → English → first ASR → first any).
 *   3) Each captionTrack baseUrl already includes the auth params; we re-route
 *      it through our proxy by extracting query params.
 */
export async function fetchTranscript(
  videoIdOrUrl: string,
  preferredLang = 'en'
): Promise<VideoTranscript> {
  const videoId = extractVideoId(videoIdOrUrl);
  if (!videoId) throw new Error(`Could not extract YouTube video ID from "${videoIdOrUrl}"`);

  // Strategy:
  //   1) Primary: server-side `/api/youtube/transcript` (uses yt-dlp). This
  //      is the only reliable path since YouTube started blocking direct
  //      /api/timedtext fetches in late 2025.
  //   2) Fallback: scrape the watch page → signed captionTracks → /api/youtube/timedtext.
  //   3) Last-resort: bare /api/youtube/timedtext?lang=…
  //
  // Title/channel come from the watch-page scrape so we get them either way.
  const meta = await discoverMeta(videoId);

  let cues: TranscriptCue[] = [];
  let usedLang = preferredLang;
  let primaryErrorMessage: string | null = null;

  // ── 1) yt-dlp server route ────────────────────────────────────────────
  try {
    const r = await fetch(`/api/youtube/transcript?v=${videoId}&lang=${encodeURIComponent(preferredLang)}`);
    if (r.ok) {
      const j = await r.json() as { language: string; body: string };
      const parsed = parseTimedtextJson3(j.body);
      if (parsed.length > 0) {
        cues = parsed;
        usedLang = j.language;
      }
    } else {
      try {
        const j = await r.json();
        if (j?.error) primaryErrorMessage = String(j.error);
      } catch { /* ignore */ }
    }
  } catch (e) {
    primaryErrorMessage = (e as Error).message;
  }

  // ── 2) Signed captionTracks from watch HTML ──────────────────────────
  if (cues.length === 0 && meta.tracks.length > 0) {
    const chosen = pickBestTrack(meta.tracks, preferredLang);
    if (chosen) {
      const got = await tryFetchTrack(chosen);
      if (got.length > 0) { cues = got; usedLang = chosen.languageCode; }
      if (cues.length === 0) {
        for (const alt of meta.tracks) {
          if (alt === chosen) continue;
          const g = await tryFetchTrack(alt);
          if (g.length > 0) { cues = g; usedLang = alt.languageCode; break; }
        }
      }
    }
  }

  // ── 3) Bare timedtext (rarely works now) ─────────────────────────────
  if (cues.length === 0) {
    cues = await tryFetchCues(videoId, preferredLang);
  }

  if (cues.length === 0) {
    const hint = primaryErrorMessage
      ? primaryErrorMessage
      : meta.tracks.length === 0
        ? 'No caption tracks were discovered in the player response.'
        : `Captions exist (${meta.tracks.map((t) => t.languageCode).join(', ')}) but YouTube refused all fetches.`;
    throw new Error(
      `Could not fetch transcript for ${videoId}. ${hint} ` +
      `If the error mentions yt-dlp, install it on the dev server: pip3 install --user yt-dlp`
    );
  }

  return {
    videoId,
    url: youtubeWatchUrl(videoId),
    title: meta.title,
    channel: meta.channel,
    fetchedAt: new Date().toISOString(),
    language: usedLang,
    cues,
    source: 'live'
  };
}

export function pickBestTrack(tracks: CaptionTrack[], preferred: string): CaptionTrack | null {
  if (tracks.length === 0) return null;
  const p = preferred.toLowerCase();
  // 1. Exact match
  const exact = tracks.find((t) => t.languageCode.toLowerCase() === p);
  if (exact) return exact;
  // 2. Same root language ("zh" matches "zh-Hans", "zh-Hant", "zh-CN", etc.;
  //    "en" matches "en-US", "en-GB"). Prefer human-made over ASR.
  const root = p.split('-')[0];
  const sameRoot = tracks.filter((t) => t.languageCode.toLowerCase().split('-')[0] === root);
  if (sameRoot.length > 0) {
    const human = sameRoot.find((t) => t.kind !== 'asr');
    if (human) return human;
    return sameRoot[0];
  }
  // 3. English fallback
  const english = tracks.find((t) => t.languageCode.toLowerCase().startsWith('en'));
  if (english) return english;
  // 4. Any human-made
  const human = tracks.find((t) => t.kind !== 'asr');
  if (human) return human;
  // 5. Anything
  return tracks[0];
}

async function tryFetchCues(videoId: string, lang: string): Promise<TranscriptCue[]> {
  try {
    const r = await fetch(`/api/youtube/timedtext?v=${videoId}&lang=${encodeURIComponent(lang)}&fmt=json3`);
    if (!r.ok) return [];
    const text = await r.text();
    if (!text.trim()) return [];
    return parseTimedtextJson3(text);
  } catch {
    return [];
  }
}

async function tryFetchTrack(track: CaptionTrack): Promise<TranscriptCue[]> {
  try {
    // The discovered baseUrl already includes the necessary signature params.
    // Re-route through our proxy by keeping its querystring intact. The URL
    // is absolute (https://www.youtube.com/api/timedtext?…) so we parse it
    // safely with the URL constructor.
    let u: URL;
    try { u = new URL(track.baseUrl); }
    catch { u = new URL(track.baseUrl, 'https://www.youtube.com'); }
    u.searchParams.set('fmt', 'json3');
    const proxied = `/api/youtube/timedtext${u.search}`;
    const r = await fetch(proxied);
    if (!r.ok) return [];
    const text = await r.text();
    return parseTimedtextJson3(text);
  } catch (e) {
    console.warn('[yt] tryFetchTrack failed', e);
    return [];
  }
}

/**
 * Parse timedtext json3 format.
 *
 * Shape: { events: [{ tStartMs, dDurationMs, segs: [{ utf8 }] }, ...] }
 */
export function parseTimedtextJson3(raw: string): TranscriptCue[] {
  let obj: { events?: Array<{ tStartMs?: number; dDurationMs?: number; segs?: Array<{ utf8?: string }> }> };
  try {
    obj = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!obj?.events?.length) return [];
  const out: TranscriptCue[] = [];
  for (const e of obj.events) {
    if (!e.segs || e.tStartMs == null) continue;
    const text = e.segs.map((s) => s.utf8 ?? '').join('').replace(/\n/g, ' ').trim();
    if (!text || text === '[Music]') continue;
    out.push({
      start: e.tStartMs / 1000,
      duration: (e.dDurationMs ?? 0) / 1000,
      text
    });
  }
  // Merge tiny consecutive cues (<1.5s) into the previous for cleaner search.
  const merged: TranscriptCue[] = [];
  for (const c of out) {
    const last = merged[merged.length - 1];
    if (last && c.start - (last.start + last.duration) < 0.4 && (last.text.length + c.text.length) < 220) {
      last.text = (last.text + ' ' + c.text).trim();
      last.duration = c.start + c.duration - last.start;
    } else {
      merged.push({ ...c });
    }
  }
  return merged;
}

// ── Library persistence ──────────────────────────────────────────────

export function loadLibrary(): VideoTranscript[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as VideoTranscript[];
    return Array.isArray(arr) ? arr.map((v) => ({ ...v, source: 'cached' })) : [];
  } catch {
    return [];
  }
}

export function saveLibrary(items: VideoTranscript[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* full quota → silently drop */
  }
  void saveToDisk('yt-library', items);
}

export async function hydrateYTLibraryFromDisk(): Promise<VideoTranscript[]> {
  const disk = await loadFromDisk<VideoTranscript[]>('yt-library');
  const local = loadLibrary();
  if (!disk || !Array.isArray(disk) || disk.length === 0) return local;
  const seen = new Set(local.map((v: VideoTranscript) => v.videoId));
  const merged = [...local, ...disk.filter((v: VideoTranscript) => !seen.has(v.videoId))];
  saveLibrary(merged);
  return merged;
}

// ── Search ───────────────────────────────────────────────────────────

export interface SearchHit {
  video: VideoTranscript;
  cueIndex: number;
  cue: TranscriptCue;
  score: number;
  highlightHtml: string;     // text with <mark> around matched tokens (safe — escaped)
  jumpUrl: string;
}

const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','of','to','in','on','at','for','by','with',
  'is','are','was','were','be','been','being','have','has','had','do','does','did',
  'this','that','these','those','it','its','as','from'
]);

export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s$#-]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t) && t.length > 1);
}

/**
 * Search all cues across all videos. Pure function.
 * Scoring: +1 per token hit, +1 if a $TICKER or #TAG matches.
 * Returns top `limit` hits, sorted desc.
 */
export function searchTranscripts(
  videos: VideoTranscript[],
  query: string,
  limit = 50
): SearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const hits: SearchHit[] = [];

  for (const v of videos) {
    for (let i = 0; i < v.cues.length; i++) {
      const cue = v.cues[i];
      const haystack = cue.text.toLowerCase();
      let score = 0;
      const matches: string[] = [];
      for (const tok of tokens) {
        if (haystack.includes(tok)) {
          score += 1;
          matches.push(tok);
          // Bonus: ticker-shaped tokens upper-case in the text
          if (/^[A-Z]{2,5}$/.test(tok.toUpperCase()) && cue.text.includes(tok.toUpperCase())) {
            score += 1;
          }
        }
      }
      if (score === 0) continue;
      hits.push({
        video: v,
        cueIndex: i,
        cue,
        score,
        highlightHtml: highlight(cue.text, matches),
        jumpUrl: youtubeWatchUrl(v.videoId, cue.start)
      });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.cue.start - b.cue.start);
  return hits.slice(0, limit);
}

function highlight(text: string, matches: string[]): string {
  // Escape HTML first
  const esc = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  if (matches.length === 0) return esc;
  const pattern = matches
    .map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
    .join('|');
  return esc.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
}

export function formatTimestamp(sec: number): string {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  return `${m}:${String(ss).padStart(2, '0')}`;
}
