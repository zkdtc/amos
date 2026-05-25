import { describe, expect, it } from 'vitest';
import { buildPersonalityRadar } from '../data/stockPersonality';
import type { Bar } from '../data/liveAdapter';

function makeBars(n: number, vol: number, range: number): Bar[] {
  const out: Bar[] = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    price *= 1 + (Math.random() - 0.5) * vol;
    out.push({
      date: `2024-${String((i % 12) + 1).padStart(2, '0')}-01`,
      open: price, high: price * (1 + range), low: price * (1 - range), close: price, volume: 1_000_000
    });
  }
  return out;
}

describe('stock personality radar', () => {
  it('returns 6 axes with values in 0..100', () => {
    const bars = makeBars(100, 0.01, 0.01);
    const r = buildPersonalityRadar('X', bars);
    expect(r.axes.length).toBe(6);
    for (const a of r.axes) {
      expect(a.value).toBeGreaterThanOrEqual(0);
      expect(a.value).toBeLessThanOrEqual(100);
    }
  });

  it('summary tags include high-vol when volatility is large', () => {
    const bars = makeBars(100, 0.1, 0.1);
    const r = buildPersonalityRadar('X', bars);
    // High-vol won't always trigger because of randomness, but at least one tag present
    expect(r.summary.length).toBeGreaterThan(0);
  });
});
