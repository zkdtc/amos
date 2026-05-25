import { useEffect, useState } from 'react';
import type { ManualInput } from '../data/schemas';
import { loadManualInputs } from '../data/loaders';
import { useLiveData } from '../data/LiveDataContext';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';

/**
 * Manual Workbook Viewer — read-only rendering of:
 *   - The original manual-inputs.json (user-authored research starting points)
 *   - The live-derived ManualInput per ticker (Yahoo-computed RSI/EMA/Trend)
 *
 * Per the engineering handoff §5: ManualWorkbookViewer is required.
 */
export default function ManualWorkbookPage() {
  const { liveMap, loading } = useLiveData();
  const [base, setBase] = useState<ManualInput[]>([]);
  useEffect(() => {
    loadManualInputs().then(setBase).catch(() => setBase([]));
  }, []);

  return (
    <>
      <div className="card">
        <h1>Manual Workbook (v0.2 unified)</h1>
        <div className="badge badge--gold">Manual Inputs · Live-Derived Inputs · Side-by-side</div>
      </div>
      <GuardrailBanner
        title="Manual Workbook Guardrails"
        items={[
          'Manual inputs are user research seeds, NOT live data.',
          'Live-derived inputs are computed from Yahoo Finance bars in real time.',
          'When values disagree, prefer the live-derived view for execution.'
        ]}
      />
      {loading && <div className="card">Loading live inputs…</div>}
      <div className="card">
        <h2>Manual Seed Inputs (from <code>manual-inputs.json</code>)</h2>
        <ManualInputTable inputs={base} />
      </div>
      <div className="card">
        <h2>Live-Derived Inputs (current Yahoo data)</h2>
        <ManualInputTable inputs={Array.from(liveMap.values()).map((l) => l.manualInput)} />
      </div>
    </>
  );
}

function ManualInputTable({ inputs }: { inputs: ManualInput[] }) {
  if (inputs.length === 0) return <div className="badge badge--mute">No inputs.</div>;
  return (
    <table>
      <thead>
        <tr>
          <th>Tkr</th>
          <th>Last</th>
          <th>RSI14</th>
          <th>EMA8</th>
          <th>EMA12</th>
          <th>Trend</th>
          <th>RS·QQQ</th>
          <th>AVWAP</th>
          <th>Risk Stack</th>
          <th>Bias</th>
          <th>Freshness</th>
        </tr>
      </thead>
      <tbody>
        {inputs.map((i) => (
          <tr key={i.ticker}>
            <td><b>{i.ticker}</b></td>
            <td>{i.lastPrice ?? '—'}</td>
            <td>{i.rsi14d ?? '—'}</td>
            <td>{i.ema8State}</td>
            <td>{i.ema12State}</td>
            <td>{i.trendStructure}</td>
            <td>{i.rsVsQqq}</td>
            <td>{i.avwapStatus}</td>
            <td>{i.riskStack}</td>
            <td>{i.actionBias}</td>
            <td>
              <span
                className={`badge ${
                  i.freshness === 'Fresh'
                    ? 'badge--green'
                    : i.freshness === 'Stale'
                    ? 'badge--orange'
                    : 'badge--red'
                }`}
              >
                {i.freshness}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
