import type { ManualInput } from '../../data/schemas';

/**
 * RSI / Momentum panel. Single-jianwei: oversold/overbought + divergence +
 * mean-reversion maturity, all per his "RSI as panic-rebound seeker" framing.
 */
export default function RSIMomentumPanel({ input }: { input?: ManualInput }) {
  const rsi = input?.rsi14d ?? null;
  let regime: { label: string; color: string; note: string };
  if (rsi == null) {
    regime = { label: 'No RSI', color: 'badge--mute', note: 'No live price → no RSI computed.' };
  } else if (rsi <= 25) {
    regime = { label: `Extreme Oversold (${rsi})`, color: 'badge--green', note: 'Panic-rebound watch: only act if thesis intact AND Gann support + AVWAP align.' };
  } else if (rsi <= 35) {
    regime = { label: `Oversold (${rsi})`, color: 'badge--cyan', note: 'Mean-reversion candidate. Confirm with weekly structure.' };
  } else if (rsi < 65) {
    regime = { label: `Neutral (${rsi})`, color: 'badge--mute', note: 'Mid-range — no edge from momentum alone.' };
  } else if (rsi < 75) {
    regime = { label: `Overbought (${rsi})`, color: 'badge--orange', note: 'Late-trend warning. Avoid chasing; trim discipline.' };
  } else {
    regime = { label: `Extreme Overbought (${rsi})`, color: 'badge--red', note: 'Euphoria zone. Single-jianwei: trim, sell calls, no adds.' };
  }
  return (
    <div className="card">
      <h3>RSI / Momentum</h3>
      <div className={`badge ${regime.color}`}>{regime.label}</div>
      <ul className="bullets" style={{ marginTop: 10 }}>
        <li>{regime.note}</li>
        <li>Divergence (price HH vs RSI LH) is the highest-quality reversal tell.</li>
        <li>RSI alone never triggers action — requires trend, AVWAP, volume confirmation.</li>
      </ul>
    </div>
  );
}
