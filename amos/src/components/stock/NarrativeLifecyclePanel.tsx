import { useMemo } from 'react';
import type { LiveTickerData } from '../../data/liveAdapter';
import { classifyNarrativePhase, type NarrativeAssessment, type NarrativePhase } from '../../data/narrativeLifecycle';
import { useLang } from '../../data/LangContext';

export default function NarrativeLifecyclePanel({ liveData }: { liveData?: LiveTickerData }) {
  const { t } = useLang();
  const result = useMemo<NarrativeAssessment | null>(() => {
    if (!liveData?.bars?.length) return null;
    return classifyNarrativePhase({
      bars: liveData.bars,
      rsi14: liveData.manualInput.rsi14d,
      rsVsBench: liveData.manualInput.rsVsQqq
    });
  }, [liveData]);

  const phaseNames: NarrativePhase[] = ['Origin', 'Discovery', 'Acceleration', 'Saturation', 'Decline'];
  const phaseLabels: Record<NarrativePhase, string> = {
    Origin: t.phaseOrigin,
    Discovery: t.phaseDiscovery,
    Acceleration: t.phaseAcceleration,
    Saturation: t.phaseSaturation,
    Decline: t.phaseDecline,
  };

  if (!result) {
    return (
      <div className="card">
        <h3>{t.narrativeLifecycleTitle}</h3>
        <div className="badge badge--mute">{t.noLiveBarsPhase}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>{t.narrativeLifecycleTitle}</h3>
      <div className={`badge ${phaseClass(result.phase)}`}>
        {t.phaseLabel} {phaseLabels[result.phase]} ({(result.confidence * 100).toFixed(0)}%)
      </div>
      <div className="phase-strip">
        {phaseNames.map((p) => (
          <span key={p} className={`phase-cell ${p === result.phase ? 'phase-cell--active' : ''}`}>
            {phaseLabels[p]}
          </span>
        ))}
      </div>
      <dl className="kvs">
        <dt>{t.capitalType}</dt>
        <dd>{result.capitalType}</dd>
        <dt>{t.newsSensitivity}</dt>
        <dd>{result.newsSensitivity}</dd>
        <dt>{t.expectedBehavior}</dt>
        <dd>{result.expectedBehavior}</dd>
      </dl>
      <h4 style={{ marginTop: 10, color: 'var(--fg-mute)' }}>{t.rationale}</h4>
      <ul className="bullets">
        {result.rationale.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
      <div className="disclaimer">{t.narrativeDisclaimer}</div>
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
