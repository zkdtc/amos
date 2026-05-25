import type { ActionCap, ManualInput } from '../../data/schemas';

export default function DecisionSummary({
  input,
  cap,
  reasons
}: {
  input?: ManualInput;
  cap: ActionCap;
  reasons: string[];
}) {
  return (
    <div className="card">
      <h2>Decision Summary</h2>
      <dl className="kvs">
        <dt>Action Bias (manual)</dt>
        <dd>{input?.actionBias ?? '—'}</dd>
        <dt>Effective Action Cap</dt>
        <dd><b>{cap}</b></dd>
        <dt>Confidence Cap</dt>
        <dd>Sample/manual-ready only — Confidence cannot exceed Research-grade.</dd>
        <dt>Invalidation</dt>
        <dd>{input?.invalidation ?? '—'}</dd>
      </dl>
      <h3 style={{ marginTop: 12 }}>Why this cap</h3>
      <ul className="bullets">
        {reasons.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}
