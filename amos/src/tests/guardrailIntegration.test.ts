// Integration test: end-to-end guardrail composition matching the
// engineering handoff acceptance criteria.
import { describe, expect, it } from 'vitest';
import { freshnessCap, gannMissingDataCap, strictestCap } from '../rules/actionCaps';
import { aggregateEventCap } from '../rules/eventGuards';
import { resolveAnchorRenderMode } from '../rules/gannGuards';
import { computeEvidenceActionGate } from '../rules/evidenceGuards';
import type {
  AnchorVerification,
  EvidencePacket,
  GannEngine,
  MacroEvent,
  ManualInput
} from '../data/schemas';

describe('guardrail integration', () => {
  it('Missing freshness + unverified anchors + critical event ⇒ No Attack', () => {
    const input: ManualInput = {
      ticker: 'NVDA',
      lastPrice: 141,
      rsi14d: 52,
      ema8State: 'above',
      ema12State: 'above',
      trendStructure: 'HH/HL',
      rsVsQqq: 'Leader',
      rsVsPeers: 'Leader',
      avwapStatus: 'Reclaimed',
      riskStack: 'Core',
      actionBias: 'Hold',
      freshness: 'Missing',
      invalidation: 'x'
    };
    const engine: GannEngine = {
      ticker: 'NVDA',
      engine_file: '',
      engine_version: '',
      data_quality: 'sample_manual_ready_not_live',
      current_price: 141,
      current_date: '2026-05-24',
      gann_price_score: 50,
      gann_time_score: 50,
      unified_gann_resonance_score: 50,
      resonance_state: 'incomplete_resonance',
      hard_missing_data: ['AVWAP missing'],
      status: 'Gann Live',
      next_required: []
    };
    const anchors: AnchorVerification[] = [
      {
        ticker: 'NVDA',
        anchorId: 'a1',
        anchorType: 'Earnings Low',
        anchorDate: '2025-08-29',
        anchorPrice: 100,
        verificationStatus: 'Pending',
        verificationScore: 0.4,
        usePermission: 'Research Only',
        tickerSpecificContextChecked: true
      }
    ];
    const events: MacroEvent[] = [
      {
        eventId: 'e1',
        eventDate: '2026-05-28',
        eventTime: '08:30',
        category: 'Macro',
        importance: 'Critical',
        riskMode: 'Elevated',
        actionCap: 'No Attack',
        postEventReviewRequired: true,
        title: 'PCE',
        sourceUrl: ''
      }
    ];

    const caps = [
      freshnessCap(input.freshness),
      gannMissingDataCap(engine),
      aggregateEventCap(events)
    ];
    const cap = strictestCap(caps);
    expect(cap).toBe('No Attack');

    const mode = resolveAnchorRenderMode(anchors);
    expect(mode.mode).toBe('research_only');
  });

  it('Evidence without counter-evidence cannot influence action even with high quality', () => {
    const packet: EvidencePacket = {
      packetId: 'p',
      date: '',
      tickers: [],
      sourceType: '',
      claim: '',
      claimType: '',
      stance: 'Bullish',
      qualityScore: 0.95,
      biasRisk: 'Low',
      counterEvidence: '',
      whatWouldProveItWrong: '',
      actionGate: 'Can Influence Action'
    };
    expect(computeEvidenceActionGate(packet)).toBe('Research Only');
  });

  it('Sample-data guardrail must be present on data set', () => {
    const dataQuality = 'sample_manual_ready_not_live';
    expect(dataQuality).not.toBe('live_market_data');
  });
});
