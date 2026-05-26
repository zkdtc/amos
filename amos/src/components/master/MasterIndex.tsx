import { Link } from 'react-router-dom';
import type { MasterIndex } from '../../data/schemas';
import GuardrailBanner from '../guardrails/GuardrailBanner';
import { useLang } from '../../data/LangContext';

export default function MasterIndexView({ index }: { index: MasterIndex }) {
  const { t } = useLang();
  return (
    <>
      <div className="card">
        <h1>{t.amosMasterIndex}</h1>
        <div className="badge badge--gold">PHASE · {index.phase}</div>{' '}
        <div className="badge badge--mute">MODE · {index.mode}</div>{' '}
        <div className="badge badge--orange">DATA · {index.data_quality}</div>
      </div>

      <GuardrailBanner title={t.nonNegotiableGuardrails} items={index.guardrails} />

      <div className="grid-2">
        <div className="card">
          <h2>{t.deliveries}</h2>
          <ul className="bullets">
            {index.deliveries.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
        <div className="card">
          <h2>{t.gannCoverage}</h2>
          <h3 style={{ marginTop: 8 }}>{t.gannLive}</h3>
          <div className="tag-list">
            {index.gann_live.map((sym) => (
              <Link key={sym} to={`/stocks/${sym}`} className="tag">{sym}</Link>
            ))}
          </div>
          <h3 style={{ marginTop: 12 }}>{t.gannPending}</h3>
          <div className="tag-list">
            {index.gann_pending.map((sym) => (
              <span key={sym} className="tag">{sym}</span>
            ))}
          </div>
          <div className="disclaimer">{t.anchorCheck} {index.anchor_check}</div>
        </div>
      </div>

      <div className="card">
        <h2>{t.modules}</h2>
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
