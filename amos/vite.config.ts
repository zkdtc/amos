import { defineConfig } from 'vite';
import fs from 'fs';
import nodePath from 'path';
import react from '@vitejs/plugin-react';
import { execFile } from 'child_process';
import { readFileSync, existsSync, mkdtempSync, readdirSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * Vite dev proxy: routes "/api/yahoo/*" -> Yahoo Finance public endpoints.
 *
 * Yahoo Finance is fussy about callers. To avoid 429 / 401 it requires:
 *   - a real browser User-Agent
 *   - Accept + Accept-Language headers
 *   - a session cookie (otherwise unauthenticated /v7/options + /v10/quoteSummary
 *     return "Too Many Requests" even on the first hit)
 *
 * On Vite start-up we bootstrap a cookie+crumb from https://fc.yahoo.com and
 * inject them into every proxied request. This mirrors the standard pattern
 * used by the `yfinance` and `yahoo_fin` Python libraries.
 *
 * This is still dev-only convenience. v0.3B remains "manual_alpha" mode:
 * live data is read-only.
 */

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

let cookieHeader = '';
let crumb = '';

async function bootstrapYahooSession() {
  try {
    // 1) Get session cookies (A1, A3, GUC, B …) from fc.yahoo.com
    const r1 = await fetch('https://fc.yahoo.com/', {
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      redirect: 'manual'
    });
    const setCookies = r1.headers.get('set-cookie') ?? '';
    // Set-cookie may be multiple cookies joined by commas; just keep "name=val"
    // pairs up to the first ";" of each entry.
    cookieHeader = setCookies
      .split(/,(?=[^;]+?=)/)
      .map((c) => c.split(';')[0].trim())
      .filter(Boolean)
      .join('; ');

    // 2) Get a crumb (needed for quoteSummary). Some endpoints accept either,
    //    but unauthenticated endpoints all do better with a crumb.
    if (cookieHeader) {
      const r2 = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
        headers: {
          'User-Agent': UA,
          Accept: '*/*',
          Cookie: cookieHeader
        }
      });
      crumb = (await r2.text()).trim();
    }
    if (cookieHeader) {
      console.log(`[vite] Yahoo session bootstrapped (cookie=${cookieHeader.length} chars, crumb=${crumb ? 'ok' : 'none'})`);
    } else {
      console.warn('[vite] Yahoo cookie bootstrap returned nothing; proxy will retry per-request.');
    }
  } catch (e) {
    console.warn('[vite] Yahoo session bootstrap failed:', (e as Error).message);
  }
}

