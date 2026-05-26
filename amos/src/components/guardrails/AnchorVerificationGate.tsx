import { Link } from 'react-router-dom';
import type { AnchorVerification } from '../../data/schemas';
import { resolveAnchorRenderMode } from '../../rules/gannGuards';
import { useLang } from '../../data/LangContext';

export default function AnchorVerificationGate({
  anchors,
  ticker
}: {
  anchors: AnchorVerification[];
  ticker: string;
}) {
  const { t } = useLang();
  const { mode, reasons } = resolveAnchorRenderMode(anchors);
  const isResearch = mode === 'research_only';
  return (
    <div className={`banner ${isResearch ? 'banner--red' : 'banner--green'}`} data-testid="anchor-gate">
      <strong>{isResearch ? t.anchorGateResearchOnly : t.anchorGateAllowed}</strong>
      <div style={{ marginTop: 6 }}>
        {isResearch ? t.anchorGateResearchDesc(ticker) : t.anchorGateAllowedDesc(ticker)}
      </div>
      {reasons.length > 0 && (
        <ul className="bullets" style={{ marginTop: 6 }}>
          {reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 8 }}>
        <Link to="/anchors">{t.openAnchorChecklist}</Link>
      </div>
    </div>
  );
}
