import { describe, expect, it } from 'vitest';
import { classifyRegime } from '../data/marketRegime';
import type { BenchmarkSnapshot } from '../data/liveBenchmarks';

function bench(price: number, chg20d = 0, sma20Above = true): BenchmarkSnapshot {
  return {
    symbol: 'X', label: 'X', price, prevClose: price, chg1d: 0,
    chg20d, sma20: price * (sma20Above ? 0.95 : 1.05), aboveSma20: sma20Above, bars: []
  };
}

describe('market regime', () => {
  it('Risk-Off when VIX > 28', () => {
    const m = new Map<string, BenchmarkSnapshot>();
    m.set('VIX', bench(35));
    m.set('NVDA', bench(100, 0, true));
    m.set('QQQ', bench(500, 0, true));
    const r = classifyRegime(m);
    expect(r.riskAppetite).toBe('Risk-Off');
    expect(r.label).toBe('Risk-Off');
  });

  it('Attack when low VIX + NVDA strong + QQQ momentum + low rates', () => {
    const m = new Map<string, BenchmarkSnapshot>();
    m.set('VIX', bench(12));
    m.set('10Y', bench(3.5));
    m.set('NVDA', bench(150, 5, true));
    m.set('QQQ', bench(500, 5, true));
    const r = classifyRegime(m);
    expect(r.riskAppetite).toBe('Risk-On');
    expect(r.leadership).toBe('NVDA Strong');
    expect(r.label).toBe('Attack');
  });

  it('Defensive when cautious + tightening', () => {
    const m = new Map<string, BenchmarkSnapshot>();
    m.set('VIX', bench(24));
    m.set('10Y', bench(4.8));
    m.set('NVDA', bench(100, 0, true));
    m.set('QQQ', bench(500, 0, true));
    const r = classifyRegime(m);
    expect(r.label).toBe('Defensive');
  });
});
