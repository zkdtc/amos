/**
 * FMP (Financial Modeling Prep) adapter.
 *
 * Free-tier coverage (observed 2026-06):
 *   - /profile?symbol=X         → works for ALL US stocks/ETFs (current price)
 *   - /historical-price-eod/*   → only mega-caps; mid-caps + most ETFs return 402
 *
 * Strategy in liveAdapter: use FMP for the fresh quote, fall back to
 * Yahoo (or bundled snapshot) for bars when FMP bars are restricted.
 */

import type { Bar, YahooQuote } from './liveAdapter';

interface FmpEodLight {
  symbol: string;
  date: string;
  price: number;
  volume: number;
}

interface FmpProfile {
  symbol: string;
  price: number;
  marketCap: number;
  change: number;
  changePercentage: number;
  volume: number;
  averageVolume: number;
  companyName: string;
  currency: string;
  range: string; // "low-high"
  beta: number;
}

export async function fetchFmpBars(symbol: string, days = 180): Promise<Bar[]> {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const url = `/api/fmp/historical-price-eod/light?symbol=${symbol}&from=${fmt(from)}&to=${fmt(to)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FMP chart failed for ${symbol}: ${res.status}`);
  const text = await res.text();
  if (text.includes('Premium Query Parameter')) {
    throw new Error(`FMP: ${symbol} requires premium plan for historical bars`);
  }
  const json: FmpEodLight[] = JSON.parse(text);
  if (!Array.isArray(json) || json.length === 0) throw new Error(`FMP: no bars for ${symbol}`);
  // FMP returns newest-first; reverse to chronological
  return [...json].reverse().map((r) => ({
    date: r.date,
    open: r.price,
    high: r.price,
    low: r.price,
    close: r.price,
    volume: r.volume,
  }));
}

export async function fetchFmpQuote(symbol: string): Promise<YahooQuote> {
  const url = `/api/fmp/profile?symbol=${symbol}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FMP profile failed for ${symbol}: ${res.status}`);
  const text = await res.text();
  if (text.includes('Premium Query Parameter')) {
    throw new Error(`FMP: ${symbol} requires premium plan`);
  }
  const json: FmpProfile[] = JSON.parse(text);
  const p = json?.[0];
  if (!p) throw new Error(`FMP: no profile for ${symbol}`);

  const [low52, high52] = p.range?.split('-').map(Number) ?? [undefined, undefined];

  return {
    symbol: p.symbol,
    regularMarketPrice: p.price,
    regularMarketTime: Math.floor(Date.now() / 1000),
    regularMarketChangePercent: p.changePercentage,
    regularMarketVolume: p.volume,
    marketCap: p.marketCap,
    fiftyTwoWeekHigh: high52,
    fiftyTwoWeekLow: low52,
  };
}

export async function fetchFmpChartAndQuote(
  symbol: string,
  days = 180
): Promise<{ quote: YahooQuote; bars: Bar[] }> {
  const [bars, quote] = await Promise.all([fetchFmpBars(symbol, days), fetchFmpQuote(symbol)]);
  return { bars, quote };
}
