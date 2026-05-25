/**
 * AMOS v0.3B Live-Read Adapter — Yahoo Finance (v8 chart endpoint only)
 *
 * Uses /v8/finance/chart which is the most permissive Yahoo endpoint.
 * Quote data is extracted from chart.result[0].meta.
 *
 * Pure read-only. Guardrails unchanged:
 * - Gann cannot trigger trades alone
 * - Anchor Verification gate still required
 * - Counter-evidence required for action influence
 * - Critical events still default to No Attack
 *
 * Per-field data_quality is labeled: live fields get "live_market_data",
 * manual/sample fields keep their original label.
 */

import type { DataQuality, Freshness, ManualInput } from './schemas';

// ─── Yahoo Quote (extracted from chart meta) ────────────────────────

export interface YahooQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketTime: number; // unix seconds
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  shortName?: string;
  longName?: string;
}

// ─── Yahoo Chart (daily bars) ───────────────────────────────────────

export interface Bar {
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartResponse {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        regularMarketPrice: number;
        regularMarketTime?: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        regularMarketVolume?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        fiftyDayAverage?: number;
        twoHundredDayAverage?: number;
        longName?: string;
        shortName?: string;
        previousClose?: number;
        chartPreviousClose?: number;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: (number | null)[];
          high?: (number | null)[];
          low?: (number | null)[];
          close?: (number | null)[];
          volume?: (number | null)[];
        }>;
      };
    }>;
    error?: unknown;
  };
}

/**
 * Fetch chart bars + quote from a single endpoint.
 * We use the v8/finance/chart endpoint which is the most reliable free Yahoo endpoint.
 */
