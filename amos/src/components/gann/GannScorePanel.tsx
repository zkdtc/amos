import type { GannEngine } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

export default function GannScorePanel({ engine }: { engine: GannEngine }) {
  const { t } = useLang();
  return (
    <div className="card">
      <h3>{t.gannScoreSnapshot}</h3>
      <div className="score-row">
        <div className="score score--gold">{t.priceLabel} <b>{engine.gann_price_score}</b></div>
        <div className="score score--cyan">{t.timeLabel} <b>{engine.gann_time_score}</b></div>
        <div className="score">{t.unifiedLabel} <b>{engine.unified_gann_resonance_score}</b></div>
      </div>
      <div className="badge badge--mute">{engine.resonance_state}</div>
    </div>
  );
}
