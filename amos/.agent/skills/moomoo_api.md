# Moomoo OpenAPI — integration notes

How AMOS connects to moomoo's OpenAPI for US equity quotes + EOD bars, and the
specific gotchas we hit getting it working. Use this when debugging the
`/api/moomoo/*` proxy or wiring a similar service to a new project.

## Architecture (not a REST API)

Moomoo's OpenAPI is **not** an HTTPS REST endpoint with an API key. It requires
a local gateway program called **OpenD** running on the user's machine. SDKs
(Python, Java, C++, C#, JavaScript) speak to OpenD via TCP or WebSocket; OpenD
forwards to moomoo's servers.

For a browser/Vite app the chain is:

```
React  ── HTTP ──▶  Vite plugin /api/moomoo/*  ── WebSocket ──▶  OpenD  ──▶  moomoo
                   (server/moomooBridge.mjs)
```

`server/moomooBridge.mjs` holds a singleton WebSocket connection and exposes
`getQuote(symbol)` / `getBars(symbol, days)`. The Vite plugin in
`vite.config.ts` (`name: 'amos-moomoo'`) adds the HTTP shim.

## OpenD ports — TCP vs WebSocket are different

OpenD exposes TWO separate listeners:

- **TCP port** (default **11111**) — for native SDKs (Python/Java/C++/C#).
- **WebSocket port** (default **33333**) — for the JS SDK only. **Disabled by
  default** in OpenD; user must enable it in OpenD's API panel and pick a port.

The JS SDK (`futu-api` npm) **only** speaks WebSocket. Hitting 11111 with the
JS SDK throws `TypeError: Invalid URL` deep inside `undici`'s WebSocket
constructor, or hangs until our 6-second connect timeout fires.

If `Test-NetConnection 127.0.0.1 <port>` returns `TcpTestSucceeded: False`,
OpenD is not listening on that port — user has to enable WS in OpenD's UI.

## WebSocket key

OpenD's WebSocket panel shows a key string. The SDK MD5-hashes it and sends it
as `websocketKey` in the `InitWebSocket` handshake. If the key is wrong (or
empty when OpenD expects one), the handshake response comes back with no
`s2c`, and our `onlogin` callback throws:

```
TypeError: Cannot read properties of null (reading 'connID')
```

Put the key in `.env.local` → `MOOMOO_OPEND_KEY=...`. Empty string is only
valid if OpenD has WS encryption disabled.

## SDK gotchas

1. **`futu-api` is CommonJS.** ESM-importing named exports fails:
   `import { Common, Qot_Common } from 'futu-api/proto'` → "Named export
   'Common' not found". Use default-import-then-destructure:
   ```js
   import proto from 'futu-api/proto.js';
   const { Common, Qot_Common } = proto;
   ```

2. **`ws.start()` takes positional args, not an object.** The signature is
   `start(ip, port, ssl, key)`. Calling `ws.start({ip, port, ...})` produces
   the same "Invalid URL" error as above because `ip`/`port` end up undefined.

3. **`onlogin(ret, msg)`** fires after the InitConnect handshake completes.
   `ret === true` means logged in. The WebSocket-level error path is
   `ws.onerror` (the SDK logs `发生异常` and an `ErrorEvent`).

4. **Symbol mapping.** Moomoo uses `{market, code}` not a string. For US:
   `{ market: QotMarket.QotMarket_US_Security, code: 'NVDA' }`. Strip leading
   `^` for indices (`^VIX` → code `VIX`). Crypto (`BTC-USD`), `^TNX`, and
   `DX-Y.NYB` are not on moomoo — the bridge throws fast so the caller falls
   through to FMP/Yahoo.

5. **No env-var hot reload.** `.env.local` is loaded once at Vite startup via
   `loadEnv()`. Editing `MOOMOO_OPEND_PORT` / `MOOMOO_OPEND_KEY` requires
   killing Node and rerunning `npm run dev`.

## Verify checklist (in order)

1. `Test-NetConnection 127.0.0.1 <port>` returns `True` — port is bound.
2. `curl http://localhost:5173/api/moomoo/quote?symbol=NVDA` returns JSON with
   `regularMarketPrice`. If error mentions:
   - `Invalid URL` → port is TCP-not-WS, or SDK start() called wrong.
   - `Cannot read 'connID' of null` → wrong/missing `MOOMOO_OPEND_KEY`.
   - `connection timeout` → WS port not listening at all.
3. Bars endpoint: `curl ".../api/moomoo/bars?symbol=NVDA&days=60"` should
   return a JSON array of `{date, open, high, low, close, volume}`.

## Working config (as of 2026-06-03)

`.env.local`:
```
MOOMOO_OPEND_HOST=127.0.0.1
MOOMOO_OPEND_PORT=33333
MOOMOO_OPEND_KEY=<key from OpenD WebSocket panel>
```

`package.json` deps: `futu-api ^9.2.5008`.

Source-order chain in `liveAdapter.ts` and `liveBenchmarks.ts`:
**moomoo → FMP → Yahoo → bundled snapshot**.
