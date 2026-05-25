import { describe, expect, it } from 'vitest';
import { getAllRealEvents, getUpcomingRealEvents, REAL_MACRO_EVENTS_2026 } from '../data/realEvents';

describe('realEvents', () => {
  it('has 8 FOMC meetings in 2026', () => {
    const fomc = REAL_MACRO_EVENTS_2026.filter((e) => e.category === 'Macro / Fed');
    expect(fomc.length).toBe(8);
  });

  it('FOMC dates match official schedule', () => {
    const fomcDates = REAL_MACRO_EVENTS_2026
      .filter((e) => e.category === 'Macro / Fed')
      .map((e) => e.eventDate)
      .sort();
    expect(fomcDates).toEqual([
      '2026-01-28',
      '2026-03-18',
      '2026-04-29',
      '2026-06-17',
      '2026-07-29',
      '2026-09-16',
      '2026-10-28',
      '2026-12-09'
    ]);
  });

  it('all FOMC events are Critical + No Attack', () => {
    const fomc = REAL_MACRO_EVENTS_2026.filter((e) => e.category === 'Macro / Fed');
    fomc.forEach((e) => {
      expect(e.importance).toBe('Critical');
      expect(e.actionCap).toBe('No Attack');
      expect(e.postEventReviewRequired).toBe(true);
    });
  });

  it('has 12 monthly OPEX events', () => {
    const opex = REAL_MACRO_EVENTS_2026.filter((e) =>
      e.category === 'Mechanical / OPEX'
    );
    expect(opex.length).toBe(12);
  });

  it('OPEX falls on Fridays (day 5)', () => {
    const opex = REAL_MACRO_EVENTS_2026.filter((e) =>
      e.category === 'Mechanical / OPEX'
    );
    opex.forEach((e) => {
      const d = new Date(e.eventDate + 'T12:00:00Z');
      expect(d.getUTCDay()).toBe(5); // Friday
    });
  });

  it('getAllRealEvents returns sorted events', () => {
    const all = getAllRealEvents();
    for (let i = 1; i < all.length; i++) {
      expect(all[i].eventDate >= all[i - 1].eventDate).toBe(true);
    }
  });

  it('getUpcomingRealEvents returns only future events', () => {
    const upcoming = getUpcomingRealEvents();
    const today = new Date().toISOString().slice(0, 10);
    upcoming.forEach((e) => {
      expect(e.eventDate >= today).toBe(true);
    });
  });
});
