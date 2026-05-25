/**
 * AMOS v0.3B Anchored VWAP — true AVWAP from real bars.
 *
 * AVWAP = Σ(close * volume) / Σ(volume) starting from anchor date.
 * Per single-jianwei doctrine, AVWAP anchored at:
 *   - Major Earnings Low/High
 *   - Absolute Low / All-Time High
 *   - Major Event Extreme
 * is one of the most important execution lines.
 *
 * Rules:
 *   - Price > AVWAP * 1.03 → Extended (sell pressure mounting)
 *   - 1.005 - 1.03 → Reclaimed (bullish bias)
 *   - 0.995 - 1.005 → At AVWAP (decision zone)
 *   - < 0.995 → Lost (bearish bias)
 */

import type { Bar } from './liveAdapter';

export interface AVWAPSeries {
  anchorDate: string;
  anchorPrice: number;
  anchorType: string; // "Earnings Low" | "Swing High" | etc.
  series: { date: string; avwap: number; close: number }[];
  current: number | null;
  status: 'Extended' | 'Reclaimed' | 'At AVWAP' | 'Lost' | 'N/A';
  distancePct: number | null;
}

/**
 * Compute AVWAP from bars starting at anchor date (inclusive).
 * If anchor date is before bar range, fall back to first bar.
 */
export function computeAVWAP(bars: Bar[], anchorDate: string): { date: string; avwap: number; close: number }[] {
  if (bars.length === 0) return [];
  const startIdx = Math.max(
    0,
    bars.findIndex((b) => b.date >= anchorDate)
  );
  if (startIdx === -1) return [];
  const sub = bars.slice(startIdx);
  let cumPV = 0;
  let cumV = 0;
  const out: { date: string; avwap: number; close: number }[] = [];
  for (const b of sub) {
    const typical = (b.high + b.low + b.close) / 3;
    const vol = b.volume || 1; // avoid div0
    cumPV += typical * vol;
    cumV += vol;
    out.push({ date: b.date, avwap: cumV > 0 ? cumPV / cumV : b.close, close: b.close });
  }
  return out;
}

export function classifyAVWAP(close: number, avwap: number): AVWAPSeries['status'] {
  if (!avwap) return 'N/A';
  const ratio = close / avwap;
  if (ratio > 1.03) return 'Extended';
  if (ratio > 1.005) return 'Reclaimed';
  if (ratio > 0.995) return 'At AVWAP';
  return 'Lost';
}

export function buildAVWAPSeries(
  bars: Bar[],
  anchorDate: string,
  anchorPrice: number,
  anchorType: string
): AVWAPSeries {
  const series = computeAVWAP(bars, anchorDate);
  const last = series[series.length - 1];
  const status = last ? classifyAVWAP(last.close, last.avwap) : 'N/A';
  const distancePct = last ? ((last.close - last.avwap) / last.avwap) * 100 : null;
  return {
    anchorDate,
    anchorPrice,
    anchorType,
    series,
    current: last?.avwap ?? null,
    status,
    distancePct
  };
}
