import type { ManualInput } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

export default function RSIMomentumPanel({ input }: { input?: ManualInput }) {
  const { t } = useLang();
  const rsi = input?.rsi14d ?? null;
  let regime: { label: string; color: string; note: string };
  if (rsi == null) {
    regime = { label: t.rsiNoData, color: 'badge--mute', note: t.rsiNoDataNote };
  } else if (rsi <= 25) {
    regime = { label: `Extreme Oversold (${rsi})`, color: 'badge--green', note: t.rsiExtremOversoldNote };
  } else if (rsi <= 35) {
    regime = { label: `Oversold (${rsi})`, color: 'badge--cyan', note: t.rsiOversoldNote };
  } else if (rsi < 65) {
    regime = { label: `Neutral (${rsi})`, color: 'badge--mute', note: t.rsiNeutralNote };
  } else if (rsi < 75) {
    regime = { label: `Overbought (${rsi})`, color: 'badge--orange', note: t.rsiOverboughtNote };
  } else {
    regime = { label: `Extreme Overbought (${rsi})`, color: 'badge--red', note: t.rsiExtremeOverboughtNote };
  }
  return (
    <div className="card">
      <h3>{t.rsiMomentumTitle}</h3>
      <div className={`badge ${regime.color}`}>{regime.label}</div>
      <ul className="bullets" style={{ marginTop: 10 }}>
        <li>{regime.note}</li>
        <li>{t.rsiBullet2}</li>
        <li>{t.rsiBullet3}</li>
      </ul>
    </div>
  );
}
