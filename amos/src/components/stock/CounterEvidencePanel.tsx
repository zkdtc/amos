import type { EvidencePacket } from '../../data/schemas';
import { evidenceMissingCounter } from '../../rules/evidenceGuards';
import { useLang } from '../../data/LangContext';

export default function CounterEvidencePanel({ packets }: { packets: EvidencePacket[] }) {
  const { t } = useLang();
  if (packets.length === 0) {
    return (
      <div className="card">
        <h3>{t.counterEvidenceTitle}</h3>
        <div className="badge badge--mute">{t.noCounterEvidence}</div>
      </div>
    );
  }
  return (
    <div className="card">
      <h3>{t.counterEvidenceChecklist}</h3>
      <table>
        <thead>
          <tr>
            <th>{t.colClaim}</th>
            <th>{t.colCounterEvidence}</th>
            <th>{t.colWhatWouldProveWrong}</th>
            <th>{t.status}</th>
          </tr>
        </thead>
        <tbody>
          {packets.map((p) => {
            const missing = evidenceMissingCounter(p);
            return (
              <tr key={p.packetId}>
                <td>{p.claim}</td>
                <td style={{ color: missing ? 'var(--red)' : 'var(--fg-dim)' }}>
                  {missing ? t.missingCounter : p.counterEvidence}
                </td>
                <td style={{ color: 'var(--fg-mute)' }}>{p.whatWouldProveItWrong}</td>
                <td>
                  <span className={`badge ${missing ? 'badge--red' : 'badge--green'}`}>
                    {missing ? t.statusBlocked : t.statusAllowed}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="disclaimer">{t.counterEvidenceDisclaimer}</div>
    </div>
  );
}
