// Evidence packet guardrails.
import type { EvidencePacket, EvidenceActionGate } from '../data/schemas';

// A claim without counter-evidence cannot influence action.
export function computeEvidenceActionGate(packet: EvidencePacket): EvidenceActionGate {
  const hasCounter = !!packet.counterEvidence && packet.counterEvidence.trim().length > 0;
  if (!hasCounter) return 'Research Only';
  if (packet.qualityScore < 0.4 || packet.biasRisk === 'High') return 'Research Only';
  return 'Can Influence Action';
}

export function evidenceMissingCounter(packet: EvidencePacket): boolean {
  return !packet.counterEvidence || packet.counterEvidence.trim().length === 0;
}
