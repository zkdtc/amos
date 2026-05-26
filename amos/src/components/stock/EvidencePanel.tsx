import type { EvidencePacket } from '../../data/schemas';
import { computeEvidenceActionGate, evidenceMissingCounter } from '../../rules/evidenceGuards';
import { useLang } from '../../data/LangContext';

export default function EvidencePanel({ packets }: { packets: EvidencePacket[] }) {
  const { t } = useLang();
  if (packets.length === 0) {
    return (
      <div className="card">
        <h3>{t.evidencePanelTitle}</h3>
        <div className="badge badge--mute">{t.noEvidencePackets}</div>
      </div>
    );
  }
  return (
    <div className="card">
      <h3>{t.evidencePanelTitle}</h3>
      <table>
        <thead>
          <tr>
            <th>{t.colPacket}</th>
            <th>{t.colClaim}</th>
            <th>{t.colSource}</th>
            <th>{t.colQuality}</th>
            <th>{t.colBias}</th>
            <th>{t.colCounter}</th>
            <th>{t.colGate}</th>
          </tr>
        </thead>
        <tbody>
          {packets.map((p) => {
            const gate = computeEvidenceActionGate(p);
            const missing = evidenceMissingCounter(p);
            return (
              <tr key={p.packetId}>
                <td>{p.packetId}</td>
                <td>{p.claim}</td>
                <td>{p.sourceType}</td>
                <td>{p.qualityScore.toFixed(2)}</td>
                <td>{p.biasRisk}</td>
                <td>
                  {missing ? (
                    <span className="badge badge--red">MISSING</span>
                  ) : (
                    <span className="badge badge--green">PRESENT</span>
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${
                      gate === 'Can Influence Action' ? 'badge--green' : 'badge--orange'
                    }`}
                  >
                    {gate}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="disclaimer">{t.evidenceDisclaimer}</div>
    </div>
  );
}
