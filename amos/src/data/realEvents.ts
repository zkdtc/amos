/**
 * Real 2026 macro event calendar — sourced from federalreserve.gov and public schedules.
 * These are factual calendar dates, not mock data.
 *
 * FOMC 2026: Jan 27-28, Mar 17-18, Apr 28-29, Jun 16-17, Jul 28-29, Sep 15-16, Oct 27-28, Dec 8-9
 * (* = includes SEP/Dot Plot: Mar, Jun, Sep, Dec)
 */

import type { MacroEvent } from './schemas';

export const REAL_MACRO_EVENTS_2026: MacroEvent[] = [
  // ─── FOMC Meetings (past ones included for reference) ─────────────
  {
    eventId: 'FOMC-2026-01-28',
    eventDate: '2026-01-28',
    eventTime: '14:00 ET',
    category: 'Macro / Fed',
    importance: 'Critical',
    riskMode: 'Elevated',
    actionCap: 'No Attack',
    postEventReviewRequired: true,
    title: 'FOMC Rate Decision (Jan)',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomcpressconf20260128.htm'
  },
  {
    eventId: 'FOMC-2026-03-18',
    eventDate: '2026-03-18',
    eventTime: '14:00 ET',
    category: 'Macro / Fed',
    importance: 'Critical',
    riskMode: 'Elevated',
    actionCap: 'No Attack',
    postEventReviewRequired: true,
    title: 'FOMC Rate Decision + SEP/Dot Plot (Mar)*',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomcpresconf20260318.htm'
  },
  {
    eventId: 'FOMC-2026-04-29',
    eventDate: '2026-04-29',
    eventTime: '14:00 ET',
    category: 'Macro / Fed',
    importance: 'Critical',
    riskMode: 'Elevated',
    actionCap: 'No Attack',
    postEventReviewRequired: true,
    title: 'FOMC Rate Decision (Apr) — held 3.50-3.75%',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomcpresconf20260429.htm'
  },
  {
    eventId: 'FOMC-2026-06-17',
    eventDate: '2026-06-17',
    eventTime: '14:00 ET',
    category: 'Macro / Fed',
    importance: 'Critical',
    riskMode: 'Elevated',
    actionCap: 'No Attack',
    postEventReviewRequired: true,
    title: 'FOMC Rate Decision + SEP/Dot Plot (Jun)*',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm'
  },
  {
    eventId: 'FOMC-2026-07-29',
    eventDate: '2026-07-29',
    eventTime: '14:00 ET',
    category: 'Macro / Fed',
    importance: 'Critical',
    riskMode: 'Elevated',
    actionCap: 'No Attack',
    postEventReviewRequired: true,
    title: 'FOMC Rate Decision (Jul)',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm'
  },
  {
    eventId: 'FOMC-2026-09-16',
    eventDate: '2026-09-16',
    eventTime: '14:00 ET',
    category: 'Macro / Fed',
    importance: 'Critical',
    riskMode: 'Elevated',
    actionCap: 'No Attack',
    postEventReviewRequired: true,
    title: 'FOMC Rate Decision + SEP/Dot Plot (Sep)*',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm'
  },
  {
    eventId: 'FOMC-2026-10-28',
    eventDate: '2026-10-28',
    eventTime: '14:00 ET',
    category: 'Macro / Fed',
    importance: 'Critical',
    riskMode: 'Elevated',
    actionCap: 'No Attack',
    postEventReviewRequired: true,
    title: 'FOMC Rate Decision (Oct)',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm'
  },
  {
    eventId: 'FOMC-2026-12-09',
    eventDate: '2026-12-09',
    eventTime: '14:00 ET',
    category: 'Macro / Fed',
    importance: 'Critical',
    riskMode: 'Elevated',
    actionCap: 'No Attack',
    postEventReviewRequired: true,
    title: 'FOMC Rate Decision + SEP/Dot Plot (Dec)*',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm'
  },

  // ─── Monthly OPEX (third Friday) ──────────────────────────────────
  ...generateMonthlyOPEX(2026),

  // ─── Quarterly OPEX / Quad Witching ───────────────────────────────
  {
    eventId: 'QOPEX-2026-06-19',
    eventDate: '2026-06-19',
    eventTime: '16:00 ET',
    category: 'Mechanical / Quad Witching',
    importance: 'High',
    riskMode: 'Caution',
    actionCap: 'Reduced Size',
    postEventReviewRequired: false,
    title: 'Quarterly OPEX / Quad Witching (Jun)',
    sourceUrl: ''
  },
  {
    eventId: 'QOPEX-2026-09-18',
    eventDate: '2026-09-18',
    eventTime: '16:00 ET',
    category: 'Mechanical / Quad Witching',
    importance: 'High',
    riskMode: 'Caution',
    actionCap: 'Reduced Size',
    postEventReviewRequired: false,
    title: 'Quarterly OPEX / Quad Witching (Sep)',
    sourceUrl: ''
  },
  {
    eventId: 'QOPEX-2026-12-18',
    eventDate: '2026-12-18',
    eventTime: '16:00 ET',
    category: 'Mechanical / Quad Witching',
    importance: 'High',
    riskMode: 'Caution',
    actionCap: 'Reduced Size',
    postEventReviewRequired: false,
    title: 'Quarterly OPEX / Quad Witching (Dec)',
    sourceUrl: ''
  }
];

function generateMonthlyOPEX(year: number): MacroEvent[] {
  const events: MacroEvent[] = [];
  for (let month = 0; month < 12; month++) {
    // Third Friday of month
    const first = new Date(year, month, 1);
    let friday = 1 + ((5 - first.getDay() + 7) % 7);
    friday += 14; // third Friday
    const d = new Date(year, month, friday);
    const dateStr = d.toISOString().slice(0, 10);
    const monthName = d.toLocaleString('en', { month: 'short' });
    events.push({
      eventId: `OPEX-${dateStr}`,
      eventDate: dateStr,
      eventTime: '16:00 ET',
      category: 'Mechanical / OPEX',
      importance: 'Medium',
      riskMode: 'Caution',
      actionCap: 'Reduced Size',
      postEventReviewRequired: false,
      title: `Monthly OPEX (${monthName})`,
      sourceUrl: ''
    });
  }
  return events;
}

/**
 * Get only future events from today onwards, sorted by date.
 */
export function getUpcomingRealEvents(): MacroEvent[] {
  const today = new Date().toISOString().slice(0, 10);
  return REAL_MACRO_EVENTS_2026
    .filter((e) => e.eventDate >= today)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
}

/**
 * Get all events (past + future), sorted by date.
 */
export function getAllRealEvents(): MacroEvent[] {
  return [...REAL_MACRO_EVENTS_2026].sort((a, b) =>
    a.eventDate.localeCompare(b.eventDate)
  );
}
