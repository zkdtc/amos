/**
 * Moomoo adapter — talks to the Vite-hosted /api/moomoo/* shim, which in turn
 * connects to a locally-running OpenD gateway via the futu-api WebSocket SDK.
 *
 * Coverage: US equities + ETFs + some indices (VIX). Crypto, ^TNX, DXY are
 * not supported here — callers fall through to FMP/Yahoo.
 */

import type { Bar, YahooQuote } from './liveAdapter';

export async function fetchMoomooBars(symbol: string, days = 180): Promise<Bar[]> {
  const url = `/api/moomoo/bars?symbol=${encodeURIComponent(symbol)}&days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`moomoo bars failed for ${symbol}: ${res.status}`);
  const bars = (await res.json()) as Bar[];
  if (!Array.isArray(bars) || bars.length === 0) throw new Error(`moomoo: no bars for ${symbol}`);
  return bars;
}

export async function fetchMoomooQuote(symbol: string): Promise<YahooQuote> {
  const url = `/api/moomoo/quote?symbol=${encodeURIComponent(symbol)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`moomoo quote failed for ${symbol}: ${res.status}`);
  return (await res.json()) as YahooQuote;
}

export async function fetchMoomooChartAndQuote(
  symbol: string,
  days = 180,
): Promise<{ quote: YahooQuote; bars: Bar[] }> {
  const [bars, quote] = await Promise.all([
    fetchMoomooBars(symbol, days),
    fetchMoomooQuote(symbol),
  ]);
  return { bars, quote };
}
