import { Link } from 'react-router-dom';
import type { PositionSummary, PortfolioTotals } from '../../data/portfolio';

export default function PortfolioBattleMap({
  rows,
  totals
}: {
  rows: PositionSummary[];
  totals: PortfolioTotals;
}) {
  return (
    <div className="card">
      <h3>Portfolio Battle Map</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <span className="badge badge--mute">positions {totals.positions}</span>
        <span className="badge badge--cyan">cost ${fmt(totals.costBasis)}</span>
        <span className="badge badge--gold">MV ${fmt(totals.marketValue)}</span>
        <span className={`badge ${totals.pnl >= 0 ? 'badge--green' : 'badge--red'}`}>
          P/L {totals.pnl >= 0 ? '+' : ''}${fmt(totals.pnl)} ({totals.pnlPct.toFixed(2)}%)
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Sym</th>
            <th>Role</th>
            <th>Shares</th>
            <th>Cost</th>
            <th>Price</th>
            <th>P/L %</th>
            <th>Market Val</th>
            <th>Freshness</th>
            <th>Cap</th>
            <th>Migration Suggestion</th>
            <th>Page</th>
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
              <td>{r.shares > 0 ? <Link to={`/stocks/${r.symbol}`}>open →</Link> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="disclaimer">
        Positions and avgCost are user-authored research. Capital-migration suggestions are heuristic
        — they NEVER place orders. Single-jianwei: 仓位不是身份, rotation discipline matters.
      </div>
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
