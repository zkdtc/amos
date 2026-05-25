import { describe, expect, it } from 'vitest';
import { buildOptionsStructure } from '../data/liveOptions';

const chain = {
  expirationDate: 1735689600, // arbitrary unix
  calls: [
    { strike: 100, openInterest: 50, impliedVolatility: 0.5 },
    { strike: 110, openInterest: 200, impliedVolatility: 0.55 },
    { strike: 120, openInterest: 100, impliedVolatility: 0.6 }
  ],
  puts: [
    { strike: 90, openInterest: 300, impliedVolatility: 0.7 },
    { strike: 100, openInterest: 100, impliedVolatility: 0.65 }
  ]
};

describe('options structure', () => {
  it('identifies call wall + put wall', () => {
    const s = buildOptionsStructure('X', 105, chain, [chain.expirationDate]);
    expect(s.callWall).toBe(110);
    expect(s.putWall).toBe(90);
    expect(s.gammaFlip).toBe(100);
  });

  it('classifies positive gamma when price > flip', () => {
    const s = buildOptionsStructure('X', 130, chain, [chain.expirationDate]);
    expect(s.regime).toBe('Positive Gamma');
  });

  it('classifies negative gamma when price < flip', () => {
    const s = buildOptionsStructure('X', 80, chain, [chain.expirationDate]);
    expect(s.regime).toBe('Negative Gamma');
  });

  it('emits put/call OI ratio', () => {
    const s = buildOptionsStructure('X', 100, chain, [chain.expirationDate]);
    expect(s.putCallRatio).toBeGreaterThan(0);
  });

  it('alerts on extreme P/C ratios', () => {
    const heavyPut = { ...chain, puts: [{ strike: 90, openInterest: 10000 }] };
    const s = buildOptionsStructure('X', 100, heavyPut, [chain.expirationDate]);
    expect(s.alerts.some((a) => a.includes('Put/Call OI > 1.5'))).toBe(true);
  });
});
