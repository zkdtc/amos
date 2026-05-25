import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
    }
  ],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api/yahoo/chart':        sharedProxy('query1', '/api/yahoo/chart',        '/v8/finance/chart'),
      '/api/yahoo/quote':        sharedProxy('query1', '/api/yahoo/quote',        '/v7/finance/quote'),
      '/api/yahoo/quoteSummary': sharedProxy('query2', '/api/yahoo/quoteSummary', '/v10/finance/quoteSummary'),
      '/api/yahoo/options':      sharedProxy('query2', '/api/yahoo/options',      '/v7/finance/options')
    }
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/tests/**/*.test.ts']
  }
});
