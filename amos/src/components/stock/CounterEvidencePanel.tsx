import type { EvidencePacket } from '../../data/schemas';
import { evidenceMissingCounter } from '../../rules/evidenceGuards';

/**
 * Counter-Evidence Panel. Single-jianwei: every claim must come paired
 * with "what would prove it wrong" + counter-evidence — otherwise the
 * thesis cannot influence action.
 */
export default function CounterEvidencePanel({ packets }: { packets: EvidencePacket[] }) {
  if (packets.length === 0) {
    return (
      <div className="card">
        <h3>Counter-Evidence</h3>
        <div className="badge badge--mute">No claims yet → no counter-evidence required.</div>
      </div>
    );
  }
  return (
    <div className="card">
      <h3>Counter-Evidence Checklist</h3>
      <table>
        <thead>
          <tr>
            <th>Claim</th>
            <th>Counter-evidence</th>
            <th>What would prove it wrong</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {packets.map((p) => {
            const missing = evidenceMissingCounter(p);
            return (
              <tr key={p.packetId}>
                <td>{p.claim}</td>
                <td style={{ color: missing ? 'var(--red)' : 'var(--fg-dim)' }}>
                  {missing ? '— MISSING —' : p.counterEvidence}
                </td>
                <td style={{ color: 'var(--fg-mute)' }}>{p.whatWouldProveItWrong}</td>
                <td>
                  <span className={`badge ${missing ? 'badge--red' : 'badge--green'}`}>
                    {missing ? 'Blocked' : 'Allowed'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="disclaimer">
        A claim without counter-evidence is unfit to influence action. This is a hard gate.
      </div>
    </div>
  );
}
