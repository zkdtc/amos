import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import StatusBar from './StatusBar';

const NAV = [
  { to: '/', label: 'Master Index', end: true },
  { to: '/command-center', label: 'Command Center' },
  { to: '/portfolio', label: 'Portfolio Battle Map' },
  { to: '/peer-map', label: 'Peer Map' },
  { to: '/gann-registry', label: 'Gann Registry' },
  { to: '/daily-brief', label: 'Daily Brief' },
  { to: '/events', label: 'Macro Events' },
  { to: '/evidence', label: 'Evidence Packets' },
  { to: '/anchors', label: 'Anchor Verification' },
  { to: '/manual-workbook', label: 'Manual Workbook' }
];

const TICKERS = ['NVDA', 'CRDO', 'LITE', 'IREN', 'HOOD'];

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          AMOS
          <small>AI Market Operating System</small>
          <small>v0.3A Manual Data Alpha</small>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end as boolean | undefined}>
              {n.label}
            </NavLink>
          ))}
          <div style={{ marginTop: 14, color: 'var(--fg-mute)', fontSize: 11, padding: '4px 10px' }}>
            STOCKS
          </div>
          {TICKERS.map((t) => (
            <NavLink key={t} to={`/stocks/${t}`}>
              {t}
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
