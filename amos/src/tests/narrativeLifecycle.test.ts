import { describe, expect, it } from 'vitest';
import { classifyNarrativePhase } from '../data/narrativeLifecycle';
import type { Bar } from '../data/liveAdapter';

function makeBars(n: number, start: number, drift: number, vol = 1_000_000): Bar[] {
  const bars: Bar[] = [];
  let price = start;
  for (let i = 0; i < n; i++) {
    const close = price * (1 + drift + (Math.sin(i / 5) * 0.005));
    bars.push({
      date: new Date(2024, 0, 1 + i).toISOString().slice(0, 10),
      open: price, high: close * 1.01, low: close * 0.99, close, volume: vol
    });
    price = close;
  }
  return bars;
}

describe('narrative lifecycle classifier', () => {
  it('returns Origin for insufficient history', () => {
    const r = classifyNarrativePhase({ bars: makeBars(5, 10, 0) });
    expect(r.phase).toBe('Origin');
  });

  it('detects Acceleration when high drift + Leader RS + volume expansion', () => {
    const bars = makeBars(120, 50, 0.004);
    // Expand recent volume 2x
    for (let i = 110; i < bars.length; i++) bars[i].volume = 3_000_000;
    const r = classifyNarrativePhase({ bars, rsVsBench: 'Leader' });
    expect(r.phase).toBe('Acceleration');
    expect(r.confidence).toBeGreaterThan(0.5);
  });

  it('detects Decline when negative drift + Laggard RS', () => {
    const bars = makeBars(120, 50, -0.003);
    const r = classifyNarrativePhase({ bars, rsVsBench: 'Laggard' });
    expect(r.phase).toBe('Decline');
  });
});
