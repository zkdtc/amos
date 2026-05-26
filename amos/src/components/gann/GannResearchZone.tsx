import type { GannEngine } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

export default function GannResearchZone({ engine }: { engine: GannEngine }) {
  const { t } = useLang();
  return (
    <div className="card">
      <h2>{t.gannResearchZoneTitle} {engine.ticker}</h2>
      <div className="badge badge--mute">Engine: {engine.engine_version}</div>
      <div className="banner banner--cyan" style={{ marginTop: 10 }}>
        <strong>{t.gannResearchOnly}</strong> · {t.gannResearchOnlyDesc}
      </div>

      <div className="score-row">
        <div className="score score--gold">{t.priceScore} <b>{engine.gann_price_score}</b></div>
        <div className="score score--cyan">{t.timeScore} <b>{engine.gann_time_score}</b></div>
        <div className="score">{t.resonance} <b>{engine.unified_gann_resonance_score}</b></div>
      </div>
      <dl className="kvs">
        <dt>{t.colDataQuality}</dt>
        <dd>{engine.data_quality}</dd>
        <dt>{t.colCurrentPrice}</dt>
        <dd>{engine.current_price ?? '—'}</dd>
        <dt>{t.colCurrentDate}</dt>
        <dd>{engine.current_date || '—'}</dd>
        <dt>{t.colResonanceState}</dt>
        <dd>{engine.resonance_state}</dd>
        <dt>{t.colStatus}</dt>
        <dd>{engine.status}</dd>
      </dl>
      <h3 style={{ marginTop: 12 }}>{t.hardMissingData}</h3>
      <ul className="bullets">
        {engine.hard_missing_data.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
      <h3 style={{ marginTop: 12 }}>{t.nextRequired}</h3>
      <ul className="bullets">
        {engine.next_required.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
      <div className="disclaimer">{t.gannResearchDisclaimer}</div>
    </div>
  );
}