export async function fetchChartAndQuote(
  symbol: string,
  range: string = '6mo',
  interval: string = '1d'
): Promise<{ quote: YahooQuote; bars: Bar[] }> {
  const url = `/api/yahoo/chart/${symbol}?range=${range}&interval=${interval}&includePrePost=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Yahoo chart failed for ${symbol}: ${res.status}`);
  const json: ChartResponse = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No chart data for ${symbol}`);

  const meta = result.meta;

  // Extract quote from meta
  const prevClose = meta.previousClose ?? meta.chartPreviousClose ?? meta.regularMarketPrice;
  const changePercent = prevClose
    ? ((meta.regularMarketPrice - prevClose) / prevClose) * 100
    : 0;

  const quote: YahooQuote = {
    symbol: meta.symbol,
    regularMarketPrice: meta.regularMarketPrice,
    regularMarketTime: meta.regularMarketTime ?? Math.floor(Date.now() / 1000),
    regularMarketChangePercent: changePercent,
    regularMarketVolume: meta.regularMarketVolume ?? 0,
    fiftyDayAverage: meta.fiftyDayAverage,
    twoHundredDayAverage: meta.twoHundredDayAverage,
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
    longName: meta.longName,
    shortName: meta.shortName
  };

  // Extract bars
  const ts: number[] = result.timestamp ?? [];
  const q = result.indicators?.quote?.[0];
  const bars: Bar[] = [];
  if (q) {
    for (let i = 0; i < ts.length; i++) {
      const c = q.close?.[i];
      if (c == null) continue;
      const d = new Date(ts[i] * 1000);
      bars.push({
        date: d.toISOString().slice(0, 10),
        open: q.open?.[i] ?? c,
        high: q.high?.[i] ?? c,
        low: q.low?.[i] ?? c,
        close: c,
        volume: q.volume?.[i] ?? 0
      });
    }
  }

  return { quote, bars };
}

// ─── Technical Indicators (pure functions) ──────────────────────────

export function computeEMA(closes: number[], period: number): number[] {
  if (closes.length === 0) return [];
  const k = 2 / (period + 1);
  const ema: number[] = [closes[0]];
  for (let i = 1; i < closes.length; i++) {
    ema.push(closes[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

export function computeRSI(closes: number[], period: number = 14): number | null {
  if (closes.length < period + 1) return null;
  let gainSum = 0;
  let lossSum = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gainSum += diff;
    else lossSum -= diff;
  }
  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - diff) / period;
    }
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round(100 - 100 / (1 + rs));
}

export function detectTrendStructure(bars: Bar[]): string {
  if (bars.length < 10) return 'Insufficient Data';
  const recent = bars.slice(-20);
  const highs = recent.map((b) => b.high);
  const lows = recent.map((b) => b.low);

  const mid = Math.floor(recent.length / 2);
  const firstHalfHigh = Math.max(...highs.slice(0, mid));
  const secondHalfHigh = Math.max(...highs.slice(mid));
  const firstHalfLow = Math.min(...lows.slice(0, mid));
  const secondHalfLow = Math.min(...lows.slice(mid));

  const higherHighs = secondHalfHigh > firstHalfHigh;
  const higherLows = secondHalfLow > firstHalfLow;
  const lowerHighs = secondHalfHigh < firstHalfHigh;
  const lowerLows = secondHalfLow < firstHalfLow;

  if (higherHighs && higherLows) return 'HH/HL';
  if (lowerHighs && lowerLows) return 'LH/LL';
  if (!higherHighs && !lowerHighs) return 'Inside Bar';
  return 'Equilibrium';
}

export function detectAVWAPStatus(
  lastClose: number,
  vwapAnchor: number | null
): string {
  if (vwapAnchor == null) return 'N/A (no anchor)';
  const ratio = lastClose / vwapAnchor;
  if (ratio > 1.03) return 'Extended';
  if (ratio > 1.005) return 'Reclaimed';
  if (ratio > 0.995) return 'At AVWAP';
  return 'Lost';
}

// ─── Freshness from quote timestamp ─────────────────────────────────
// Market-aware semantics:
//   - During NYSE regular hours (Mon-Fri 09:30-16:00 ET) → quote must be
//     within 30 minutes to be Fresh; otherwise Stale.
//   - Outside regular hours (after-hours, overnight, weekends, holidays)
//     → the most-recent close is FRESH until the next session opens.
//     This is how single-jianwei treats end-of-day data: 收盘价 is the
//     authoritative reference until the next bell.
//   - Only when the quote precedes the most-recent expected close by
//     more than a full trading day do we degrade to Stale → Missing.

export interface MarketClockState {
  phase: 'regular' | 'pre' | 'post' | 'closed-weekend' | 'closed-overnight';
  isOpen: boolean;            // regular-hours
  lastSessionClose: Date;     // most recent 16:00 ET close (or "now" if mid-session)
  nextSessionOpen: Date;      // next 09:30 ET open
}

const ET_TZ = 'America/New_York';

/** Get hour/minute/day-of-week of `d` interpreted in NY time. */
function nyParts(d: Date) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: ET_TZ,
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
    hour12: false
  }).formatToParts(d);
  const get = (t: string) => fmt.find((p) => p.type === t)?.value ?? '0';
  return {
    weekday: get('weekday'),           // 'Mon' | 'Tue' | ...
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    hour: parseInt(get('hour'), 10),
    minute: parseInt(get('minute'), 10)
  };
}

/** Build a Date for a given Y-M-D h:m interpreted as wall time in NY. */
function nyDate(y: number, mo: number, d: number, h: number, mi: number): Date {
  // Quick approximation: round-trip via locale string. Accurate enough
  // for session boundaries (no DST sub-minute precision needed here).
  const iso = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}:00`;
  // Compute the offset between NY and UTC for that wall-clock moment.
  const probe = new Date(iso + 'Z'); // treat as UTC first
  const probeParts = nyParts(probe);
  const offsetMin =
    (probeParts.hour - h) * 60 + (probeParts.minute - mi);
  return new Date(probe.getTime() - offsetMin * 60_000);
}

