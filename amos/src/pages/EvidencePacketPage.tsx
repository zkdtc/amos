import EvidencePanel from '../components/stock/EvidencePanel';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLiveData } from '../data/LiveDataContext';

export default function EvidencePacketPage() {
  const { evidence, loading } = useLiveData();

  if (loading) return <div className="card">Loading evidence…</div>;

  return (
    <>
      <div className="card">
        <h1>Evidence Packets</h1>
        <span className="badge badge--cyan">User-authored research notes</span>
        <div className="disclaimer" style={{ marginTop: 8 }}>
          Evidence packets are inherently user-authored research — they represent
          real analysis, not mock data. Edit <code>public/sample-data/evidence.json</code> to
          add your own research notes.
        </div>
      </div>
      <GuardrailBanner
        title="Evidence Guardrails"
        items={[
          'A claim cannot influence action without counter-evidence.',
          'Low source quality (<0.40) or High bias forces Research-Only gate.',
          '"What would prove it wrong" must be defined per packet.'
        ]}
      />
      <EvidencePanel packets={evidence} />
    </>
  );
}
