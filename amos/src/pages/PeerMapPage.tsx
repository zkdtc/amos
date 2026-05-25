import { Link } from 'react-router-dom';
import { PEER_MAP } from '../data/peerMaps';
import { useLiveData } from '../data/LiveDataContext';

export default function PeerMapPage() {
  const { liveMap } = useLiveData();
  const cohorts = Object.values(PEER_MAP);
  return (
    <>
      <div className="card">
        <h1>Peer Maps · Capital Migration Atlas</h1>
        <div className="badge badge--cyan">Single-jianwei: 资金从弱标的迁移到强标的</div>
      </div>
      {cohorts.map((c) => (
        <div className="card" key={c.ticker}>
          <h2>
            <Link to={`/stocks/${c.ticker}`}>{c.ticker}</Link> · {c.archetype}
          </h2>
          <div className="badge badge--mute">{c.branch}</div>
          <table style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>Peer</th>
                <th>Relation</th>
                <th>Note</th>
                <th>Live Px</th>
              </tr>
            </thead>
            <tbody>
              {c.peers.map((p) => {
                const live = liveMap.get(p.symbol);
                return (
                  <tr key={p.symbol}>
                    <td><b>{p.symbol}</b></td>
                    <td><span className={`badge ${relClass(p.relation)}`}>{p.relation}</span></td>
                    <td>{p.note}</td>
                    <td>{live ? `$${live.quote.regularMarketPrice.toFixed(2)}` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

function relClass(r: string) {
  switch (r) {
    case 'leader': return 'badge--green';
    case 'follower': return 'badge--cyan';
    case 'laggard': return 'badge--red';
    default: return 'badge--mute';
  }
}
