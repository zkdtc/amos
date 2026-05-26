import { useLiveData } from '../../data/LiveDataContext';
import { useLang } from '../../data/LangContext';
import type { MarketClockState } from '../../data/liveAdapter';

export default function StatusBar() {
  const { isLive, loading, error, lastFetched, marketClock } = useLiveData();
  const { t, toggle } = useLang();

  const phase = isLive ? 'v0.3B Live-Read Alpha' : 'v0.3A Manual Data Alpha';
  const dataLabel = isLive
    ? marketClock.isOpen
      ? t.dataLive
      : t.dataLastClose
    : t.dataSample;
  const dataBadge = isLive ? 'badge badge--green' : 'badge badge--orange';
  const clockBadge = clockBadgeFor(marketClock, t);

  return (
    <div className="statusbar">
      <span className="badge badge--gold">{t.phase} {phase}</span>
      <span className="badge badge--mute">{t.mode}</span>
      <span className={dataBadge}>DATA {dataLabel}</span>
      <span className={`badge ${clockBadge.cls}`} title={clockBadge.title}>
        MKT · {clockBadge.label}
      </span>
      <span className="badge badge--mute">{t.noBrokerage}</span>
      {loading && <span className="badge badge--cyan">{t.fetching}</span>}
      {error && <span className="badge badge--red" title={error}>{t.fallback}</span>}
      <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: 'var(--fg-mute)', fontSize: 11 }}>
          {lastFetched ? `${t.last}: ${new Date(lastFetched).toLocaleTimeString()}` : t.localPrototype}
        </span>
        <button
          onClick={toggle}
          style={{
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--fg)',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: 'var(--mono)',
            fontWeight: 600,
            padding: '3px 10px',
            letterSpacing: '0.03em',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          title="Switch language / 切换语言"
        >
          {t.toggleLang}
        </button>
      </span>
    </div>
  );
}

function clockBadgeFor(
  c: MarketClockState,
  t: ReturnType<typeof useLang>['t']
): { label: string; cls: string; title: string } {
  const close = c.lastSessionClose.toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' });
  const open = c.nextSessionOpen.toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' });
  switch (c.phase) {
    case 'regular':
      return { label: t.open, cls: 'badge--green', title: `Regular hours. Last close: ${close}` };
    case 'pre':
      return { label: t.preMkt, cls: 'badge--cyan', title: `Pre-market. Opens at ${open} ET` };
    case 'post':
      return { label: t.afterHours, cls: 'badge--cyan', title: `After-hours. Next open ${open} ET` };
    case 'closed-weekend':
      return { label: t.weekend, cls: 'badge--orange', title: `Last close: ${close} ET · Next open: ${open} ET` };
    case 'closed-overnight':
      return { label: t.closed, cls: 'badge--orange', title: `Last close: ${close} ET · Next open: ${open} ET` };
  }
}
