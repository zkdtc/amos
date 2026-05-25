import { Link } from 'react-router-dom';
import type { LiveTickerData } from '../../data/liveAdapter';
import type { BenchmarkSnapshot } from '../../data/liveBenchmarks';
import { relativeStrengthLabel } from '../../data/liveBenchmarks';
import type { Ticker } from '../../data/schemas';

/**
 * Leadership Board — per single-jianwei doctrine:
 *   "龙头是流动性聚焦点". Sort tickers by relative-strength vs QQQ.
 */
export default function LeadershipBoard({
  tickers,
  liveMap,
  qqq
}: {
  tickers: Ticker[];
  liveMap: Map<string, LiveTickerData>;
  qqq?: BenchmarkSnapshot;
}) {
  const rows = tickers
    .map((t) => {
      const live = liveMap.get(t.symbol);
      const rs = live && qqq ? relativeStrengthLabel(live.bars, qqq.bars, 20) : 'No Data';
      return { t, live, rs, rank: rankRS(rs) };
    })
    .sort((a, b) => b.rank - a.rank);

  return (
    <div className="card">
      <h3>Leadership Board (RS vs QQQ · 20d)</h3>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Archetype</th>
            <th>Price</th>
            <th>1d</th>
            <th>RS Label</th>
            <th>Open</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ t, live, rs }) => (
            <tr key={t.symbol}>
              <td><b>{t.symbol}</b></td>
              <td style={{ color: 'var(--fg-mute)', fontSize: 12 }}>{t.archetype}</td>
              <td>{live ? `$${live.quote.regularMarketPrice.toFixed(2)}` : '—'}</td>
              <td style={{ color: (live?.quote.regularMarketChangePercent ?? 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {live ? `${live.quote.regularMarketChangePercent >= 0 ? '+' : ''}${live.quote.regularMarketChangePercent.toFixed(2)}%` : '—'}
              </td>
              <td>
                <span className={`badge ${rsClass(rs)}`}>{rs}</span>
              </td>
              <td><Link to={`/stocks/${t.symbol}`}>open →</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function rankRS(s: string) {
  return { Leader: 5, Strong: 4, Mixed: 3, Follower: 2, Laggard: 1 }[s as 'Leader'] ?? 0;
}
function rsClass(s: string) {
  switch (s) {
    case 'Leader': return 'badge--green';
    case 'Strong': return 'badge--cyan';
    case 'Mixed': return 'badge--mute';
    case 'Follower': return 'badge--orange';
    case 'Laggard': return 'badge--red';
    default: return 'badge--mute';
  }
}
