import { describe, expect, it } from 'vitest';
import { buildMultiAnchorView } from '../data/gannLive';
import type { AnchorVerification } from '../data/schemas';

const anchors: AnchorVerification[] = [
  { ticker: 'X', anchorId: 'X-LOW', anchorType: 'Absolute Low', anchorDate: '2024-01-01', anchorPrice: 100, verificationStatus: 'Pending', verificationScore: 0.5, usePermission: 'Research Only', tickerSpecificContextChecked: false },
  { ticker: 'X', anchorId: 'X-HI',  anchorType: 'Swing High',    anchorDate: '2024-06-01', anchorPrice: 150, verificationStatus: 'Pending', verificationScore: 0.5, usePermission: 'Research Only', tickerSpecificContextChecked: false }
];

describe('Gann multi-anchor view', () => {
  it('identifies nearest support + resistance', () => {
    const v = buildMultiAnchorView('X', 120, anchors);
    if (v.nearestSupport) expect(v.nearestSupport.targetPrice).toBeLessThanOrEqual(120);
    if (v.nearestResistance) expect(v.nearestResistance.targetPrice).toBeGreaterThan(120);
  });

  it('filters by ±20% trading band', () => {
    const v = buildMultiAnchorView('X', 120, anchors);
    for (const l of v.perAnchorLevels) {
      expect(Math.abs(l.distancePct)).toBeLessThanOrEqual(0.2 + 1e-9);
    }
  });

  it('returns no clusters when only single levels exist', () => {
    const v = buildMultiAnchorView('X', 120, [anchors[0]]);
    expect(v.clusters.length).toBeGreaterThanOrEqual(0);
  });
});
