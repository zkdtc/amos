/**
 * AMOS Stock Personality Radar — quantifies how each stock "behaves".
 *
 * Six axes derived from single-jianwei doctrine ("个股行为学" / "Stock Personality Radar"):
 *   1. Volatility (波动强度)         — ATR / price
 *   2. Hype Sensitivity (情绪敏感)    — % days with >5% move
 *   3. Panic-Recovery Speed (修复速度) — # bars from drawdown to fresh high
 *   4. Gamma Sensitivity (γ敏感)      — IV proxy from intraday range
 *   5. Leadership Dependency (龙头依赖) — corr with NVDA / sector leader
 *   6. Fundamental Floor Strength     — distance from conservative floor (valuation)
 *
 * All axes normalized 0-100. Larger = "more of that trait".
 */

import type { Bar } from './liveAdapter';

export interface PersonalityAxis {
  key: 'volatility' | 'hype' | 'recovery' | 'gamma' | 'leadership' | 'floor';
  label: string;
  value: number; // 0-100
  description: string;
}

export interface PersonalityRadar {
  symbol: string;
  axes: PersonalityAxis[];
  summary: string;
}

export function buildPersonalityRadar(
  symbol: string,
  bars: Bar[],
  leaderBars?: Bar[],
  fundamentalFloorDistancePct?: number
): PersonalityRadar {
  const closes = bars.map((b) => b.close);
  const last = closes[closes.length - 1] ?? 0;

  // 1. Volatility — average true range / price
  const atr14 = computeATR(bars, 14);
  const vol = last > 0 ? clamp01(atr14 / last / 0.05) * 100 : 0; // 5% ATR/price = 100

  // 2. Hype — % of last 60 days with |return| > 5%
  const lookback = bars.slice(-60);
  const hypeDays = lookback.filter((b, i) => {
    if (i === 0) return false;
    const prev = lookback[i - 1].close;
    return prev > 0 && Math.abs((b.close - prev) / prev) > 0.05;
  }).length;
  const hype = clamp01(hypeDays / 60 / 0.3) * 100; // 30% hype-days = 100

  // 3. Recovery — bars from worst-drawdown to nearest fresh high in window
  const recovery = computeRecoveryScore(bars);

  // 4. Gamma — average intraday range proxy
  const ranges = bars.slice(-30).map((b) => (b.high - b.low) / (b.close || 1));
  const meanRange = ranges.length ? ranges.reduce((a, b) => a + b, 0) / ranges.length : 0;
  const gamma = clamp01(meanRange / 0.06) * 100; // 6% intraday range = 100

  // 5. Leadership dependency — 30-day return correlation with leader
  const leadership = leaderBars
    ? clamp01((correlation(returns(bars), returns(leaderBars)) + 1) / 2) * 100
    : 50;

  // 6. Floor strength — distance above conservative floor (closer = lower score)
  const floor = fundamentalFloorDistancePct != null
    ? clamp01(fundamentalFloorDistancePct / 100) * 100
    : 50;

  const axes: PersonalityAxis[] = [
    { key: 'volatility', label: 'Volatility',           value: round0(vol),        description: `ATR14 / price ≈ ${(atr14 / (last || 1) * 100).toFixed(1)}%` },
    { key: 'hype',       label: 'Hype Sensitivity',     value: round0(hype),       description: `${hypeDays}/60 days had >5% moves` },
    { key: 'recovery',   label: 'Panic-Recovery Speed', value: round0(recovery),   description: 'Bars-to-fresh-high after biggest drawdown' },
    { key: 'gamma',      label: 'Gamma Sensitivity',    value: round0(gamma),      description: `Mean intraday range ≈ ${(meanRange * 100).toFixed(1)}%` },
    { key: 'leadership', label: 'Leadership Dependency', value: round0(leadership), description: leaderBars ? '30d return corr with leader' : 'No leader bars supplied' },
    { key: 'floor',      label: 'Floor Strength',       value: round0(floor),      description: 'Distance above Duan-Yongping conservative floor' }
  ];

  const summary = describePersonality(axes);
  return { symbol, axes, summary };
}

function describePersonality(axes: PersonalityAxis[]): string {
  const get = (k: PersonalityAxis['key']) => axes.find((a) => a.key === k)?.value ?? 0;
  const tags: string[] = [];
  if (get('volatility') > 70) tags.push('high-vol');
  if (get('hype') > 60)       tags.push('hype-driven');
  if (get('gamma') > 65)      tags.push('gamma-sensitive');
  if (get('leadership') > 70) tags.push('leader-dependent');
  if (get('recovery') > 70)   tags.push('fast-repair');
  if (get('floor') < 30)      tags.push('near-floor');
  if (tags.length === 0)      tags.push('neutral profile');
  return tags.join(' · ');
}

// ── Helpers ───────────────────────────────────────────────────────────
function computeATR(bars: Bar[], period: number): number {
  if (bars.length < 2) return 0;
  const trs: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prevClose = bars[i - 1].close;
    const tr = Math.max(
      bars[i].high - bars[i].low,
      Math.abs(bars[i].high - prevClose),
      Math.abs(bars[i].low - prevClose)
    );
    trs.push(tr);
  }
  const slice = trs.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function computeRecoveryScore(bars: Bar[]): number {
  if (bars.length < 30) return 50;
  // Find max drawdown peak in last 90 bars
  const win = bars.slice(-90);
  let peakIdx = 0;
  let troughIdx = 0;
  let maxDD = 0;
  for (let i = 1; i < win.length; i++) {
    if (win[i].high > win[peakIdx].high) peakIdx = i;
    const dd = (win[peakIdx].high - win[i].low) / win[peakIdx].high;
    if (dd > maxDD) {
      maxDD = dd;
      troughIdx = i;
    }
  }
  if (maxDD < 0.05) return 80; // very stable
  // Bars from trough to first close above peak
  let barsToRecover = win.length - troughIdx;
  for (let i = troughIdx + 1; i < win.length; i++) {
    if (win[i].close >= win[peakIdx].high) {
      barsToRecover = i - troughIdx;
      break;
    }
  }
  // 0 bars = perfect → 100; 60+ bars = slow → 0
  return clamp01(1 - barsToRecover / 60) * 100;
}

function returns(bars: Bar[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1].close;
    if (prev > 0) out.push((bars[i].close - prev) / prev);
  }
  return out;
}

function correlation(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 5) return 0;
  const ax = a.slice(-n);
  const bx = b.slice(-n);
  const ma = avg(ax);
  const mb = avg(bx);
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    num += (ax[i] - ma) * (bx[i] - mb);
    da += (ax[i] - ma) ** 2;
    db += (bx[i] - mb) ** 2;
  }
  const denom = Math.sqrt(da * db);
  return denom > 0 ? num / denom : 0;
}

function avg(xs: number[]) { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0; }
function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }
function round0(x: number) { return Math.round(x); }