export function getMarketClock(now: Date = new Date()): MarketClockState {
  const p = nyParts(now);
  const isWeekend = p.weekday === 'Sat' || p.weekday === 'Sun';
  const minutesNow = p.hour * 60 + p.minute;
  const openMin = 9 * 60 + 30;
  const closeMin = 16 * 60;
  const preMin = 4 * 60;
  const postMin = 20 * 60;

  // Most recent regular close
  let lastClose: Date;
  let nextOpen: Date;

  if (!isWeekend && minutesNow >= openMin && minutesNow < closeMin) {
    // Mid-session
    return {
      phase: 'regular',
      isOpen: true,
      lastSessionClose: nyDate(p.year, p.month, p.day, 16, 0),
      nextSessionOpen: nyDate(p.year, p.month, p.day, 9, 30)
    };
  }

  if (!isWeekend && minutesNow >= preMin && minutesNow < openMin) {
    // Pre-market today
    return {
      phase: 'pre',
      isOpen: false,
      lastSessionClose: previousTradingClose(p),
      nextSessionOpen: nyDate(p.year, p.month, p.day, 9, 30)
    };
  }

  if (!isWeekend && minutesNow >= closeMin && minutesNow < postMin) {
    // After-hours today
    return {
      phase: 'post',
      isOpen: false,
      lastSessionClose: nyDate(p.year, p.month, p.day, 16, 0),
      nextSessionOpen: nextTradingOpen(p)
    };
  }

  // Overnight or weekend
  lastClose = previousTradingClose(p);
  nextOpen = nextTradingOpen(p);
  return {
    phase: isWeekend ? 'closed-weekend' : 'closed-overnight',
    isOpen: false,
    lastSessionClose: lastClose,
    nextSessionOpen: nextOpen
  };
}

/** Most-recent 16:00 ET that has *already happened*. */
function previousTradingClose(p: ReturnType<typeof nyParts>): Date {
  // Walk back day-by-day until we find a Mon-Fri.
  let probe = nyDate(p.year, p.month, p.day, 16, 0);
  if (p.hour * 60 + p.minute < 16 * 60) {
    probe = new Date(probe.getTime() - 24 * 60 * 60_000);
  }
  while (true) {
    const pp = nyParts(probe);
    if (pp.weekday !== 'Sat' && pp.weekday !== 'Sun') {
      return nyDate(pp.year, pp.month, pp.day, 16, 0);
    }
    probe = new Date(probe.getTime() - 24 * 60 * 60_000);
  }
}

/** Next 09:30 ET that has *not yet happened*. */
function nextTradingOpen(p: ReturnType<typeof nyParts>): Date {
  let probe = nyDate(p.year, p.month, p.day, 9, 30);
  if (p.hour * 60 + p.minute >= 9 * 60 + 30) {
    probe = new Date(probe.getTime() + 24 * 60 * 60_000);
  }
  while (true) {
    const pp = nyParts(probe);
    if (pp.weekday !== 'Sat' && pp.weekday !== 'Sun') {
      return nyDate(pp.year, pp.month, pp.day, 9, 30);
    }
    probe = new Date(probe.getTime() + 24 * 60 * 60_000);
  }
}

/**
 * Market-aware freshness classifier.
 *
 *   - Mid-session: quote within 30 min → Fresh; older → Stale.
 *   - Outside session: last-close is Fresh while ≤ 1 trading day old;
 *     beyond that → Stale, then Missing.
 */
export function deriveFreshness(
  quoteUnixSec: number,
  now: Date = new Date()
): Freshness {
  const clock = getMarketClock(now);
  const quoteAgeMs = now.getTime() - quoteUnixSec * 1000;
  const oneTradingDayMs = 24 * 60 * 60 * 1000;

  if (clock.isOpen) {
    const ageMin = quoteAgeMs / 60_000;
    if (ageMin <= 30) return 'Fresh';
    if (ageMin <= 240) return 'Stale';
    return 'Missing';
  }

  // Market closed: most-recent close is fresh until next open.
  const sinceLastClose = now.getTime() - clock.lastSessionClose.getTime();
  // Quote should be at or slightly before lastSessionClose.
  // Allow quoteUnixSec up to 24 h before lastClose to still count as Fresh
  // (covers Friday-close staying Fresh through entire weekend).
  const quoteVsLastCloseMs = clock.lastSessionClose.getTime() - quoteUnixSec * 1000;

  if (quoteVsLastCloseMs <= oneTradingDayMs && sinceLastClose < 4 * oneTradingDayMs) {
    return 'Fresh';
  }
  if (quoteAgeMs < 5 * oneTradingDayMs) return 'Stale';
  return 'Missing';
}

