import type { GannEngine } from '../../data/schemas';

export default function GannResearchZone({ engine }: { engine: GannEngine }) {
  return (
    <div className="card">
      <h2>Gann Research Zone · {engine.ticker}</h2>
      <div className="badge badge--mute">Engine: {engine.engine_version}</div>
      <div className="banner banner--cyan" style={{ marginTop: 10 }}>
        <strong>RESEARCH ONLY</strong> · Square-of-Nine price zones and time windows are research
        instruments. Gann never emits a buy/sell trigger alone.
      </div>

      <div className="score-row">
        <div className="score score--gold">Price Score <b>{engine.gann_price_score}</b></div>
        <div className="score score--cyan">Time Score <b>{engine.gann_time_score}</b></div>
        <div className="score">Resonance <b>{engine.unified_gann_resonance_score}</b></div>
      </div>
      <dl className="kvs">
        <dt>Data Quality</dt>
        <dd>{engine.data_quality}</dd>
        <dt>Current Price</dt>
        <dd>{engine.current_price ?? '—'}</dd>
        <dt>Current Date</dt>
        <dd>{engine.current_date || '—'}</dd>
        <dt>Resonance State</dt>
        <dd>{engine.resonance_state}</dd>
        <dt>Status</dt>
        <dd>{engine.status}</dd>
      </dl>
      <h3 style={{ marginTop: 12 }}>Hard Missing Data (caps action)</h3>
      <ul className="bullets">
        {engine.hard_missing_data.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
      <h3 style={{ marginTop: 12 }}>Next Required</h3>
      <ul className="bullets">
        {engine.next_required.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
      <div className="disclaimer">
        Anchors and levels here are sample/manual-ready. Verify in Anchor Verification before any
        formal trading use. Square of Nine: target_price = (sqrt(base_price) ± angle/180)² across
        45° / 90° / 180° / 270° / 360° / 720°. Time windows: 7 / 14 / 21 / 34 / 55 / 60 / 90 / 144 /
        180 / 270 / 360 days, 60 weeks, 20 months, 60 months. Zone band ±0.5% default.
      </div>
    </div>
  );
}
