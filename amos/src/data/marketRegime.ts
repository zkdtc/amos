/**
 * AMOS Market Regime State Machine.
 *
 * Mirrors shanjianwei-stock/runtime_engine.py::classify_regime() and the
 * single-jianwei doctrine "MARKET REGIME / Macro War Map".
 *
 * Three orthogonal axes:
 *   1. Risk Appetite (Risk-On / Selective / Cautious / Risk-Off)        ← VIX
 *   2. Liquidity     (Loosening / Neutral / Tightening)                 ← 10Y yield + DXY
 *   3. Leadership    (NVDA intact / Wobbling / Broken)                  ← NVDA vs SMA20 + RS
 *
 * Composite regime maps to ATTACK / NORMAL / REDUCED / DEFENSIVE / RISK-OFF.
 *
 * Used to set the top-bar "Macro War Map" status and the global action ceiling
 * on every ticker page (single-jianwei: "宏观定仓位").
 */

import type { BenchmarkSnapshot } from './liveBenchmarks';

export type RiskAppetite = 'Risk-On' | 'Selective' | 'Cautious' | 'Risk-Off';
export type LiquidityState = 'Loosening' | 'Neutral' | 'Tightening';
export type LeadershipState = 'NVDA Strong' | 'NVDA Wobbling' | 'NVDA Broken' | 'Unknown';
export type RegimeLabel = 'Attack' | 'Normal' | 'Reduced Size' | 'Defensive' | 'Risk-Off';

export interface RegimeSnapshot {
  riskAppetite: RiskAppetite;
  liquidity: LiquidityState;
  leadership: LeadershipState;
  label: RegimeLabel;
  notes: string[];
  vix?: number;
  tnx?: number;
  dxy?: number;
  qqq20d?: number;
  btc20d?: number;
}

export function classifyRegime(benches: Map<string, BenchmarkSnapshot>): RegimeSnapshot {
  const vix = benches.get('VIX')?.price;
  const tnx = benches.get('10Y')?.price;
  const dxy = benches.get('DXY')?.price;
  const nvda = benches.get('NVDA');
  const qqq = benches.get('QQQ');
  const btc = benches.get('BTC');

  // 1. Risk Appetite
  let risk: RiskAppetite = 'Selective';
  if (vix == null) risk = 'Selective';
  else if (vix < 15) risk = 'Risk-On';
  else if (vix < 20) risk = 'Selective';
  else if (vix < 28) risk = 'Cautious';
  else risk = 'Risk-Off';

  // 2. Liquidity (10Y yield + DXY direction)
  let liq: LiquidityState = 'Neutral';
  if (tnx != null) {
    if (tnx >= 4.5) liq = 'Tightening';
    else if (tnx <= 3.8) liq = 'Loosening';
    else liq = 'Neutral';
  }

  // 3. Leadership
  let lead: LeadershipState = 'Unknown';
  if (nvda) {
    if (nvda.aboveSma20 && nvda.chg20d > 0) lead = 'NVDA Strong';
    else if (nvda.aboveSma20) lead = 'NVDA Wobbling';
    else lead = 'NVDA Broken';
  }

  // Composite label
  let label: RegimeLabel = 'Normal';
  const notes: string[] = [];

  if (risk === 'Risk-Off' || lead === 'NVDA Broken') {
    label = 'Risk-Off';
    notes.push('Defensive priority. Reduce exposure. Cash + hedges.');
  } else if (risk === 'Cautious' && liq === 'Tightening') {
    label = 'Defensive';
    notes.push('Tightening + caution. Trim winners, protect P/L.');
  } else if (risk === 'Selective' || lead === 'NVDA Wobbling') {
    label = 'Reduced Size';
    notes.push('Selective regime. Tactical only; no aggression.');
  } else if (risk === 'Risk-On' && lead === 'NVDA Strong' && (qqq?.chg20d ?? 0) > 3) {
    label = 'Attack';
    notes.push('Trend-up regime. Leaders + breakouts permitted.');
  } else {
    label = 'Normal';
    notes.push('Mid-cycle. Standard playbook.');
  }

  if (qqq?.chg20d != null) notes.push(`QQQ 20d: ${qqq.chg20d.toFixed(1)}%`);
  if (btc?.chg20d != null) notes.push(`BTC 20d: ${btc.chg20d.toFixed(1)}%`);
  if (dxy != null) notes.push(`DXY: ${dxy.toFixed(2)}`);

  return {
    riskAppetite: risk,
    liquidity: liq,
    leadership: lead,
    label,
    notes,
    vix,
    tnx,
    dxy,
    qqq20d: qqq?.chg20d,
    btc20d: btc?.chg20d
  };
}
