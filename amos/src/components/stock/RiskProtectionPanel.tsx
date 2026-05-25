import type { ManualInput, Ticker } from '../../data/schemas';

export default function RiskProtectionPanel({ ticker, input }: { ticker: Ticker; input?: ManualInput }) {
  const isCore = ticker.role === 'Core';
  return (
    <div className="card">
      <h3>Risk Protection & Behavior Guardrails</h3>
      <ul className="bullets">
        <li>Protect actual P/L, not abstract fear. Risk warnings here are user-personalized.</li>
        <li>
          High-euphoria trim/exit warnings must be loud and decisive. User history shows leverage
          misuse, holding winners too long, and capitulation after forced liquidation.
        </li>
        <li>
          {isCore
            ? 'Core leader: Puts are NOT the default hedge. Prefer selling calls in slow climbs or direct trimming in extreme heat.'
            : 'Tactical / Swing / Research: position-size discipline, time-stop, and rotation candidate review.'}
        </li>
        <li>
          Bottom-fishing requires: panic maturity high, thesis intact, valuation compressed, Gann
          support+time window, RSI oversold/divergent, AVWAP/weekly 12 EMA support, volume
          exhaustion/reversal, sector liquidity intact.
        </li>
        <li>
          Risk Stack (manual): <b>{input?.riskStack ?? '—'}</b> · Action Bias:{' '}
          <b>{input?.actionBias ?? '—'}</b>
        </li>
      </ul>
    </div>
  );
}