// Only bootstrap during `vite` (dev/preview) — not during `vite build`.
const isServe = process.argv.includes('serve') || process.argv.includes('dev') || process.argv.some((a) => a.endsWith('vite.js') || a.endsWith('vite/bin/vite.js'));
const sessionReady: Promise<void> = isServe ? bootstrapYahooSession() : Promise.resolve();
if (isServe) {
  // Re-bootstrap every 30 minutes (cookies last ~1h)
  setInterval(() => { void bootstrapYahooSession(); }, 30 * 60 * 1000).unref?.();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function injectHeaders(proxyReq: any) {
  proxyReq.setHeader('User-Agent', UA);
  proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
  proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
  proxyReq.setHeader('Referer', 'https://finance.yahoo.com/');
  proxyReq.setHeader('Origin', 'https://finance.yahoo.com');
  if (cookieHeader) proxyReq.setHeader('Cookie', cookieHeader);
}

function appendCrumb(url: string | undefined): string {
  if (!crumb || !url) return url ?? '';
  if (url.includes('crumb=')) return url;
  return url + (url.includes('?') ? '&' : '?') + 'crumb=' + encodeURIComponent(crumb);
}

// ── X (Twitter) post fetcher ───────────────────────────────────────────
const NITTER_MIRRORS = [
  'https://nitter.net',
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
  'https://nitter.cz',
  'https://nitter.1d4.us'
];

/**
 * Token derivation used by the public React Tweet embed component and by
 * Twitter's own widgets.js: id * 1e-15 * π, then strip dots / zeros / signs.
 * This is what the syndication CDN expects in the "token" query param.
 */
function syndicationToken(id: string): string {
  try {
    const n = BigInt(id);
    // Compute as floating-point — precision loss doesn't matter, the token is
    // just a derived constant Twitter uses to bind the response to the ID.
    const v = (Number(n) / 1e15) * Math.PI;
    return v.toString().replace(/[.0-]/g, '').slice(0, 11);
  } catch {
    return '';
  }
}

async function tryFetchXPost(author: string, id: string): Promise<unknown | null> {
  // Path 0 (best): cdn.syndication.twimg.com/tweet-result
  // This is the endpoint the official "React Tweet" embed uses. Returns full
  // JSON: user, text, entities, photos, video, favorite_count, etc.
  try {
    const tok = syndicationToken(id);
    if (tok) {
      const url = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${tok}`;
      const r = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json' }
      });
      if (r.ok) {
        const text = await r.text();
        if (text && text !== '{}' && text.length > 5) {
          try {
            const j = JSON.parse(text);
            if (j && j.text) {
              return {
                id,
                url: `https://x.com/${j?.user?.screen_name || author}/status/${id}`,
                author: j?.user?.screen_name || author,
                authorDisplay: j?.user?.name,
                text: String(j.text || '').trim(),
                createdAt: j?.created_at ? new Date(j.created_at).toISOString() : undefined,
                metrics: {
                  likes: j?.favorite_count,
                  reposts: j?.conversation_count,    // approximate
                  views: j?.view_count
                },
                source: 'syndication',
                fetchedAt: new Date().toISOString()
              };
            }
          } catch { /* fall through */ }
        }
      }
    }
  } catch { /* ignore */ }

  // Path 1: publish.twitter.com/oembed (returns embed HTML — text-only, no metrics, but reliable)
  try {
    const url = `https://publish.twitter.com/oembed?url=https://x.com/${author}/status/${id}&omit_script=true&dnt=true`;
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (r.ok) {
      const j = await r.json() as { html?: string; author_name?: string; author_url?: string };
      if (j?.html) {
        // Strip HTML
        const text = j.html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        return {
          id, url: `https://x.com/${author}/status/${id}`,
          author,
          authorDisplay: j.author_name,
          text,
          source: 'syndication',
          fetchedAt: new Date().toISOString()
        };
      }
    }
  } catch { /* ignore */ }

  // Path 2: Nitter mirror list (community-run; we parse the /<author>/status/<id> HTML)
  for (const base of NITTER_MIRRORS) {
    try {
      const r = await fetch(`${base}/${author}/status/${id}`, {
        headers: { 'User-Agent': UA, Accept: 'text/html' }
      });
      if (!r.ok) continue;
      const html = await r.text();
      // Nitter wraps the main tweet in <div class="main-tweet"> ... <div class="tweet-content media-body">…</div>
      const mText = html.match(/<div class="tweet-content[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      const mAuth = html.match(/<a class="fullname"[^>]*>([^<]+)<\/a>/);
      const mDate = html.match(/<a class="tweet-date"[^>]*title="([^"]+)"/);
      const mLikes = html.match(/<span class="icon-heart"[^>]*>[\s\S]*?<\/span>\s*([\d,.]+)/);
      const mRT    = html.match(/<span class="icon-retweet"[^>]*>[\s\S]*?<\/span>\s*([\d,.]+)/);
      const mRep   = html.match(/<span class="icon-comment"[^>]*>[\s\S]*?<\/span>\s*([\d,.]+)/);
      if (!mText) continue;
      const text = mText[1]
        .replace(/<a[^>]*>([^<]+)<\/a>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .trim();
      if (!text) continue;
      const num = (s: string | undefined) =>
        s ? Number(s.replace(/[,.]/g, '')) || undefined : undefined;
      return {
        id, url: `https://x.com/${author}/status/${id}`,
        author,
        authorDisplay: mAuth?.[1],
        text,
        createdAt: mDate ? new Date(mDate[1]).toISOString() : undefined,
        metrics: {
          likes: num(mLikes?.[1]),
          reposts: num(mRT?.[1]),
          replies: num(mRep?.[1])
        },
        source: 'nitter',
        fetchedAt: new Date().toISOString()
      };
    } catch { /* try next mirror */ }
  }

  return null;
}


