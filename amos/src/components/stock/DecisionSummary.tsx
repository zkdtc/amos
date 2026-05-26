import type { ActionCap, ManualInput } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

export default function DecisionSummary({
  input,
  cap,
  reasons
}: {
  input?: ManualInput;
  cap: ActionCap;
  reasons: string[];
}) {
  const { t } = useLang();
  return (
    <div className="card">
      <h2>{t.decisionSummaryTitle}</h2>
      <dl className="kvs">
        <dt>{t.actionBiasManual}</dt>
        <dd>{input?.actionBias ?? '—'}</dd>
        <dt>{t.effectiveActionCap}</dt>
        <dd><b>{cap}</b></dd>
        <dt>{t.confidenceCap}</dt>
        <dd>{t.confidenceCapNote}</dd>
        <dt>{t.invalidation}</dt>
        <dd>{input?.invalidation ?? '—'}</dd>
      </dl>
      <h3 style={{ marginTop: 12 }}>{t.whyThisCap}</h3>
      <ul className="bullets">
        {reasons.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}
