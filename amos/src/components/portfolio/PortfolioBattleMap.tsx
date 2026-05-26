import { Link } from 'react-router-dom';
import type { PositionSummary, PortfolioTotals } from '../../data/portfolio';
import { useLang } from '../../data/LangContext';

export default function PortfolioBattleMap({
  rows,
  totals
}: {
  rows: PositionSummary[];
  totals: PortfolioTotals;
}) {
  const { t } = useLang();
  return (
    <div className="card">
      <h3>{t.portfolioBattleMapTitle}</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <span className="badge badge--mute">{t.positions} {totals.positions}</span>
        <span className="badge badge--cyan">{t.cost} ${fmt(totals.costBasis)}</span>
        <span className="badge badge--gold">{t.mv} ${fmt(totals.marketValue)}</span>
        <span className={`badge ${totals.pnl >= 0 ? 'badge--green' : 'badge--red'}`}>
          {t.pl} {totals.pnl >= 0 ? '+' : ''}${fmt(totals.pnl)} ({totals.pnlPct.toFixed(2)}%)
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>{t.colSym}</th>
            <th>{t.colRole}</th>
            <th>{t.colShares}</th>
            <th>{t.colCost}</th>
            <th>{t.currentPrice}</th>
            <th>{t.colPnlPct}</th>
            <th>{t.colMarketVal}</th>
            <th>{t.colFreshness}</th>
            <th>{t.colCap}</th>
            <th>{t.colMigrationSuggestion}</th>
            <th>{t.colPage}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.symbol}>
              <td><b>{r.symbol}</b></td>
              <td><span className={`badge ${roleClass(r.role)}`}>{r.role}</span></td>
              <td>{r.shares}</td>
              <td>${r.avgCost.toFixed(2)}</td>
              <td>{r.currentPrice != null ? `$${r.currentPrice.toFixed(2)}` : '—'}</td>
              <td style={{ color: (r.unrealizedPctNum ?? 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {r.unrealizedPctNum != null ? `${r.unrealizedPctNum.toFixed(1)}%` : '—'}
              </td>
              <td>{r.marketValue != null ? `$${fmt(r.marketValue)}` : '—'}</td>
              <td><span className={`badge ${freshClass(r.freshness)}`}>{r.freshness}</span></td>
              <td><span className="badge badge--orange">{r.effectiveCap}</span></td>
              <td style={{ color: 'var(--orange)' }}>{r.migrationSuggestion}</td>
              <td>{r.shares > 0 ? <Link to={`/stocks/${r.symbol}`}>{t.openArrow}</Link> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="disclaimer">{t.portfolioDisclaimer}</div>
    </div>
  );
}

function fmt(x: number) { return x.toLocaleString(undefined, { maximumFractionDigits: 0 }); }

function roleClass(r: string) {
  switch (r) {
    case 'Core': return 'badge--gold';
    case 'Swing': return 'badge--cyan';
    case 'Tactical': return 'badge--orange';
    case 'Runner': return 'badge--green';
    case 'Research': return 'badge--mute';
    default: return 'badge--mute';
  }
}
function freshClass(f: string) {
  if (f === 'Fresh') return 'badge--green';
  if (f === 'Stale') return 'badge--orange';
  return 'badge--red';
}
