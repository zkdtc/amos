import { describe, expect, it } from 'vitest';
import { computeAVWAP, classifyAVWAP, buildAVWAPSeries } from '../data/liveAVWAP';
import type { Bar } from '../data/liveAdapter';

const bars: Bar[] = Array.from({ length: 10 }, (_, i) => ({
  date: `2025-01-${String(i + 1).padStart(2, '0')}`,
  open: 100, high: 105, low: 95, close: 100 + i, volume: 1_000_000
}));

describe('AVWAP', () => {
  it('computes AVWAP forward from anchor date', () => {
    const out = computeAVWAP(bars, '2025-01-01');
    expect(out.length).toBe(10);
    expect(out[0].avwap).toBeGreaterThan(0);
    expect(out[out.length - 1].avwap).toBeGreaterThan(out[0].avwap); // ascending series
  });

  it('classifies status correctly', () => {
    expect(classifyAVWAP(110, 100)).toBe('Extended');
    expect(classifyAVWAP(101, 100)).toBe('Reclaimed');
    expect(classifyAVWAP(100, 100)).toBe('At AVWAP');
    expect(classifyAVWAP(98, 100)).toBe('Lost');
    expect(classifyAVWAP(100, 0)).toBe('N/A');
  });

  it('buildAVWAPSeries returns reasonable series', () => {
    const s = buildAVWAPSeries(bars, '2025-01-01', 100, 'Test');
    expect(s.current).toBeGreaterThan(0);
    expect(['Extended', 'Reclaimed', 'At AVWAP', 'Lost', 'N/A']).toContain(s.status);
  });
});
