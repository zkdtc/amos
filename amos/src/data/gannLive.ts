/**
 * AMOS Gann Live Calculator — computes Gann scores from real price + anchors.
 *
 * Formula: P_target = (sqrt(P_base) ± angle/180)²
 * Angles: 45, 90, 180, 270, 360, 720
 * Band: ±0.5%
 *
 * Time windows (calendar days): 7, 14, 21, 34, 45, 55, 60, 90, 144, 180, 360
 *
 * Resonance Score v0:
 *   - Gann Time Proximity: 25%
 *   - Gann Price Proximity: 25%
 *   - Anchor Quality: 15%
 *   - Multi-anchor Cluster: 15%
 *   - Price Action Confirmation: 20%
 *
 * Guardrail: Gann cannot trigger trades alone. Research/confirmation only.
 */

import type { AnchorVerification, GannEngine, DataQuality } from './schemas';

const GANN_ANGLES = [45, 90, 180, 270, 360, 720];
const GANN_TIME_WINDOWS = [7, 14, 21, 34, 45, 55, 60, 90, 144, 180, 360];
const BAND_PCT = 0.005; // ±0.5%

// ─── Square of Nine price levels ────────────────────────────────────

export interface GannPriceLevel {
  angle: number;
  direction: 'up' | 'down';
  targetPrice: number;
  distancePct: number;
  inBand: boolean;
}

export function computeGannPriceLevels(basePrice: number, currentPrice: number): GannPriceLevel[] {
  const levels: GannPriceLevel[] = [];
  const sqrtBase = Math.sqrt(basePrice);

  for (const angle of GANN_ANGLES) {
    for (const dir of ['up', 'down'] as const) {
      const offset = dir === 'up' ? angle / 180 : -(angle / 180);
      const target = Math.pow(sqrtBase + offset, 2);
      if (target <= 0) continue;
      const distPct = (currentPrice - target) / target;
      levels.push({
        angle,
        direction: dir,
        targetPrice: target,
        distancePct: distPct,
        inBand: Math.abs(distPct) <= BAND_PCT
      });
    }
  }
  return levels;
}

// ─── Time window proximity ──────────────────────────────────────────

export interface GannTimeWindow {
  days: number;
  targetDate: string;
  daysAway: number;
  inWindow: boolean; // within ±3 days
}

export function computeGannTimeWindows(anchorDate: string, today: string): GannTimeWindow[] {
  const anchor = new Date(anchorDate).getTime();
  const now = new Date(today).getTime();
  const msPerDay = 86400000;

  return GANN_TIME_WINDOWS.map((days) => {
    const targetMs = anchor + days * msPerDay;
    const targetDate = new Date(targetMs).toISOString().slice(0, 10);
    const daysAway = Math.round((targetMs - now) / msPerDay);
    return {
      days,
      targetDate,
      daysAway,
      inWindow: Math.abs(daysAway) <= 3
    };
  });
}

// ─── Gann Price Score (0-100) ───────────────────────────────────────

export function computeGannPriceScore(levels: GannPriceLevel[]): number {
  if (levels.length === 0) return 0;
  const inBandCount = levels.filter((l) => l.inBand).length;
  const closestDist = Math.min(...levels.map((l) => Math.abs(l.distancePct)));

  // Score: 0-50 based on closest distance, 0-50 based on in-band count
  const distScore = Math.max(0, 50 - closestDist * 5000); // 0% = 50, 1% = 0
  const bandScore = Math.min(50, (inBandCount / levels.length) * 200);
  return Math.round(distScore + bandScore);
}

// ─── Gann Time Score (0-100) ────────────────────────────────────────

export function computeGannTimeScore(windows: GannTimeWindow[]): number {
  if (windows.length === 0) return 0;
  const inWindowCount = windows.filter((w) => w.inWindow).length;
  const closestDays = Math.min(...windows.map((w) => Math.abs(w.daysAway)));

  const proximityScore = Math.max(0, 50 - closestDays * 5); // 0 days = 50, 10+ = 0
  const windowScore = Math.min(50, (inWindowCount / windows.length) * 200);
  return Math.round(proximityScore + windowScore);
}

// ─── Unified Resonance Score ────────────────────────────────────────

export function computeResonanceScore(
  priceScore: number,
  timeScore: number,
  anchorQuality: number, // 0-1
  clusterCount: number, // how many anchors are in proximity
  priceActionConfirmed: boolean
): number {
  const pricePart = priceScore * 0.25;
  const timePart = timeScore * 0.25;
  const anchorPart = (anchorQuality * 100) * 0.15;
  const clusterPart = Math.min(100, clusterCount * 33) * 0.15;
  const paPart = (priceActionConfirmed ? 100 : 0) * 0.20;
  return Math.round(pricePart + timePart + anchorPart + clusterPart + paPart);
}

export function resonanceLabel(score: number): string {
  if (score >= 80) return 'High Resonance Action Window';
  if (score >= 60) return 'Observation / Partial Action';
  if (score >= 40) return 'Setup Incomplete';
  return 'Weak / No Signal';
}

// ─── Build a live GannEngine from real data ─────────────────────────

