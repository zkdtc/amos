import { describe, expect, it } from 'vitest';
import {
  computeGannPriceLevels,
  computeGannPriceScore,
  computeGannTimeScore,
  computeGannTimeWindows,
  computeResonanceScore,
  resonanceLabel,
  buildLiveGannEngine
} from '../data/gannLive';
import type { AnchorVerification } from '../data/schemas';

describe('Gann price levels (Square of Nine)', () => {
  it('computes levels for both directions and all angles', () => {
    const levels = computeGannPriceLevels(100, 105);
    // 6 angles × 2 directions = 12 levels
    expect(levels.length).toBe(12);
    expect(levels.some((l) => l.direction === 'up')).toBe(true);
    expect(levels.some((l) => l.direction === 'down')).toBe(true);
  });

  it('detects in-band when price is near a level', () => {
    // For base=100, 45° up: target = (sqrt(100) + 45/180)^2 = (10 + 0.25)^2 = 105.0625
    const levels = computeGannPriceLevels(100, 105.06);
    const hit = levels.find((l) => l.angle === 45 && l.direction === 'up');
    expect(hit).toBeDefined();
    expect(hit!.inBand).toBe(true); // within ±0.5%
  });

  it('price far from levels shows not in band', () => {
    const levels = computeGannPriceLevels(100, 200);
    const inBand = levels.filter((l) => l.inBand);
    // 200 is far from most 100-based Gann levels
    expect(inBand.length).toBeLessThan(levels.length);
  });
});

describe('Gann time windows', () => {
  it('computes correct time windows from anchor', () => {
    const windows = computeGannTimeWindows('2026-01-01', '2026-01-08');
    // 7-day window should be very close (0 days away)
    const w7 = windows.find((w) => w.days === 7);
    expect(w7).toBeDefined();
    expect(w7!.daysAway).toBe(0);
    expect(w7!.inWindow).toBe(true);
  });

  it('far-out windows are not in window', () => {
    const windows = computeGannTimeWindows('2026-01-01', '2026-01-02');
    const w360 = windows.find((w) => w.days === 360);
    expect(w360).toBeDefined();
    expect(w360!.inWindow).toBe(false);
  });
});

describe('Gann scores', () => {
  it('price score increases when levels are in-band', () => {
    const inBandLevels = computeGannPriceLevels(100, 105.06);
    const farLevels = computeGannPriceLevels(100, 200);
    const scoreNear = computeGannPriceScore(inBandLevels);
    const scoreFar = computeGannPriceScore(farLevels);
    expect(scoreNear).toBeGreaterThan(scoreFar);
  });

  it('time score increases when windows are near', () => {
    const nearWindows = computeGannTimeWindows('2026-01-01', '2026-01-08');
    const farWindows = computeGannTimeWindows('2026-01-01', '2026-06-01');
    const scoreNear = computeGannTimeScore(nearWindows);
    const scoreFar = computeGannTimeScore(farWindows);
    expect(scoreNear).toBeGreaterThan(scoreFar);
  });

  it('empty inputs return 0', () => {
    expect(computeGannPriceScore([])).toBe(0);
    expect(computeGannTimeScore([])).toBe(0);
  });
});

describe('Resonance score', () => {
  it('high resonance when everything aligns', () => {
    const score = computeResonanceScore(90, 90, 0.9, 3, true);
    expect(score).toBeGreaterThanOrEqual(80);
    expect(resonanceLabel(score)).toBe('High Resonance Action Window');
  });

  it('low resonance when nothing aligns', () => {
    const score = computeResonanceScore(0, 0, 0, 0, false);
    expect(score).toBeLessThan(40);
    expect(resonanceLabel(score)).toBe('Weak / No Signal');
  });

  it('labels are correct for boundaries', () => {
    expect(resonanceLabel(80)).toBe('High Resonance Action Window');
    expect(resonanceLabel(60)).toBe('Observation / Partial Action');
    expect(resonanceLabel(40)).toBe('Setup Incomplete');
    expect(resonanceLabel(20)).toBe('Weak / No Signal');
  });
});

describe('buildLiveGannEngine', () => {
  const anchor: AnchorVerification = {
    ticker: 'TST',
    anchorId: 'a1',
    anchorType: 'Swing High',
    anchorDate: '2025-12-01',
    anchorPrice: 100,
    verificationStatus: 'Pending',
    verificationScore: 0.5,
    usePermission: 'Research Only',
    tickerSpecificContextChecked: true
  };

  it('builds engine with live price', () => {
    const engine = buildLiveGannEngine('TST', 105, [anchor], 'HH/HL');
    expect(engine.ticker).toBe('TST');
    expect(engine.current_price).toBe(105);
    expect(engine.data_quality).toBe('live_market_data');
    expect(engine.gann_price_score).toBeGreaterThan(0);
    expect(engine.gann_time_score).toBeGreaterThanOrEqual(0);
    expect(engine.unified_gann_resonance_score).toBeGreaterThan(0);
  });

  it('marks hard_missing_data when no anchors', () => {
    const engine = buildLiveGannEngine('TST', 105, [], 'HH/HL');
    expect(engine.hard_missing_data).toContain('No Gann anchors defined');
  });

  it('Gann engine never emits buy/sell (structural guardrail)', () => {
    // The engine has no buy/sell field — this is a design guardrail
    const engine = buildLiveGannEngine('TST', 105, [anchor], 'HH/HL');
    expect('buy' in engine).toBe(false);
    expect('sell' in engine).toBe(false);
    expect('signal' in engine).toBe(false);
  });
});