// ─── Composite: build a live ManualInput replacement ────────────────

export interface LiveTickerData {
  manualInput: ManualInput;
  quote: YahooQuote;
  bars: Bar[];
  dataQuality: DataQuality;
  fetchedAt: string; // ISO
}

export async function fetchLiveTickerData(
  symbol: string,
  fallbackManual?: ManualInput
): Promise<LiveTickerData> {
  let quote: YahooQuote;
  let bars: Bar[];
  let dataQuality: DataQuality = 'live_market_data';

  try {
    const live = await fetchChartAndQuote(symbol, '6mo', '1d');
    quote = live.quote;
    bars = live.bars;
    if (bars.length < 20) throw new Error('Too few bars from Yahoo');
  } catch (err) {
    // Yahoo failed or rate-limited → fall back to bundled snapshot so the
    // L2/L3 panels still render meaningful values.
    const { getFallback, quoteFromFallback } = await import('./fallbackBars');
    const fb = await getFallback(symbol);
    if (!fb) throw err;
    quote = quoteFromFallback(fb);
    bars = fb.bars;
    dataQuality = 'cached_fallback_not_live';
  }

  const closes = bars.map((b) => b.close);
  const ema8 = computeEMA(closes, 8);
  const ema12 = computeEMA(closes, 12);
  const rsi14 = computeRSI(closes, 14);
  const lastClose = quote.regularMarketPrice;
  const lastEma8 = ema8.length > 0 ? ema8[ema8.length - 1] : null;
  const lastEma12 = ema12.length > 0 ? ema12[ema12.length - 1] : null;

  const freshness = deriveFreshness(quote.regularMarketTime);

  // RS vs QQQ/peers: defaults; LiveDataContext upgrades these with real benchmark bars.
  const rsVsQqq = fallbackManual?.rsVsQqq ?? 'N/A (live RS pending)';
  const rsVsPeers = fallbackManual?.rsVsPeers ?? 'N/A (live RS pending)';

  // AVWAP proxy: use 50-day average from quote meta
  const avwapProxy = quote.fiftyDayAverage ?? null;

  const manualInput: ManualInput = {
    ticker: symbol,
    lastPrice: lastClose,
    rsi14d: rsi14,
    ema8State: lastEma8 != null ? (lastClose > lastEma8 ? 'above' : 'below') : 'unknown',
    ema12State: lastEma12 != null ? (lastClose > lastEma12 ? 'above' : 'below') : 'unknown',
    trendStructure: detectTrendStructure(bars),
    rsVsQqq,
    rsVsPeers,
    avwapStatus: detectAVWAPStatus(lastClose, avwapProxy),
    riskStack: fallbackManual?.riskStack ?? 'Unknown',
    actionBias: fallbackManual?.actionBias ?? 'Wait',
    freshness,
    invalidation: fallbackManual?.invalidation ?? 'No manual invalidation set'
  };

  return {
    manualInput,
    quote,
    bars,
    dataQuality,
    fetchedAt: new Date().toISOString()
  };
}

// ─── Batch fetch for all tickers ────────────────────────────────────

export async function fetchAllLiveData(
  symbols: string[],
  fallbackManuals: ManualInput[]
): Promise<Map<string, LiveTickerData>> {
  const results = new Map<string, LiveTickerData>();
  const settled = await Promise.allSettled(
    symbols.map((s) => {
      const fallback = fallbackManuals.find((m) => m.ticker === s);
      return fetchLiveTickerData(s, fallback);
    })
  );
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      results.set(symbols[i], r.value);
    }
  });
  return results;
}
