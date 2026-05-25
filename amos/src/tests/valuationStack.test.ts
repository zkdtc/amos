import { describe, expect, it } from 'vitest';
import { buildValuationZones, valuationFor } from '../data/valuationStack';

describe('valuation stack', () => {
  it('orders zones strictly: conservative < base < bull < euphoria', () => {
    const z = buildValuationZones({
      symbol: 'X',
      currentPrice: 100,
      conservativeFloor: 50,
      consensusBase: 100
    });
    expect(z.conservative).toBeLessThan(z.base);
    expect(z.base).toBeLessThan(z.bull);
    expect(z.bull).toBeLessThan(z.euphoria);
  });

  it('classifies "Below Base" when price is between conservative and base', () => {
    const z = buildValuationZones({ symbol: 'X', currentPrice: 80, conservativeFloor: 50, consensusBase: 100 });
    expect(['Below Base', 'Conservative Zone']).toContain(z.zone);
  });

  it('classifies "Euphoria Zone" when price overshoots bull', () => {
    const z = buildValuationZones({ symbol: 'X', currentPrice: 250, conservativeFloor: 50, consensusBase: 100 });
    expect(z.zone).toBe('Euphoria Zone');
  });

  it('execution risk modifier shrinks bull/euphoria but not floor', () => {
    const a = buildValuationZones({ symbol: 'X', currentPrice: 100, conservativeFloor: 50, consensusBase: 100 });
    const b = buildValuationZones({ symbol: 'X', currentPrice: 100, conservativeFloor: 50, consensusBase: 100, executionRiskModifier: -0.2 });
    expect(b.conservative).toBe(a.conservative);
    expect(b.bull).toBeLessThan(a.bull);
    expect(b.euphoria).toBeLessThan(a.euphoria);
  });

  it('valuationFor knows the tracked tickers', () => {
    expect(valuationFor('NVDA', 230)).not.toBeNull();
    expect(valuationFor('UNKNOWN', 100)).toBeNull();
  });
});
