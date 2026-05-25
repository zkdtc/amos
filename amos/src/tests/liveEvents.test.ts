import { describe, expect, it } from 'vitest';
import { mergeEventsWithEarnings } from '../data/liveEvents';
import type { MacroEvent } from '../data/schemas';

const manual: MacroEvent = {
  eventId: 'EVT-2026-05-28-PCE',
  eventDate: '2026-05-28',
  eventTime: '08:30',
  category: 'Macro',
  importance: 'Critical',
  riskMode: 'Elevated',
  actionCap: 'No Attack',
  postEventReviewRequired: true,
  title: 'PCE',
  sourceUrl: ''
};

const liveEarnings: MacroEvent = {
  eventId: 'EVT-EARN-NVDA-2026-06-05',
  eventDate: '2026-06-05',
  eventTime: 'TBD',
  category: 'Earnings',
  importance: 'Critical',
  riskMode: 'Elevated',
  actionCap: 'No Attack',
  postEventReviewRequired: true,
  title: 'NVDA Earnings (live)',
  sourceUrl: ''
};

describe('mergeEventsWithEarnings', () => {
  it('merges without duplicates', () => {
    const result = mergeEventsWithEarnings([manual], [liveEarnings]);
    expect(result.length).toBe(2);
    expect(result[0].eventDate).toBe('2026-05-28'); // sorted first
    expect(result[1].eventDate).toBe('2026-06-05');
  });

  it('deduplicates by eventId', () => {
    const dup = { ...liveEarnings };
    const result = mergeEventsWithEarnings([manual, liveEarnings], [dup]);
    expect(result.length).toBe(2); // no duplicate
  });

  it('handles empty inputs', () => {
    expect(mergeEventsWithEarnings([], []).length).toBe(0);
    expect(mergeEventsWithEarnings([manual], []).length).toBe(1);
    expect(mergeEventsWithEarnings([], [liveEarnings]).length).toBe(1);
  });

  it('live earnings default to Critical / No Attack (guardrail)', () => {
    expect(liveEarnings.importance).toBe('Critical');
    expect(liveEarnings.actionCap).toBe('No Attack');
  });
});
