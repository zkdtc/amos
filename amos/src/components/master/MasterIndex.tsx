import { Link } from 'react-router-dom';
import type { MasterIndex } from '../../data/schemas';
import GuardrailBanner from '../guardrails/GuardrailBanner';

export default function MasterIndexView({ index }: { index: MasterIndex }) {
  return (
    <>
      <div className="card">
        <h1>AMOS Master Index</h1>
        <div className="badge badge--gold">PHASE · {index.phase}</div>{' '}
        <div className="badge badge--mute">MODE · {index.mode}</div>{' '}
        <div className="badge badge--orange">DATA · {index.data_quality}</div>
      </div>

      <GuardrailBanner title="Non-negotiable Guardrails" items={index.guardrails} />

      <div className="grid-2">
        <div className="card">
          <h2>Deliveries</h2>
          <ul className="bullets">
            {index.deliveries.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
        <div className="card">
          <h2>Gann Coverage</h2>
          <h3 style={{ marginTop: 8 }}>Gann Live</h3>
          <div className="tag-list">
            {index.gann_live.map((t) => (
              <Link key={t} to={`/stocks/${t}`} className="tag">{t}</Link>
            ))}
          </div>
          <h3 style={{ marginTop: 12 }}>Gann Pending</h3>
          <div className="tag-list">
            {index.gann_pending.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <div className="disclaimer">Anchor check: {index.anchor_check}</div>
        </div>
      </div>

      <div className="card">
        <h2>Modules</h2>
        <div className="row">
          {index.links.map((l) => (
            <Link key={l.to} to={l.to} className="badge badge--cyan" style={{ padding: '6px 12px' }}>
              {l.label} →
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
