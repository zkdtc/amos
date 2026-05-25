import { Link } from 'react-router-dom';
import type { AnchorVerification } from '../../data/schemas';
import { resolveAnchorRenderMode } from '../../rules/gannGuards';

export default function AnchorVerificationGate({
  anchors,
  ticker
}: {
  anchors: AnchorVerification[];
  ticker: string;
}) {
  const { mode, reasons } = resolveAnchorRenderMode(anchors);
  const isResearch = mode === 'research_only';
  return (
    <div className={`banner ${isResearch ? 'banner--red' : 'banner--green'}`} data-testid="anchor-gate">
      <strong>{isResearch ? '🔒 Anchor Verification Gate · RESEARCH ONLY' : '✅ Anchor Verification Gate · CONFIRMATION ALLOWED'}</strong>
      <div style={{ marginTop: 6 }}>
        {isResearch
          ? `Gann levels for ${ticker} render as research-only until anchors are verified.`
          : `All anchors for ${ticker} are verified for formal use. Gann remains a confirmation, not a standalone trigger.`}
      </div>
      {reasons.length > 0 && (
        <ul className="bullets" style={{ marginTop: 6 }}>
          {reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 8 }}>
        <Link to="/anchors">Open Anchor Verification Checklist →</Link>
      </div>
    </div>
  );
}
