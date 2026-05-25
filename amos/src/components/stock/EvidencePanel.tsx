import type { EvidencePacket } from '../../data/schemas';
import { computeEvidenceActionGate, evidenceMissingCounter } from '../../rules/evidenceGuards';

export default function EvidencePanel({ packets }: { packets: EvidencePacket[] }) {
  if (packets.length === 0) {
    return (
      <div className="card">
        <h3>Evidence Panel</h3>
        <div className="badge badge--mute">No evidence packets for this ticker</div>
      </div>
    );
  }
  return (
    <div className="card">
      <h3>Evidence Panel</h3>
      <table>
        <thead>
          <tr>
            <th>Packet</th>
            <th>Claim</th>
            <th>Source</th>
            <th>Quality</th>
            <th>Bias</th>
            <th>Counter</th>
            <th>Gate</th>
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
      <div className="disclaimer">
        Rule: a claim without counter-evidence cannot influence action. Low quality (&lt;0.40) or
        High bias forces Research-Only gate regardless.
      </div>
    </div>
  );
}
