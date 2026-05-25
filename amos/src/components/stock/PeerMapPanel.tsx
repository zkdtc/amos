import { getPeerCohort } from '../../data/peerMaps';

export default function PeerMapPanel({ symbol }: { symbol: string }) {
  const cohort = getPeerCohort(symbol);
  if (!cohort) {
    return (
      <div className="card">
        <h3>Peer Map</h3>
        <div className="badge badge--mute">No peer cohort defined for {symbol}.</div>
      </div>
    );
  }
  return (
    <div className="card">
      <h3>Peer Map · {symbol}</h3>
      <div className="badge badge--cyan">{cohort.archetype}</div>{' '}
      <div className="badge badge--mute">{cohort.branch}</div>
      <table style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Peer</th>
            <th>Relation</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {cohort.peers.map((p) => (
            <tr key={p.symbol}>
              <td><b>{p.symbol}</b></td>
              <td>
                <span className={`badge ${relationClass(p.relation)}`}>{p.relation}</span>
              </td>
              <td>{p.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="disclaimer">
        Use peer map for capital-migration decisions: rotate FROM weakening peers INTO the strongest leader inside the same branch.
      </div>
    </div>
  );
}

function relationClass(r: string) {
  switch (r) {
    case 'leader': return 'badge--green';
    case 'follower': return 'badge--cyan';
    case 'laggard': return 'badge--red';
    case 'adjacent': return 'badge--mute';
    default: return 'badge--mute';
  }
}
