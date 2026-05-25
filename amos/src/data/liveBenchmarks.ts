/**
 * AMOS v0.3B Live Benchmarks — fetch macro/regime instruments via Vite proxy.
 *
 * Mirrors shanjianwei-stock/runtime_engine.py::fetch_macro_signals().
 * Pulls 3-month daily bars for:
 *   VIX, ^TNX (10Y), BTC-USD, NVDA (leadership pivot), SPY, QQQ, DXY (DX-Y.NYB)
 *
 * Read-only. No trading. All guardrails respected.
 */

import { fetchChartAndQuote, type Bar } from './liveAdapter';

export interface BenchmarkSnapshot {
  symbol: string;
  label: string;
  price: number;
  prevClose: number;
  chg1d: number; // %
  chg20d: number; // %
  sma20: number;
  aboveSma20: boolean;
  high52w?: number;
  low52w?: number;
  bars: Bar[];
}

export const BENCHMARK_SYMBOLS: { symbol: string; label: string }[] = [
  { symbol: '^VIX', label: 'VIX' },
  { symbol: '^TNX', label: '10Y' },
  { symbol: 'BTC-USD', label: 'BTC' },
  { symbol: 'NVDA', label: 'NVDA' },
  { symbol: 'SPY', label: 'SPY' },
  { symbol: 'QQQ', label: 'QQQ' },
  { symbol: 'SMH', label: 'SMH' },
  { symbol: 'DX-Y.NYB', label: 'DXY' }
];

function computeSMA(bars: Bar[], period: number): number {
  if (bars.length < period) return bars.length ? bars[bars.length - 1].close : 0;
  const slice = bars.slice(-period);
  return slice.reduce((a, b) => a + b.close, 0) / slice.length;
}

export async function fetchBenchmark(
  symbol: string,
  label: string
): Promise<BenchmarkSnapshot | null> {
  // Try live, fall back to bundled snapshot.
  let quote: { fiftyTwoWeekHigh?: number; fiftyTwoWeekLow?: number } | null = null;
  let bars: Bar[] = [];
  try {
    const live = await fetchChartAndQuote(symbol, '3mo', '1d');
    quote = live.quote;
    bars = live.bars;
  } catch {
    /* fall through to fallback */
  }
  if (bars.length === 0) {
    const { getFallback, quoteFromFallback } = await import('./fallbackBars');
    // The bundle keys benchmarks by label, not the carrot-prefixed Yahoo symbol.
    const fb = (await getFallback(label)) ?? (await getFallback(symbol));
    if (!fb) return null;
    quote = quoteFromFallback(fb);
    bars = fb.bars;
  }
  if (bars.length === 0) return null;
  const last = bars[bars.length - 1];
  const prev = bars.length > 1 ? bars[bars.length - 2] : last;
  const ago20 = bars.length > 20 ? bars[bars.length - 21] : bars[0];
  const sma20 = computeSMA(bars, 20);
  return {
    symbol,
    label,
    price: last.close,
    prevClose: prev.close,
    chg1d: prev.close ? ((last.close - prev.close) / prev.close) * 100 : 0,
    chg20d: ago20.close ? ((last.close - ago20.close) / ago20.close) * 100 : 0,
    sma20,
    aboveSma20: last.close > sma20,
    high52w: quote?.fiftyTwoWeekHigh,
    low52w: quote?.fiftyTwoWeekLow,
    bars
  };
}

export async function fetchAllBenchmarks(): Promise<Map<string, BenchmarkSnapshot>> {
  const out = new Map<string, BenchmarkSnapshot>();
  // Sequential with small stagger to avoid Yahoo rate limit
  for (const def of BENCHMARK_SYMBOLS) {
    const snap = await fetchBenchmark(def.symbol, def.label);
    if (snap) out.set(def.label, snap);
    await new Promise((r) => setTimeout(r, 600));
  }
  return out;
}

/**
 * Relative-strength of a stock vs a benchmark over N trading days.
 * Returns a label per single-jianwei "Relative Strength" doctrine:
 *   Leader / Strong / Mixed / Follower / Laggard.
 */
export function relativeStrengthLabel(
  stockBars: Bar[],
  benchBars: Bar[],
  lookbackDays: number = 20
): string {
  if (stockBars.length < lookbackDays + 1 || benchBars.length < lookbackDays + 1) {
    return 'Insufficient Data';
  }
  const sNow = stockBars[stockBars.length - 1].close;
  const sBack = stockBars[stockBars.length - 1 - lookbackDays].close;
  const bNow = benchBars[benchBars.length - 1].close;
  const bBack = benchBars[benchBars.length - 1 - lookbackDays].close;
  if (!sBack || !bBack) return 'Insufficient Data';
  const sRet = (sNow - sBack) / sBack;
  const bRet = (bNow - bBack) / bBack;
  const diff = sRet - bRet;
  if (diff > 0.08) return 'Leader';
  if (diff > 0.02) return 'Strong';
  if (diff > -0.02) return 'Mixed';
  if (diff > -0.08) return 'Follower';
  return 'Laggard';
}
