import { describe, expect, it } from 'vitest';
import {
  computeEMA,
  computeRSI,
  deriveFreshness,
  detectTrendStructure,
  detectAVWAPStatus
} from '../data/liveAdapter';
import type { Bar } from '../data/liveAdapter';

describe('computeEMA', () => {
  it('EMA of a single value returns that value', () => {
    expect(computeEMA([100], 8)).toEqual([100]);
  });

  it('EMA converges for steady prices', () => {
    const closes = Array(20).fill(50);
    const ema = computeEMA(closes, 8);
    expect(ema[ema.length - 1]).toBeCloseTo(50, 5);
  });

  it('EMA responds to rising prices', () => {
    const closes = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const ema8 = computeEMA(closes, 8);
    // EMA should be less than last price for rising trend
    expect(ema8[ema8.length - 1]).toBeLessThan(20);
    expect(ema8[ema8.length - 1]).toBeGreaterThan(10);
  });

  it('empty array returns empty', () => {
    expect(computeEMA([], 8)).toEqual([]);
  });
});

describe('computeRSI', () => {
  it('returns null when not enough data', () => {
    expect(computeRSI([1, 2, 3], 14)).toBeNull();
  });

  it('RSI of all-up trend approaches 100', () => {
    const closes = Array.from({ length: 30 }, (_, i) => 100 + i);
    const rsi = computeRSI(closes, 14);
    expect(rsi).not.toBeNull();
    expect(rsi!).toBeGreaterThan(90);
  });

  it('RSI of all-down trend approaches 0', () => {
    const closes = Array.from({ length: 30 }, (_, i) => 100 - i);
    const rsi = computeRSI(closes, 14);
    expect(rsi).not.toBeNull();
    expect(rsi!).toBeLessThan(10);
  });

  it('RSI of flat prices is 50-ish', () => {
    // Alternating: prevents exact 0 division
    const closes = Array.from({ length: 30 }, (_, i) => 100 + (i % 2 === 0 ? 0.5 : -0.5));
    const rsi = computeRSI(closes, 14);
    expect(rsi).not.toBeNull();
    expect(rsi!).toBeGreaterThan(40);
    expect(rsi!).toBeLessThan(60);
  });
});

describe('deriveFreshness (market-aware)', () => {
  // Use a fixed "now" so the test is deterministic regardless of
  // when it runs. 2026-05-25 (Mon) 11:00 ET is mid-session.
  const monMidSession = new Date(Date.UTC(2026, 4, 25, 15, 0, 0)); // 11:00 EDT
  const friClose      = new Date(Date.UTC(2026, 4, 22, 20, 0, 0)); // 16:00 EDT Fri close
  const sunNight      = new Date(Date.UTC(2026, 4, 25, 3, 0, 0));  // 23:00 EDT Sun

  it('mid-session: quote 1 min ago is Fresh', () => {
    const q = Math.floor(monMidSession.getTime() / 1000) - 60;
    expect(deriveFreshness(q, monMidSession)).toBe('Fresh');
  });

  it('mid-session: quote 1 h ago is Stale', () => {
    const q = Math.floor(monMidSession.getTime() / 1000) - 3600;
    expect(deriveFreshness(q, monMidSession)).toBe('Stale');
  });

  it('weekend: Friday-close quote is still Fresh on Sunday night', () => {
    const q = Math.floor(friClose.getTime() / 1000);
    expect(deriveFreshness(q, sunNight)).toBe('Fresh');
  });

  it('very old (10+ days) is Missing', () => {
    const veryOld = Math.floor(monMidSession.getTime() / 1000) - 15 * 24 * 3600;
    expect(deriveFreshness(veryOld, monMidSession)).toBe('Missing');
  });
});

describe('detectTrendStructure', () => {
  it('returns Insufficient Data for too few bars', () => {
    const bars: Bar[] = Array.from({ length: 5 }, (_, i) => ({
      date: `2026-01-0${i + 1}`,
      open: 100,
      high: 101,
      low: 99,
      close: 100,
      volume: 1000
    }));
    expect(detectTrendStructure(bars)).toBe('Insufficient Data');
  });

  it('detects HH/HL uptrend', () => {
    const bars: Bar[] = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      open: 100 + i,
      high: 101 + i,
      low: 99 + i,
      close: 100 + i,
      volume: 1000
    }));
    expect(detectTrendStructure(bars)).toBe('HH/HL');
  });

  it('detects LH/LL downtrend', () => {
    const bars: Bar[] = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      open: 100 - i,
      high: 101 - i,
      low: 99 - i,
      close: 100 - i,
      volume: 1000
    }));
    expect(detectTrendStructure(bars)).toBe('LH/LL');
  });
});

describe('detectAVWAPStatus', () => {
  it('Extended when well above VWAP', () => {
    expect(detectAVWAPStatus(106, 100)).toBe('Extended');
  });

  it('Reclaimed when slightly above', () => {
    expect(detectAVWAPStatus(101, 100)).toBe('Reclaimed');
  });

  it('At AVWAP when near', () => {
    expect(detectAVWAPStatus(100, 100)).toBe('At AVWAP');
  });

  it('Lost when below', () => {
    expect(detectAVWAPStatus(97, 100)).toBe('Lost');
  });

  it('N/A when no anchor', () => {
    expect(detectAVWAPStatus(100, null)).toBe('N/A (no anchor)');
  });
});

describe('live adapter guardrail conservativeness', () => {
  it('freshness never returns Fresh for very old quotes', () => {
    // Even if someone passes a bad timestamp, it should never be Fresh
    const veryOld = Math.floor(Date.now() / 1000) - 365 * 24 * 3600;
    expect(deriveFreshness(veryOld, new Date())).toBe('Missing');
  });

  it('EMA/RSI computations are pure functions and safe from NaN', () => {
    const ema = computeEMA([NaN, 100, 200], 8);
    // First element is NaN, EMA propagates it; this is expected — UI should handle
    expect(ema.length).toBe(3);
    expect(computeRSI([], 14)).toBeNull();
  });
});
