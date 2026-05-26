import { Link } from 'react-router-dom';
import type { LiveTickerData } from '../../data/liveAdapter';
import type { BenchmarkSnapshot } from '../../data/liveBenchmarks';
import { relativeStrengthLabel } from '../../data/liveBenchmarks';
import type { Ticker } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

export default function LeadershipBoard({
  tickers,
  liveMap,
  qqq
}: {
  tickers: Ticker[];
  liveMap: Map<string, LiveTickerData>;
  qqq?: BenchmarkSnapshot;
}) {
  const { t } = useLang();

  const rows = tickers
    .map((tkr) => {
      const live = liveMap.get(tkr.symbol);
      const rs = live && qqq ? relativeStrengthLabel(live.bars, qqq.bars, 20) : t.noData;
      return { tkr, live, rs, rank: rankRS(rs) };
    })
    .sort((a, b) => b.rank - a.rank);

  return (
    <div className="card">
      <h3>{t.leadershipBoardTitle}</h3>
      <table>
        <thead>
          <tr>
            <th>{t.colSymbol}</th>
            <th>{t.colArchetype}</th>
            <th>{t.currentPrice}</th>
            <th>{t.col1d}</th>
            <th>{t.colRsLabel}</th>
            <th>{t.colOpen}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ tkr, live, rs }) => (
            <tr key={tkr.symbol}>
              <td><b>{tkr.symbol}</b></td>
              <td style={{ color: 'var(--fg-mute)', fontSize: 12 }}>{tkr.archetype}</td>
              <td>{live ? `$${live.quote.regularMarketPrice.toFixed(2)}` : '—'}</td>
              <td style={{ color: (live?.quote.regularMarketChangePercent ?? 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {live ? `${live.quote.regularMarketChangePercent >= 0 ? '+' : ''}${live.quote.regularMarketChangePercent.toFixed(2)}%` : '—'}
              </td>
              <td>
                <span className={`badge ${rsClass(rs)}`}>{rs}</span>
              </td>
              <td><Link to={`/stocks/${tkr.symbol}`}>{t.openArrow}</Link></td>
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