/**
 * Fetch the latest N posts for a handle via syndication.twitter.com.
 * This is the same endpoint the official React-Tweet profile widget uses.
 */
/** Strip HTML tags and collapse whitespace. */
function stripHtml(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[\t ]+\n/g, '\n')
    .trim();
}

/** Parse Nitter "K"/"M"-suffixed counters into a plain number. */
function parseNitterCount(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const m = raw.trim().replace(/,/g, '').match(/^([\d.]+)\s*([KM]?)$/i);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return undefined;
  const suf = (m[2] || '').toUpperCase();
  return Math.round(n * (suf === 'M' ? 1e6 : suf === 'K' ? 1e3 : 1));
}

const NITTER_PROFILE_MIRRORS = [
  'https://nitter.tiekoetter.com',
  'https://nitter.net',
  'https://nitter.poast.org',
  'https://nitter.privacydev.net'
];


/** Parse Nitter's "May 25, 2026 · 2:19 PM UTC" timestamp. */
function parseNitterDate(raw: string): string | undefined {
  if (!raw) return undefined;
  // Normalise: drop the middle-dot separator, strip a trailing "UTC" (already implied),
  // then let Date parse "May 25, 2026 2:19 PM".
  const cleaned = raw.replace(/[·•]/g, ' ').replace(/\s+UTC\s*$/i, '').trim();
  const d = new Date(cleaned + ' UTC');
  if (!Number.isFinite(d.getTime())) return undefined;
  return d.toISOString();
}

