import { describe, expect, it } from 'vitest';
import { relativeStrengthLabel } from '../data/liveBenchmarks';
import type { Bar } from '../data/liveAdapter';

function bars(prices: number[]): Bar[] {
  return prices.map((p, i) => ({
    date: `2025-01-${String(i + 1).padStart(2, '0')}`,
    open: p, high: p, low: p, close: p, volume: 1_000_000
  }));
}

describe('relative strength label', () => {
  it('returns Insufficient Data on short series', () => {
    expect(relativeStrengthLabel(bars([1, 2, 3]), bars([1, 2, 3]), 20)).toBe('Insufficient Data');
  });

  it('Leader when stock far outperforms benchmark', () => {
    const stock = Array.from({ length: 30 }, (_, i) => 100 * (1 + i * 0.02));
    const bench = Array.from({ length: 30 }, () => 100);
    expect(relativeStrengthLabel(bars(stock), bars(bench), 20)).toBe('Leader');
  });

  it('Laggard when stock far underperforms benchmark', () => {
    const stock = Array.from({ length: 30 }, () => 100);
    const bench = Array.from({ length: 30 }, (_, i) => 100 * (1 + i * 0.02));
    expect(relativeStrengthLabel(bars(stock), bars(bench), 20)).toBe('Laggard');
  });

  it('Mixed when both flat', () => {
    const same = Array.from({ length: 30 }, () => 100);
    expect(relativeStrengthLabel(bars(same), bars(same), 20)).toBe('Mixed');
  });
});
