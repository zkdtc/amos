import { useLiveData } from '../../data/LiveDataContext';
import type { MarketClockState } from '../../data/liveAdapter';

export default function StatusBar() {
  const { isLive, loading, error, lastFetched, marketClock } = useLiveData();

  const phase = isLive ? 'v0.3B Live-Read Alpha' : 'v0.3A Manual Data Alpha';
  const dataLabel = isLive
    ? marketClock.isOpen
      ? 'LIVE (Yahoo Finance)'
      : 'LAST CLOSE (Yahoo Finance)'
    : 'sample / manual-ready (NOT LIVE)';
  const dataBadge = isLive ? 'badge badge--green' : 'badge badge--orange';
  const clockBadge = clockBadgeFor(marketClock);

  return (
    <div className="statusbar">
      <span className="badge badge--gold">PHASE {phase}</span>
      <span className="badge badge--mute">MODE manual_alpha</span>
      <span className={dataBadge}>DATA {dataLabel}</span>
      <span className={`badge ${clockBadge.cls}`} title={clockBadge.title}>
        MKT · {clockBadge.label}
      </span>
      <span className="badge badge--mute">NO BROKERAGE · READ ONLY</span>
      {loading && <span className="badge badge--cyan">⟳ fetching…</span>}
      {error && <span className="badge badge--red" title={error}>⚠ fallback</span>}
      <span style={{ marginLeft: 'auto', color: 'var(--fg-mute)', fontSize: 11 }}>
        {lastFetched ? `last: ${new Date(lastFetched).toLocaleTimeString()}` : 'AMOS local prototype'}
      </span>
    </div>
  );
}

function clockBadgeFor(c: MarketClockState): { label: string; cls: string; title: string } {
  const close = c.lastSessionClose.toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' });
  const open = c.nextSessionOpen.toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' });
  switch (c.phase) {
    case 'regular':
      return { label: 'OPEN', cls: 'badge--green', title: `Regular hours. Last close: ${close}` };
    case 'pre':
      return { label: 'PRE-MKT', cls: 'badge--cyan', title: `Pre-market. Opens at ${open} ET` };
    case 'post':
      return { label: 'AFTER-HOURS', cls: 'badge--cyan', title: `After-hours. Next open ${open} ET` };
    case 'closed-weekend':
      return { label: 'WEEKEND', cls: 'badge--orange', title: `Last close: ${close} ET · Next open: ${open} ET — using last close` };
    case 'closed-overnight':
      return { label: 'CLOSED', cls: 'badge--orange', title: `Last close: ${close} ET · Next open: ${open} ET — using last close` };
  }
}