/** Parse a Nitter profile HTML page into normalised post objects. */
function parseNitterProfileHtml(html: string, handle: string, limit: number): unknown[] {
  const items = html.split(/<div class="timeline-item(?![s])/);
  const posts: unknown[] = [];
  for (let i = 1; i < items.length && posts.length < limit; i++) {
    const chunk = '<div class="timeline-item' + items[i].slice(0, 5000);
    const pidM = chunk.match(/\/[A-Za-z0-9_]+\/status\/(\d+)#m/);
    if (!pidM) continue;
    const id = pidM[1];
    const dateM = chunk.match(/<span class="tweet-date"><a href="[^"]+" title="([^"]+)"/);
    const contentM = chunk.match(/<div class="tweet-content media-body" dir="auto">([\s\S]*?)<\/div>\s*<div class="tweet-stats"/);
    const text = contentM ? stripHtml(contentM[1]) : '';
    if (!text) continue;
    const statRe = /class="tweet-stat"><div class="icon-container"><span class="icon-([a-z]+)"[^>]*><\/span>\s*([0-9,KM.\s]*?)\s*<\/div>/g;
    const metrics: any = {};
    let m: RegExpExecArray | null;
    while ((m = statRe.exec(chunk))) {
      const kind = m[1];
      const v = parseNitterCount(m[2]);
      if (v == null) continue;
      if (kind === 'heart') metrics.likes = v;
      else if (kind === 'retweet') metrics.reposts = v;
      else if (kind === 'comment') metrics.replies = v;
      else if (kind === 'views') metrics.views = v;
    }
    const authorDispM = chunk.match(/<a class="fullname"[^>]*>([^<]+)<\/a>/);
    try { posts.push({
      id,
      url: `https://x.com/${handle}/status/${id}`,
      author: handle,
      authorDisplay: authorDispM?.[1]?.trim(),
      text,
      createdAt: dateM ? parseNitterDate(dateM[1]) : undefined,
      metrics: Object.keys(metrics).length ? metrics : undefined,
      source: 'nitter',
      fetchedAt: new Date().toISOString()
    }); } catch { /* skip bad post */ }
  }
  return posts;
}

async function tryFetchXProfile(handle: string, limit: number): Promise<unknown[]> {
  // ─── Pass 1: official syndication endpoint (rich, but heavily rate-limited) ───
  try {
    const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${encodeURIComponent(handle)}?showReplies=false&dnt=true&with_replies=false`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Referer: 'https://platform.twitter.com/',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    if (r.ok) {
      const html = await r.text();
      const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]+?)<\/script>/);
      if (m) {
        let bootstrap: any;
        try { bootstrap = JSON.parse(m[1]); } catch { bootstrap = null; }
        const entries = bootstrap?.props?.pageProps?.timeline?.entries ?? [];
        const posts: unknown[] = [];
        for (const e of entries) {
          const t = e?.content?.tweet;
          if (!t || !t.id_str) continue;
          const author = t.user?.screen_name || handle;
          const text = String(t.full_text || t.text || '').trim();
          if (!text) continue;
          posts.push({
            id: t.id_str,
            url: `https://x.com/${author}/status/${t.id_str}`,
            author,
            authorDisplay: t.user?.name,
            text,
            createdAt: t.created_at ? new Date(t.created_at).toISOString() : undefined,
            metrics: {
              likes: t.favorite_count,
              reposts: t.retweet_count ?? t.conversation_count,
              replies: t.reply_count
            },
            source: 'syndication',
            fetchedAt: new Date().toISOString()
          });
          if (posts.length >= limit) break;
        }
        if (posts.length > 0) return posts;
      }
    }
    if (r.status === 429) {
      // eslint-disable-next-line no-console
      console.warn(`[vite] X syndication 429 for @${handle} — falling back to Nitter mirrors`);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`[vite] X syndication failed for @${handle}:`, (e as Error).message);
  }

  // ─── Pass 2: Nitter mirrors (community-run, but currently more reliable) ──────
  for (const base of NITTER_PROFILE_MIRRORS) {
    try {
      // Nitter mirrors actively block desktop-Chrome UAs (returns a ~5KB stub).
      // A neutral curl-like UA returns the full ~100KB page.
      const r = await fetch(`${base}/${encodeURIComponent(handle)}`, {
        headers: {
          'User-Agent': 'curl/8.6.0',
          Accept: '*/*'
        }
      });
      if (!r.ok) continue;
      const html = await r.text();
      if (html.length < 5000) continue; // rate-limited stub
      const posts = parseNitterProfileHtml(html, handle, limit);
      if (posts.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`[vite] X profile @${handle} via ${base.replace('https://','')} → ${posts.length} posts`);
        return posts;
      }
    } catch {
      /* try next mirror */
    }
  }

  return [];
}

function resolveYtDlp(): string | null {
  // Check $PATH first, then common pip --user install location.
  const candidates = [
    'yt-dlp',
    `${process.env.HOME ?? ''}/.local/bin/yt-dlp`,
    '/usr/local/bin/yt-dlp',
    '/opt/homebrew/bin/yt-dlp'
  ];
  for (const c of candidates) {
    if (c === 'yt-dlp') continue; // skip bare name; exec below will resolve via PATH
    if (existsSync(c)) return c;
  }
  return `${process.env.HOME ?? ''}/.local/bin/yt-dlp`;
}

