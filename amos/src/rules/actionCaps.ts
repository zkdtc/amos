// Action cap rules. Pure functions used by both UI and tests.
import type { ActionCap, Freshness, GannEngine, MacroEvent } from '../data/schemas';

// Severity order: lower number == more permissive; higher == more restrictive.
const CAP_RANK: Record<ActionCap, number> = {
  Attack: 0,
  Normal: 1,
  'Reduced Size': 2,
  Watch: 3,
  'Research Only': 4,
  'No Attack': 5
};

export function strictestCap(caps: ActionCap[]): ActionCap {
  if (caps.length === 0) return 'Normal';
  return caps.reduce((acc, c) => (CAP_RANK[c] > CAP_RANK[acc] ? c : acc), caps[0]);
}

// Missing freshness blocks aggressive action.
export function freshnessCap(freshness: Freshness): ActionCap {
  switch (freshness) {
    case 'Fresh':
      return 'Normal';
    case 'Stale':
      return 'Reduced Size';
    case 'Missing':
    default:
      return 'Research Only';
  }
}

// hard_missing_data non-empty caps Gann action to Watch/Research Only.
export function gannMissingDataCap(engine: Pick<GannEngine, 'hard_missing_data'>): ActionCap {
  return engine.hard_missing_data && engine.hard_missing_data.length > 0
    ? 'Research Only'
    : 'Normal';
}

// Critical event default: No Attack.
export function eventCap(event: Pick<MacroEvent, 'importance' | 'actionCap'>): ActionCap {
  if (event.importance === 'Critical') return 'No Attack';
  return event.actionCap ?? 'Normal';
}

// True when an Attack/aggressive bias is permitted.
export function canAttack(cap: ActionCap): boolean {
  return CAP_RANK[cap] <= CAP_RANK['Normal'];
}

export function blocksAggressive(cap: ActionCap): boolean {
  return CAP_RANK[cap] >= CAP_RANK['Reduced Size'];
}
