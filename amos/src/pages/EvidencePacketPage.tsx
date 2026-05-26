import EvidencePanel from '../components/stock/EvidencePanel';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLiveData } from '../data/LiveDataContext';
import { useLang } from '../data/LangContext';

export default function EvidencePacketPage() {
  const { evidence, loading } = useLiveData();
  const { t } = useLang();

  if (loading) return <div className="card">{t.loading} evidence…</div>;

  return (
    <>
      <div className="card">
        <h1>{t.evidencePackets}</h1>
        <span className="badge badge--cyan">{t.userAuthoredResearch}</span>
        <div className="disclaimer" style={{ marginTop: 8 }}>
          {t.evidencePacketsDisclaimer}
        </div>
      </div>
      <GuardrailBanner
        title={t.evidenceGuardrailsTitle}
        items={[...t.evidenceGuardrailItems]}
      />
      <EvidencePanel packets={evidence} />
    </>
  );
}