function runYtDlp(binary: string, args: string[]): Promise<{ stdout: string; stderr: string; code: number | null }> {
  // Don't reject on non-zero exit codes — modern yt-dlp exits non-zero for
  // benign warnings (n-challenge solver missing, ffmpeg missing) even when
  // subtitles are written successfully. The middleware checks the temp dir
  // afterwards for an actual .json3 file instead.
  return new Promise((resolve) => {
    execFile(binary, args, { timeout: 60000, maxBuffer: 32 * 1024 * 1024 }, (err: any, stdout, stderr) => {
      resolve({
        stdout: String(stdout),
        stderr: String(stderr),
        code: err ? (typeof err.code === 'number' ? err.code : 1) : 0
      });
    });
  });
}

const sharedProxy = (host: 'query1' | 'query2', from: string, to: string) => ({
  target: `https://${host}.finance.yahoo.com`,
  changeOrigin: true,
  secure: true,
  rewrite: (path: string) => path.replace(new RegExp(`^${from}`), to),
  configure: (proxy: any) => {
    proxy.on('proxyReq', (proxyReq: any, req: any) => {
      injectHeaders(proxyReq);
      const withCrumb = appendCrumb(req.url);
      if (withCrumb !== req.url) {
        proxyReq.path = withCrumb.replace(new RegExp(`^${from}`), to);
      }
    });
    proxy.on('proxyRes', async (proxyRes: any, req: any) => {
      if (proxyRes.statusCode === 401 || proxyRes.statusCode === 429) {
        console.warn(`[vite] Yahoo proxy ${proxyRes.statusCode} on ${req.url} — re-bootstrapping session`);
        await bootstrapYahooSession();
      }
    });
  }
});

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'amos-yahoo-bootstrap',
      configureServer(server) {
        // Block the first request until the bootstrap completes so we don't 429 immediately.
        server.middlewares.use(async (_req: any, _res: any, next: () => void) => {
          await sessionReady;
          next();
        });
      }
    },
    {
      // ─── /api/x/profile?handle=<h>&limit=N ─────────────────────────────
      // Returns the latest N posts for a handle by parsing the official
      // React-Tweet profile widget JSON from syndication.twitter.com.
      name: 'amos-x-profile',
      configureServer(server) {
        server.middlewares.use('/api/x/profile', async (req: any, res: any) => {
          try {
            const u = new URL(req.url || '', 'http://localhost');
            const handle = (u.searchParams.get('handle') || '').trim().replace(/^@/, '');
            const limit = Math.min(50, Math.max(1, Number(u.searchParams.get('limit') || '20')));
            const sinceRaw = u.searchParams.get('since');
            const sinceSec = sinceRaw && /^\d+$/.test(sinceRaw) ? parseInt(sinceRaw, 10) : null;
            if (!/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid handle' }));
              return;
            }
            const posts = await tryFetchXProfile(handle, limit);
            const filtered = sinceSec
              ? posts.filter((p: any) => {
                  if (!p?.createdAt) return false;
                  const ts = Math.floor(new Date(p.createdAt).getTime() / 1000);
                  return Number.isFinite(ts) && ts >= sinceSec;
                })
              : posts;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              handle,
              count: filtered.length,
              totalScanned: posts.length,
              sinceSec,
              posts: filtered
            }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e?.message || e) }));
          }
        });
      }
    },
    {
      // ─── /api/x/post?url=<post-url> ────────────────────────────────────
      // X (Twitter) has locked down public scraping. We try, in order:
      //   1) Nitter mirror list (community-run, flaky)
      //   2) syndication.twitter.com/srv/embed/Tweet (unauthenticated oEmbed)
      //   3) publish.twitter.com/oembed (returns embed HTML only — text only)
      //
      // If everything fails the user is told to use Manual Paste instead.
      name: 'amos-x-post',
      configureServer(server) {
        server.middlewares.use('/api/x/post', async (req: any, res: any) => {
          try {
            const u = new URL(req.url || '', 'http://localhost');
            const target = u.searchParams.get('url') || '';
            const m = target.match(/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]{1,15})\/status\/(\d{1,25})/i);
            if (!m) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid X post URL' }));
              return;
            }
            const author = m[1];
            const id = m[2];
            const post = await tryFetchXPost(author, id);
            if (!post) {
              res.statusCode = 502;
              res.end(JSON.stringify({
                error: 'All public X scraping paths failed (Nitter mirrors down, syndication blocked). Use Manual Paste below.'
              }));
              return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(post));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e?.message || e) }));
          }
        });
      }
    },
    {
      // ─── /api/youtube/transcript?v=<id>&lang=<lang> ────────────────────
      // YouTube has been blocking direct /api/timedtext fetches in 2025-26.
      // We invoke yt-dlp server-side instead — it impersonates the official
      // mobile clients and is currently the only reliable transcript path.
      //
      // Looks for yt-dlp on PATH, then ~/.local/bin/yt-dlp.
      // Returns the raw json3 captions body as JSON.
      // Errors include actionable instructions for the user.
      name: 'amos-yt-transcript',
      configureServer(server) {
        server.middlewares.use('/api/youtube/transcript', async (req: any, res: any) => {
          try {
            const u = new URL(req.url || '', 'http://localhost');
            const v = u.searchParams.get('v') || '';
            const lang = (u.searchParams.get('lang') || 'en').trim();
            if (!/^[A-Za-z0-9_-]{11}$/.test(v)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid or missing ?v=<11-char id>' }));
              return;
            }
            const ytdlp = resolveYtDlp();
            if (!ytdlp) {
              res.statusCode = 503;
              res.end(JSON.stringify({
                error: 'yt-dlp is not installed on the server. Install with: pip3 install --user yt-dlp'
              }));
              return;
            }
            const dir = mkdtempSync(join(tmpdir(), 'amos-yt-'));
            // Try the requested language plus a few common fallbacks.
            // Deduped so yt-dlp doesn't download translated copies twice.
            const root = lang.split('-')[0];
            const seen = new Set<string>();
            const langSpec = [lang, `${root}-Hans`, `${root}-Hant`, root, 'en', 'en-US']
              .filter((l) => l && !seen.has(l) && seen.add(l))
              .join(',');

            // Pass 1: preferred languages
            const passOne = await runYtDlp(ytdlp, [
              '--js-runtimes', 'node',
              '--skip-download',
              '--write-auto-subs',
              '--write-subs',
              '--sub-langs', langSpec,
              '--sub-format', 'json3',
              '--ignore-no-formats-error',
              '-o', join(dir, '%(id)s'),
              `https://www.youtube.com/watch?v=${v}`
            ]);
            let files = readdirSync(dir).filter((f) => f.endsWith('.json3'));

            // Pass 2: if no files came back, the video probably has captions in
            // a language other than the preferred one — request ALL available.
            let passTwo: { code: number | null; stderr: string } | null = null;
            if (files.length === 0) {
              passTwo = await runYtDlp(ytdlp, [
                '--js-runtimes', 'node',
                '--skip-download',
                '--write-auto-subs',
                '--write-subs',
                '--sub-langs', 'all',
                '--sub-format', 'json3',
                '--ignore-no-formats-error',
                '-o', join(dir, '%(id)s'),
                `https://www.youtube.com/watch?v=${v}`
              ]);
              files = readdirSync(dir).filter((f) => f.endsWith('.json3'));
            }

            try {
              if (files.length === 0) {
                const lastErr = passTwo ?? passOne;
                res.statusCode = 404;
                res.end(JSON.stringify({
                  error: 'No subtitles available for this video.',
                  ytDlpExit: lastErr.code,
                  ytDlpStderrTail: lastErr.stderr.split('\n').slice(-10).join('\n')
                }));
                return;
              }
              // Filenames are "<id>.<langCode>.json3".  yt-dlp also writes
              // translated copies as "<id>.<srcLang>-<dstLang>.json3"; we
              // prefer the original (non-translated) one.
              const isTranslated = (f: string) => {
                const stem = f.replace(/\.json3$/, '');
                const lc = stem.slice(stem.indexOf('.') + 1);
                // A langCode like "zh-Hant-zh-Hans" → translated
                // Real langCodes are at most 2 hyphens (e.g. "zh-Hant", "en-US").
                const parts = lc.split('-');
                if (parts.length <= 2) return false;
                // Translated form has the dst lang at the end matching another
                // primary track — easiest heuristic is just: ≥3 hyphen parts.
                return parts.length >= 3;
              };
              const original = files.filter((f) => !isTranslated(f));
              const pool = original.length > 0 ? original : files;

              const exact = pool.find((f) => f.includes(`.${lang}.`));
              const sameRoot = pool.find((f) => new RegExp(`\\.${root}[-.]`).test(f));
              const picked = exact || sameRoot || pool[0];
              const stem = picked.replace(/\.json3$/, '');
              const usedLang = stem.slice(stem.indexOf('.') + 1);
              const body = readFileSync(join(dir, picked), 'utf8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ language: usedLang, body }));
            } finally {
              try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
            }
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e?.message || e) }));
          }
        });
      }
    },
    // ─── /api/user-data/* — server-side persistence ──────────────────────────
    {
      name: 'amos-user-data',
      configureServer(server: any) {
        const USER_DATA_DIR = nodePath.join(nodePath.dirname(nodePath.resolve('vite.config.ts')), 'user-data');
        const ALLOWED_KEYS = ['x-posts', 'x-follows', 'yt-library', 'tickers'];
        server.middlewares.use('/api/user-data', (req: any, res: any) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
          const key = (req.url || '').replace(/^\//, '').replace(/[^a-z0-9-]/g, '');
          if (!ALLOWED_KEYS.includes(key)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Unknown key: ${key}` }));
            return;
          }
          const filePath = nodePath.join(USER_DATA_DIR, `${key}.json`);
          if (req.method === 'GET') {
            try {
              const data = fs.existsSync(filePath)
                ? fs.readFileSync(filePath, 'utf8')
                : 'null';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } catch {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Read failed' }));
            }
            return;
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                JSON.parse(body); // validate
                fs.mkdirSync(USER_DATA_DIR, { recursive: true });
                fs.writeFileSync(filePath, body, 'utf8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, key, bytes: body.length }));
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON or write failed' }));
              }
            });
            return;
          }
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        });
      }
    },
  ],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api/yahoo/chart':        sharedProxy('query1', '/api/yahoo/chart',        '/v8/finance/chart'),
      '/api/yahoo/quote':        sharedProxy('query1', '/api/yahoo/quote',        '/v7/finance/quote'),
      '/api/yahoo/quoteSummary': sharedProxy('query2', '/api/yahoo/quoteSummary', '/v10/finance/quoteSummary'),
      '/api/yahoo/options':      sharedProxy('query2', '/api/yahoo/options',      '/v7/finance/options'),

      // ── YouTube transcripts ───────────────────────────────────────────
      // Caption track XML / json3 → no auth required, but CORS blocks it.
      '/api/youtube/timedtext': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path: string) => path.replace(/^\/api\/youtube\/timedtext/, '/api/timedtext'),
        configure: (proxy: any) => {
          proxy.on('proxyReq', (proxyReq: any) => {
            proxyReq.setHeader('User-Agent', UA);
            proxyReq.setHeader('Accept', '*/*');
            proxyReq.setHeader('Referer', 'https://www.youtube.com/');
          });
        }
      },
      // Watch page HTML → used to discover available caption tracks.
      '/api/youtube/watch': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path: string) => path.replace(/^\/api\/youtube\/watch/, '/watch'),
        configure: (proxy: any) => {
          proxy.on('proxyReq', (proxyReq: any) => {
            proxyReq.setHeader('User-Agent', UA);
            proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,*/*;q=0.8');
            proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
          });
        }
      }
    }
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/tests/**/*.test.ts']
  }
});
