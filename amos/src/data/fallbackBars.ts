/**
 * Fallback bars loader.
 *
 * Some Yahoo Finance endpoints rate-limit aggressively by IP. When that happens,
 * the v0.3C "intelligence" panels (Personality Radar, Valuation Battle Map,
 * Narrative Lifecycle, Multi-Anchor Gann, AVWAP, Macro Regime, RS) would
 * silently render empty.
 *
 * To preserve the user-facing promise of "the metrics are always there",
 * we ship a snapshot of the last successful Yahoo pull as a sample file at
 * /sample-data/fallback-bars.json. The live adapter consults this file
 * whenever a live fetch fails for a symbol.
 *
 * The fallback is clearly labelled as cached in the UI (data_quality changes
 * to "cached_fallback_not_live") so guardrails remain honest.
 */

import type { Bar, YahooQuote } from './liveAdapter';

export interface FallbackTicker {
  symbol: string;
  regularMarketPrice: number;
  previousClose: number;
  regularMarketTime: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
  bars: Bar[];
}

export interface FallbackBundle {
  fetchedAt: string;
  source: string;
  tickers: Record<string, FallbackTicker>;
}

let cache: FallbackBundle | null = null;

export async function loadFallbackBundle(): Promise<FallbackBundle | null> {
  if (cache) return cache;
  try {
    const res = await fetch('/sample-data/fallback-bars.json');
    if (!res.ok) return null;
    cache = (await res.json()) as FallbackBundle;
    return cache;
  } catch {
    return null;
  }
}

export async function getFallback(symbol: string): Promise<FallbackTicker | null> {
  const b = await loadFallbackBundle();
  if (!b) return null;
  return b.tickers[symbol] ?? null;
}

/** Build a YahooQuote-shaped object from a fallback ticker entry. */
export function quoteFromFallback(ft: FallbackTicker): YahooQuote {
  const chgPct = ft.previousClose
    ? ((ft.regularMarketPrice - ft.previousClose) / ft.previousClose) * 100
    : 0;
  return {
    symbol: ft.symbol,
    regularMarketPrice: ft.regularMarketPrice,
    regularMarketTime: ft.regularMarketTime,
    regularMarketChangePercent: chgPct,
    regularMarketVolume: ft.regularMarketVolume ?? 0,
    fiftyTwoWeekHigh: ft.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: ft.fiftyTwoWeekLow,
    fiftyDayAverage: ft.fiftyDayAverage,
    twoHundredDayAverage: ft.twoHundredDayAverage
  };
}
