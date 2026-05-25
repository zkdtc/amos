// Macro event guardrails.
import type { ActionCap, MacroEvent } from '../data/schemas';
import { strictestCap, eventCap } from './actionCaps';

// Aggregate the strictest action cap implied by an upcoming event window.
export function aggregateEventCap(events: MacroEvent[]): ActionCap {
  if (events.length === 0) return 'Normal';
  return strictestCap(events.map(eventCap));
}

// Default cap for any Critical event is No Attack.
export function defaultCapForCriticalEvent(event: MacroEvent): ActionCap {
  return event.importance === 'Critical' ? 'No Attack' : event.actionCap ?? 'Normal';
}

export function noAttackInForce(events: MacroEvent[]): boolean {
  return events.some((e) => defaultCapForCriticalEvent(e) === 'No Attack');
}
