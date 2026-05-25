import { describe, expect, it } from 'vitest';
import {
  blocksAggressive,
  canAttack,
  freshnessCap,
  gannMissingDataCap,
  strictestCap,
  eventCap
} from '../rules/actionCaps';

describe('actionCaps', () => {
  it('Missing freshness blocks aggressive action', () => {
    const cap = freshnessCap('Missing');
    expect(cap).toBe('Research Only');
    expect(canAttack(cap)).toBe(false);
    expect(blocksAggressive(cap)).toBe(true);
  });

  it('Fresh freshness allows normal action', () => {
    expect(freshnessCap('Fresh')).toBe('Normal');
    expect(canAttack('Normal')).toBe(true);
  });

  it('Stale freshness reduces size', () => {
    expect(freshnessCap('Stale')).toBe('Reduced Size');
    expect(blocksAggressive('Reduced Size')).toBe(true);
  });

  it('Gann hard_missing_data caps to Research Only', () => {
    expect(gannMissingDataCap({ hard_missing_data: ['AVWAP missing'] })).toBe('Research Only');
    expect(gannMissingDataCap({ hard_missing_data: [] })).toBe('Normal');
  });

  it('Critical events default to No Attack', () => {
    expect(eventCap({ importance: 'Critical', actionCap: 'Normal' })).toBe('No Attack');
    expect(eventCap({ importance: 'High', actionCap: 'Reduced Size' })).toBe('Reduced Size');
  });

  it('strictestCap returns the most restrictive cap', () => {
    expect(strictestCap(['Normal', 'Reduced Size', 'No Attack', 'Attack'])).toBe('No Attack');
    expect(strictestCap(['Normal', 'Research Only'])).toBe('Research Only');
    expect(strictestCap([])).toBe('Normal');
  });
});
