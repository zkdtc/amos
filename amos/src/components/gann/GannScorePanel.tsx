import type { GannEngine } from '../../data/schemas';

export default function GannScorePanel({ engine }: { engine: GannEngine }) {
  return (
    <div className="card">
      <h3>Gann Score Snapshot</h3>
      <div className="score-row">
        <div className="score score--gold">Price <b>{engine.gann_price_score}</b></div>
        <div className="score score--cyan">Time <b>{engine.gann_time_score}</b></div>
        <div className="score">Unified <b>{engine.unified_gann_resonance_score}</b></div>
      </div>
      <div className="badge badge--mute">{engine.resonance_state}</div>
    </div>
  );
}
