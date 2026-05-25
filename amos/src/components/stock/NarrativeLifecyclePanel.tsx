import { useMemo } from 'react';
import type { LiveTickerData } from '../../data/liveAdapter';
import { classifyNarrativePhase, type NarrativeAssessment, type NarrativePhase } from '../../data/narrativeLifecycle';

export default function NarrativeLifecyclePanel({ liveData }: { liveData?: LiveTickerData }) {
  const result = useMemo<NarrativeAssessment | null>(() => {
    if (!liveData?.bars?.length) return null;
    return classifyNarrativePhase({
      bars: liveData.bars,
      rsi14: liveData.manualInput.rsi14d,
      rsVsBench: liveData.manualInput.rsVsQqq
    });
  }, [liveData]);

  if (!result) {
    return (
      <div className="card">
        <h3>Narrative Lifecycle</h3>
        <div className="badge badge--mute">No live bars → phase unknown.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Narrative Lifecycle</h3>
      <div className={`badge ${phaseClass(result.phase)}`}>
        PHASE · {result.phase} ({(result.confidence * 100).toFixed(0)}%)
      </div>
      <div className="phase-strip">
        {(['Origin', 'Discovery', 'Acceleration', 'Saturation', 'Decline'] as NarrativePhase[]).map((p) => (
          <span key={p} className={`phase-cell ${p === result.phase ? 'phase-cell--active' : ''}`}>
            {p}
          </span>
        ))}
      </div>
      <dl className="kvs">
        <dt>Capital Type</dt>
        <dd>{result.capitalType}</dd>
        <dt>News Sensitivity</dt>
        <dd>{result.newsSensitivity}</dd>
        <dt>Expected Behavior</dt>
        <dd>{result.expectedBehavior}</dd>
      </dl>
      <h4 style={{ marginTop: 10, color: 'var(--fg-mute)' }}>Rationale</h4>
      <ul className="bullets">
        {result.rationale.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
      <div className="disclaimer">
        Lifecycle is a heuristic classifier. No trade signal is emitted. Use with valuation + Gann + risk.
      </div>
    </div>
  );
}

function phaseClass(p: NarrativePhase) {
  switch (p) {
    case 'Origin': return 'badge--mute';
    case 'Discovery': return 'badge--cyan';
    case 'Acceleration': return 'badge--green';
    case 'Saturation': return 'badge--orange';
    case 'Decline': return 'badge--red';
  }
}