export function buildLiveGannEngine(
  ticker: string,
  currentPrice: number,
  anchors: AnchorVerification[],
  trendStructure: string
): GannEngine {
  const today = new Date().toISOString().slice(0, 10);
  const tickerAnchors = anchors.filter((a) => a.ticker === ticker);

  const hardMissing: string[] = [];
  if (tickerAnchors.length === 0) hardMissing.push('No Gann anchors defined');
  if (!currentPrice) hardMissing.push('No current price');

  const allLevels: GannPriceLevel[] = [];
  const allWindows: GannTimeWindow[] = [];
  let bestAnchorQuality = 0;

  for (const anchor of tickerAnchors) {
    if (anchor.anchorPrice > 0 && currentPrice > 0) {
      const levels = computeGannPriceLevels(anchor.anchorPrice, currentPrice);
      allLevels.push(...levels);
    }
    const windows = computeGannTimeWindows(anchor.anchorDate, today);
    allWindows.push(...windows);
    bestAnchorQuality = Math.max(bestAnchorQuality, anchor.verificationScore);
  }

  const priceScore = computeGannPriceScore(allLevels);
  const timeScore = computeGannTimeScore(allWindows);
  const clusterCount = allLevels.filter((l) => l.inBand).length;
  const paConfirmed = trendStructure === 'HH/HL' || trendStructure === 'LH/LL';

  const resonance = computeResonanceScore(
    priceScore,
    timeScore,
    bestAnchorQuality,
    clusterCount,
    paConfirmed
  );

  const nextRequired: string[] = [];
  if (tickerAnchors.every((a) => a.usePermission !== 'Verified')) {
    nextRequired.push('Verify at least one anchor for formal use');
  }
  if (hardMissing.length > 0) {
    nextRequired.push('Resolve hard missing data');
  }

  return {
    ticker,
    engine_file: `${ticker.toLowerCase()}_gann_live_engine`,
    engine_version: 'v0.3B-live',
    data_quality: (currentPrice > 0 ? 'live_market_data' : 'sample_manual_ready_not_live') as DataQuality,
    current_price: currentPrice,
    current_date: today,
    gann_price_score: priceScore,
    gann_time_score: timeScore,
    unified_gann_resonance_score: resonance,
    resonance_state: resonanceLabel(resonance),
    hard_missing_data: hardMissing,
    status: 'Gann Live',
    next_required: nextRequired
  };
}

// ─── Multi-anchor cluster detection ─────────────────────────────────
// Per single-jianwei doctrine: nearest support / nearest resistance /
// price cluster (multiple anchors converging) / time cluster.

export interface GannLevelView {
  anchorId: string;
  anchorType: string;
  anchorPrice: number;
  angle: number;
  direction: 'up' | 'down';
  targetPrice: number;
  distancePct: number;
  inBand: boolean;
}

export interface GannCluster {
  centerPrice: number;
  side: 'support' | 'resistance';
  members: GannLevelView[];
  strength: number;     // 1..5 based on member count
  distancePct: number;  // signed % from current price
}

export interface GannMultiAnchorView {
  ticker: string;
  currentPrice: number;
  perAnchorLevels: GannLevelView[];      // all levels labelled by anchor
  nearestSupport?: GannLevelView;
  nearestResistance?: GannLevelView;
  clusters: GannCluster[];               // distinct support/resistance clusters
}

export function buildMultiAnchorView(
  ticker: string,
  currentPrice: number,
  anchors: AnchorVerification[]
): GannMultiAnchorView {
  const tickerAnchors = anchors.filter((a) => a.ticker === ticker);
  const all: GannLevelView[] = [];
  for (const a of tickerAnchors) {
    if (!(a.anchorPrice > 0 && currentPrice > 0)) continue;
    const levels = computeGannPriceLevels(a.anchorPrice, currentPrice);
    for (const lv of levels) {
      all.push({
        anchorId: a.anchorId,
        anchorType: a.anchorType,
        anchorPrice: a.anchorPrice,
        angle: lv.angle,
        direction: lv.direction,
        targetPrice: lv.targetPrice,
        distancePct: lv.distancePct,
        inBand: lv.inBand
      });
    }
  }
  // Reasonable ±20% trading band: ignore levels outside it.
  const filtered = all.filter((l) => Math.abs(l.distancePct) <= 0.20);

  // Below current price = support; above = resistance.
  const supports = filtered.filter((l) => l.targetPrice <= currentPrice);
  const resistances = filtered.filter((l) => l.targetPrice > currentPrice);

  const nearestSupport = supports.length
    ? supports.reduce((a, b) => (b.targetPrice > a.targetPrice ? b : a))
    : undefined;
  const nearestResistance = resistances.length
    ? resistances.reduce((a, b) => (b.targetPrice < a.targetPrice ? b : a))
    : undefined;

  // Cluster: group nearby targets within ±1% of each other.
  const clusters: GannCluster[] = [];
  const sorted = [...filtered].sort((a, b) => a.targetPrice - b.targetPrice);
  let current: GannLevelView[] = [];
  for (const lv of sorted) {
    if (current.length === 0) {
      current.push(lv);
      continue;
    }
    const center = current.reduce((a, b) => a + b.targetPrice, 0) / current.length;
    if (Math.abs(lv.targetPrice - center) / center <= 0.01) {
      current.push(lv);
    } else {
      if (current.length >= 2) clusters.push(toCluster(current, currentPrice));
      current = [lv];
    }
  }
  if (current.length >= 2) clusters.push(toCluster(current, currentPrice));

  return {
    ticker,
    currentPrice,
    perAnchorLevels: filtered,
    nearestSupport,
    nearestResistance,
    clusters
  };
}

function toCluster(members: GannLevelView[], currentPrice: number): GannCluster {
  const centerPrice = members.reduce((a, b) => a + b.targetPrice, 0) / members.length;
  return {
    centerPrice,
    side: centerPrice <= currentPrice ? 'support' : 'resistance',
    members,
    strength: Math.min(5, members.length),
    distancePct: ((centerPrice - currentPrice) / currentPrice) * 100
  };
}
