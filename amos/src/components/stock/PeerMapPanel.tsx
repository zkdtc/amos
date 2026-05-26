import { getPeerCohort } from '../../data/peerMaps';
import { useLang } from '../../data/LangContext';

export default function PeerMapPanel({ symbol }: { symbol: string }) {
  const { t } = useLang();
  const cohort = getPeerCohort(symbol);
  if (!cohort) {
    return (
      <div className="card">
        <h3>{t.peerMapTitle}</h3>
        <div className="badge badge--mute">{t.noPeerCohort} {symbol}.</div>
      </div>
    );
  }
  return (
    <div className="card">
      <h3>{t.peerMapTitle} · {symbol}</h3>
      <div className="badge badge--cyan">{cohort.archetype}</div>{' '}
      <div className="badge badge--mute">{cohort.branch}</div>
      <table style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>{t.colPeer}</th>
            <th>{t.colRelation}</th>
            <th>{t.colNote}</th>
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
      <div className="disclaimer">{t.peerMapDisclaimer}</div>
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
