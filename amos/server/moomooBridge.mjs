/**
 * Moomoo OpenD bridge.
 *
 * Maintains a single WebSocket connection to a locally-running OpenD gateway
 * and exposes getQuote() / getBars() in the same shape liveAdapter.ts already
 * uses (Bar, YahooQuote).
 *
 * Requires OpenD running locally — see README "Moomoo OpenD setup".
 * Env vars:
 *   MOOMOO_OPEND_HOST  (default 127.0.0.1)
 *   MOOMOO_OPEND_PORT  (default 33333  — OpenD WebSocket port)
 *   MOOMOO_OPEND_KEY   (the "ws_key" from OpenD config; empty if disabled)
 */

import ftWebsocket from 'futu-api';
import proto from 'futu-api/proto.js';

const { Common, Qot_Common } = proto;
const { RetType } = Common;
const { RehabType, KLType, QotMarket } = Qot_Common;

const HOST = process.env.MOOMOO_OPEND_HOST || '127.0.0.1';
const PORT = parseInt(process.env.MOOMOO_OPEND_PORT || '33333', 10);
const KEY  = process.env.MOOMOO_OPEND_KEY || '';

let wsPromise = null;

function connect() {
  if (wsPromise) return wsPromise;
  wsPromise = new Promise((resolve, reject) => {
    let ws;
    try {
      ws = new ftWebsocket();
    } catch (e) { reject(e); return; }
    let done = false;
    ws.onlogin = (ret, msg) => {
      console.log(`[moomoo] onlogin ret=${ret} msg=${msg}`);
      if (done) return;
      done = true;
      if (ret) {
        console.log(`[moomoo] OpenD connected ${HOST}:${PORT}`);
        resolve(ws);
      } else {
        wsPromise = null;
        reject(new Error(`OpenD login failed: ${msg}`));
      }
    };
    ws.onDisconnect = (msg) => {
      console.warn('[moomoo] onDisconnect:', msg);
      wsPromise = null;
      if (!done) { done = true; reject(new Error(`OpenD disconnected: ${msg}`)); }
    };
    ws.onConnect = (ret, msg) => { console.log(`[moomoo] onConnect ret=${ret} msg=${msg}`); };
    try {
      console.log(`[moomoo] connecting to ${HOST}:${PORT} (key=${KEY ? 'set' : 'empty'})`);
      ws.start(HOST, PORT, false, KEY);
    } catch (e) {
      console.error('[moomoo] start threw:', e);
      wsPromise = null;
      reject(e);
      return;
    }
    setTimeout(() => {
      if (!done) {
        done = true;
        wsPromise = null;
        reject(new Error(`OpenD connection timeout (${HOST}:${PORT}) — is OpenD running?`));
      }
    }, 6000);
  });
  return wsPromise;
}

/**
 * Map app symbols to moomoo Security proto.
 * - "NVDA"      -> US.NVDA  (regular US equity / ETF)
 * - "^VIX"      -> US.VIX   (index)
 * - "BTC-USD"   -> not supported (moomoo doesn't cover crypto here)
 * - "^TNX"/"DX-Y.NYB" -> not supported (use Yahoo fallback)
 */
function usSecurity(symbol) {
  if (!symbol) throw new Error('empty symbol');
  if (symbol.includes('-USD')) throw new Error(`moomoo: crypto pair ${symbol} not supported`);
  if (symbol === 'DX-Y.NYB') throw new Error(`moomoo: ${symbol} not supported`);
  const code = symbol.replace(/^\^/, '').toUpperCase();
  return { market: QotMarket.QotMarket_US_Security, code };
}

export async function getBars(symbol, days = 180) {
  const ws = await connect();
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().slice(0, 10);
  const req = {
    c2s: {
      rehabType: RehabType.RehabType_Forward,
      klType: KLType.KLType_Day,
      security: usSecurity(symbol),
      beginTime: fmt(from),
      endTime: fmt(to),
      maxAckKLNum: 1000,
      needKLFieldsFlag: 0xFFFFFFFF >>> 0,
    },
  };
  const res = await ws.RequestHistoryKL(req);
  if (res.retType !== RetType.RetType_Succeed) {
    throw new Error(`moomoo RequestHistoryKL ${symbol}: ${res.retMsg}`);
  }
  const klList = res.s2c?.klList || [];
  return klList.map((k) => ({
    date: (k.time || '').slice(0, 10),
    open: k.openPrice,
    high: k.highPrice,
    low: k.lowPrice,
    close: k.closePrice,
    volume: Number(k.volume) || 0,
  })).filter((b) => b.date && Number.isFinite(b.close));
}

export async function getQuote(symbol) {
  const ws = await connect();
  const req = { c2s: { securityList: [usSecurity(symbol)] } };
  const res = await ws.GetSecuritySnapshot(req);
  if (res.retType !== RetType.RetType_Succeed) {
    throw new Error(`moomoo GetSecuritySnapshot ${symbol}: ${res.retMsg}`);
  }
  const snap = res.s2c?.snapshotList?.[0];
  if (!snap) throw new Error(`moomoo: no snapshot for ${symbol}`);
  const b = snap.basic || {};
  const e = snap.equityExData || {};
  const last = b.lastClosePrice;
  return {
    symbol,
    regularMarketPrice: b.curPrice,
    regularMarketTime: Math.floor(Date.now() / 1000),
    regularMarketChangePercent: last ? ((b.curPrice - last) / last) * 100 : 0,
    regularMarketVolume: Number(b.volume) || 0,
    marketCap: e.marketVal,
    fiftyTwoWeekHigh: b.highPrice52Weeks,
    fiftyTwoWeekLow: b.lowPrice52Weeks,
    shortName: b.name,
  };
}
