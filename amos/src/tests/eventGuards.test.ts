import { describe, expect, it } from 'vitest';
import {
  aggregateEventCap,
  defaultCapForCriticalEvent,
  noAttackInForce
} from '../rules/eventGuards';
import type { MacroEvent } from '../data/schemas';

const evt = (over: Partial<MacroEvent> = {}): MacroEvent => ({
  eventId: 'e1',
  eventDate: '2026-05-28',
  eventTime: '08:30',
  category: 'Macro',
  importance: 'High',
  riskMode: 'Caution',
  actionCap: 'Reduced Size',
  postEventReviewRequired: false,
  title: 'CPI',
  sourceUrl: '',
  ...over
});

describe('eventGuards', () => {
  it('Critical events default to No Attack', () => {
    expect(defaultCapForCriticalEvent(evt({ importance: 'Critical' }))).toBe('No Attack');
  });

  it('Non-critical events keep their declared action cap', () => {
    expect(defaultCapForCriticalEvent(evt({ importance: 'High', actionCap: 'Reduced Size' }))).toBe(
      'Reduced Size'
    );
  });

  it('aggregateEventCap returns strictest cap', () => {
    expect(
      aggregateEventCap([
        evt({ importance: 'High', actionCap: 'Reduced Size' }),
        evt({ importance: 'Critical' })
      ])
    ).toBe('No Attack');
  });

  it('noAttackInForce detects critical event', () => {
    expect(noAttackInForce([evt({ importance: 'Critical' })])).toBe(true);
    expect(noAttackInForce([evt({ importance: 'High' })])).toBe(false);
  });
});
