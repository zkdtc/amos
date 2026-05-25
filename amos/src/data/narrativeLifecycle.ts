/**
 * AMOS Narrative Lifecycle Engine.
 *
 * Per single-jianwei doctrine (单建伟投资观点解析.md):
 *   A stock travels through 5 narrative phases. Each phase determines what kind
 *   of capital is buying, what kind of news matters, and what kind of price
 *   behavior is "normal".
 *
 *   Phase 0 · Origin (起源) — pre-narrative, no capital attention
 *   Phase 1 · Discovery (发现) — early adopters, first leaders form
 *   Phase 2 · Acceleration (主升) — institutions, follow-on, RS turns leader
 *   Phase 3 · Saturation (饱和) — late buyers, narrative becomes consensus
 *   Phase 4 · Decline (退潮) — distribution, narrative loses time-discount length
 *
 * Used by the Capital Migration / Battle-Map and by per-ticker thesis cards.
 *
 * This is a heuristic classifier — it does NOT emit trade signals.
 */

import type { Bar } from './liveAdapter';

export type NarrativePhase =
  | 'Origin'
  | 'Discovery'
  | 'Acceleration'
  | 'Saturation'
  | 'Decline';

export interface NarrativeAssessment {
  phase: NarrativePhase;
  confidence: number; // 0-1
  rationale: string[];
  capitalType: string;     // who is buying
  newsSensitivity: string; // what kind of news moves it
  expectedBehavior: string;
}

interface Inputs {
  bars: Bar[];                  // daily bars (≥ 6 months recommended)
  rsi14?: number | null;
  rsVsBench?: string;           // 'Leader' | 'Follower' | etc.
  benchAccelerating?: boolean;  // benchmark itself in acceleration
}

/**
 * Phase classifier. Pure function — easy to unit-test.
 */
export function classifyNarrativePhase(inp: Inputs): NarrativeAssessment {
  const rationale: string[] = [];
  const bars = inp.bars;

  if (bars.length < 30) {
    return {
      phase: 'Origin',
      confidence: 0.2,
      rationale: ['Insufficient price history (<30 bars)'],
      capitalType: 'Unknown',
      newsSensitivity: 'Low',
      expectedBehavior: 'Sparse trading; not yet in any narrative.'
    };
  }

  const closes = bars.map((b) => b.close);
  const vols = bars.map((b) => b.volume);
  const last = closes[closes.length - 1];

  // Distance from 6-month high/low
  const hi = Math.max(...closes);
  const lo = Math.min(...closes);
  const range = hi - lo;
  const positionInRange = range > 0 ? (last - lo) / range : 0.5;
  rationale.push(`Position in 6-month range: ${(positionInRange * 100).toFixed(0)}%`);

  // Average volume vs recent volume (acceleration heuristic)
  const meanVol = avg(vols);
  const recentVol = avg(vols.slice(-10));
  const volExpansion = meanVol > 0 ? recentVol / meanVol : 1;
  rationale.push(`Recent-10d volume expansion: ${volExpansion.toFixed(2)}×`);

  // Return slope (60-day annualized momentum proxy)
  const sixtyAgo = closes[Math.max(0, closes.length - 60)];
  const sixtyRet = sixtyAgo > 0 ? (last - sixtyAgo) / sixtyAgo : 0;
  rationale.push(`60-day return: ${(sixtyRet * 100).toFixed(1)}%`);

  const rs = inp.rsVsBench ?? 'Mixed';
  rationale.push(`RS vs benchmark: ${rs}`);

  // ── Heuristic rules ────────────────────────────────────────────────
  // Acceleration: high RS, high momentum, volume expanding
  if ((rs === 'Leader' || rs === 'Strong') && sixtyRet > 0.20 && volExpansion > 1.2) {
    return {
      phase: 'Acceleration',
      confidence: 0.8,
      rationale,
      capitalType: 'Institutional follow-on + momentum funds',
      newsSensitivity: 'Strong reaction to product/earnings upside',
      expectedBehavior: 'HH/HL trend, dips bought, AVWAP holds.'
    };
  }

  // Saturation: very high return + RS slowing + still elevated
  if (sixtyRet > 0.40 && (rs === 'Mixed' || rs === 'Follower') && positionInRange > 0.7) {
    return {
      phase: 'Saturation',
      confidence: 0.75,
      rationale,
      capitalType: 'Retail + late institutions',
      newsSensitivity: '"Good news that does not lift price" is the tell',
      expectedBehavior: 'Choppy / pinning / rotation into adjacent names.'
    };
  }

  // Decline: lost momentum, weak RS, low position in range
  if ((rs === 'Laggard' || rs === 'Follower') && sixtyRet < -0.10 && positionInRange < 0.4) {
    return {
      phase: 'Decline',
      confidence: 0.7,
      rationale,
      capitalType: 'Distribution / forced sellers',
      newsSensitivity: 'Bad news still hurts, good news mute',
      expectedBehavior: 'LH/LL, AVWAP lost, rallies sold.'
    };
  }

  // Discovery: emerging RS, modest gains, position in lower-middle range
  if ((rs === 'Strong' || rs === 'Leader') && sixtyRet > 0.05 && positionInRange < 0.7) {
    return {
      phase: 'Discovery',
      confidence: 0.6,
      rationale,
      capitalType: 'Early adopters, smart institutions',
      newsSensitivity: 'Reacts strongly to thesis-confirming data',
      expectedBehavior: 'Higher-volume up-days, base-building.'
    };
  }

  // Default → Origin (no clear narrative)
  return {
    phase: 'Origin',
    confidence: 0.4,
    rationale,
    capitalType: 'Generic / no dedicated capital',
    newsSensitivity: 'Low',
    expectedBehavior: 'Drifts with macro, no idiosyncratic edge.'
  };
}

function avg(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
