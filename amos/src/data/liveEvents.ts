/**
 * AMOS v0.3B Live Events Adapter — Yahoo Finance Calendar
 *
 * Fetches earnings dates from Yahoo quoteSummary calendarEvents module.
 * Macro events (FOMC, CPI, PCE, NFP) remain manual — no free real-time
 * source exists that is CORS-friendly. The manual events.json is merged
 * with any live earnings dates discovered here.
 */

import type { MacroEvent } from './schemas';

interface YahooCalendarResult {
  earnings?: {
    earningsDate?: Array<{ raw: number; fmt: string }>;
  };
}

export async function fetchEarningsDate(symbol: string): Promise<MacroEvent | null> {
  try {
    const url = `/api/yahoo/quoteSummary/${symbol}?modules=calendarEvents`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const cal: YahooCalendarResult | undefined =
      json?.quoteSummary?.result?.[0]?.calendarEvents;
    if (!cal?.earnings?.earningsDate?.length) return null;

    const earningsEntry = cal.earnings.earningsDate[0];
    const d = new Date(earningsEntry.raw * 1000);
    const dateStr = d.toISOString().slice(0, 10);

    return {
      eventId: `EVT-EARN-${symbol}-${dateStr}`,
      eventDate: dateStr,
      eventTime: 'TBD',
      category: 'Earnings',
      importance: 'Critical',
      riskMode: 'Elevated',
      actionCap: 'No Attack',
      postEventReviewRequired: true,
      title: `${symbol} Earnings (live)`,
      sourceUrl: `https://finance.yahoo.com/quote/${symbol}`
    };
  } catch {
    return null;
  }
}

export async function fetchAllEarningsDates(symbols: string[]): Promise<MacroEvent[]> {
  const results = await Promise.allSettled(symbols.map(fetchEarningsDate));
  const events: MacroEvent[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) events.push(r.value);
  }
  return events;
}

/**
 * Merge manual events with live earnings, deduplicating by ticker+date.
 */
export function mergeEventsWithEarnings(
  manualEvents: MacroEvent[],
  liveEarnings: MacroEvent[]
): MacroEvent[] {
  const seen = new Set(manualEvents.map((e) => e.eventId));
  const merged = [...manualEvents];
  for (const e of liveEarnings) {
    if (!seen.has(e.eventId)) {
      merged.push(e);
      seen.add(e.eventId);
    }
  }
  // Sort by date
  merged.sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  return merged;
}
