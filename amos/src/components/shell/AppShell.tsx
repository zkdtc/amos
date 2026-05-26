import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import StatusBar from './StatusBar';
import { useLang } from '../../data/LangContext';

const TICKERS = ['NVDA', 'CRDO', 'LITE', 'IREN', 'HOOD'];

export default function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLang();

  const NAV = [
    { to: '/', label: t.masterIndex, end: true },
    { to: '/command-center', label: t.commandCenter },
    { to: '/portfolio', label: t.portfolio },
    { to: '/peer-map', label: t.peerMap },
    { to: '/gann-registry', label: t.gannRegistry },
    { to: '/daily-brief', label: t.dailyBrief },
    { to: '/events', label: t.macroEvents },
    { to: '/evidence', label: t.evidence },
    { to: '/anchors', label: t.anchors },
    { to: '/manual-workbook', label: t.manualWorkbook },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          AMOS
          <small>{t.brandFull}</small>
          <small>{t.brandVersion}</small>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end as boolean | undefined}>
              {n.label}
            </NavLink>
          ))}
          <div style={{ marginTop: 14, color: 'var(--fg-mute)', fontSize: 11, padding: '4px 10px' }}>
            {t.stocks}
          </div>
          {TICKERS.map((t2) => (
            <NavLink key={t2} to={`/stocks/${t2}`}>
              {t2}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <StatusBar />
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
