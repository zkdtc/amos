import { describe, expect, it } from 'vitest';
import { deriveFreshness, getMarketClock } from '../data/liveAdapter';

// Build a Date at a specific NY wall-clock moment.
// We approximate ET as UTC-4 (EDT) during May.
function nyMomentMay(day: number, hour: number, minute = 0): Date {
  // May 2026 is EDT (UTC-4)
  const utcHour = hour + 4;
  return new Date(Date.UTC(2026, 4, day, utcHour, minute, 0));
}

describe('market clock', () => {
  it('Mon 10:00 ET is regular session', () => {
    // 2026-05-25 is a Monday
    const now = nyMomentMay(25, 10, 0);
    const c = getMarketClock(now);
    expect(c.isOpen).toBe(true);
    expect(c.phase).toBe('regular');
  });

  it('Sun 23:00 ET is closed-weekend', () => {
    // 2026-05-24 is a Sunday
    const now = nyMomentMay(24, 23, 0);
    const c = getMarketClock(now);
    expect(c.isOpen).toBe(false);
    expect(c.phase).toBe('closed-weekend');
  });

  it('Mon 02:00 ET (overnight) is closed-overnight', () => {
    const now = nyMomentMay(25, 2, 0);
    const c = getMarketClock(now);
    expect(c.isOpen).toBe(false);
    expect(c.phase).toBe('closed-overnight');
  });

  it('Mon 06:00 ET is pre-market', () => {
    const now = nyMomentMay(25, 6, 0);
    const c = getMarketClock(now);
    expect(c.phase).toBe('pre');
  });

  it('Mon 17:00 ET is after-hours', () => {
    const now = nyMomentMay(25, 17, 0);
    const c = getMarketClock(now);
    expect(c.phase).toBe('post');
  });
});

describe('market-aware freshness', () => {
  it('mid-session: quote 5 min ago → Fresh', () => {
    const now = nyMomentMay(25, 11, 0); // Mon 11:00 ET
    const quote = new Date(now.getTime() - 5 * 60_000).getTime() / 1000;
    expect(deriveFreshness(quote, now)).toBe('Fresh');
  });

  it('mid-session: quote 1 h ago → Stale', () => {
    const now = nyMomentMay(25, 11, 0);
    const quote = new Date(now.getTime() - 60 * 60_000).getTime() / 1000;
    expect(deriveFreshness(quote, now)).toBe('Stale');
  });

  it('weekend Sunday night with Friday-close quote → Fresh', () => {
    // 2026-05-22 Friday close at 16:00 ET
    const friClose = nyMomentMay(22, 16, 0).getTime() / 1000;
    // Now: Sunday 23:00 ET
    const sunNight = nyMomentMay(24, 23, 0);
    expect(deriveFreshness(friClose, sunNight)).toBe('Fresh');
  });

  it('weekend Saturday morning with Friday-close quote → Fresh', () => {
    const friClose = nyMomentMay(22, 16, 0).getTime() / 1000;
    const satMorning = nyMomentMay(23, 8, 0);
    expect(deriveFreshness(friClose, satMorning)).toBe('Fresh');
  });

  it('Monday open with quote from previous Friday → Fresh (haven’t fetched yet today)', () => {
    const friClose = nyMomentMay(22, 16, 0).getTime() / 1000;
    const monPreMkt = nyMomentMay(25, 7, 0);
    expect(deriveFreshness(friClose, monPreMkt)).toBe('Fresh');
  });

  it('quote a full week old → Missing', () => {
    const tenDaysAgo = nyMomentMay(15, 16, 0).getTime() / 1000;
    const now = nyMomentMay(25, 11, 0);
    expect(deriveFreshness(tenDaysAgo, now)).toBe('Missing');
  });
});
