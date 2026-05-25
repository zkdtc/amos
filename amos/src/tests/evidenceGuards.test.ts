import { describe, expect, it } from 'vitest';
import { computeEvidenceActionGate, evidenceMissingCounter } from '../rules/evidenceGuards';
import type { EvidencePacket } from '../data/schemas';

const basePacket = (over: Partial<EvidencePacket> = {}): EvidencePacket => ({
  packetId: 'p1',
  date: '2026-05-24',
  tickers: ['NVDA'],
  sourceType: 'Sell-side Research',
  claim: 'Bullish capex thesis',
  claimType: 'Demand',
  stance: 'Bullish',
  qualityScore: 0.8,
  biasRisk: 'Moderate',
  counterEvidence: 'Risk of 2027 digestion',
  whatWouldProveItWrong: 'Guidance cut >10%',
  actionGate: 'Can Influence Action',
  ...over
});

describe('evidenceGuards', () => {
  it('claim without counter-evidence cannot influence action', () => {
    const p = basePacket({ counterEvidence: '' });
    expect(evidenceMissingCounter(p)).toBe(true);
    expect(computeEvidenceActionGate(p)).toBe('Research Only');
  });

  it('claim with counter-evidence and adequate quality can influence action', () => {
    expect(computeEvidenceActionGate(basePacket())).toBe('Can Influence Action');
  });

  it('high bias forces Research-Only', () => {
    expect(computeEvidenceActionGate(basePacket({ biasRisk: 'High' }))).toBe('Research Only');
  });

  it('low quality forces Research-Only', () => {
    expect(computeEvidenceActionGate(basePacket({ qualityScore: 0.2 }))).toBe('Research Only');
  });
});
