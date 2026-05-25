import { describe, expect, it } from 'vitest';
import {
  canGannEmitBuySell,
  gannHasHardMissingData,
  resolveAnchorRenderMode
} from '../rules/gannGuards';
import type { AnchorVerification } from '../data/schemas';

const baseAnchor = (over: Partial<AnchorVerification> = {}): AnchorVerification => ({
  ticker: 'TST',
  anchorId: 'a1',
  anchorType: 'Swing High',
  anchorDate: '2025-01-01',
  anchorPrice: 100,
  verificationStatus: 'Pending',
  verificationScore: 0.5,
  usePermission: 'Research Only',
  tickerSpecificContextChecked: true,
  ...over
});

describe('gannGuards', () => {
  it('Gann never emits buy/sell alone', () => {
    expect(canGannEmitBuySell()).toBe(false);
  });

  it('Unverified anchors render research-only', () => {
    const mode = resolveAnchorRenderMode([baseAnchor({ usePermission: 'Research Only' })]);
    expect(mode.mode).toBe('research_only');
    expect(mode.reasons.length).toBeGreaterThan(0);
  });

  it('Do Not Use anchors render research-only', () => {
    const mode = resolveAnchorRenderMode([baseAnchor({ usePermission: 'Do Not Use' })]);
    expect(mode.mode).toBe('research_only');
    expect(mode.reasons.join(' ')).toMatch(/Do Not Use/);
  });

  it('All Verified anchors permit confirmation', () => {
    const mode = resolveAnchorRenderMode([baseAnchor({ usePermission: 'Verified' })]);
    expect(mode.mode).toBe('confirmation_allowed');
  });

  it('No anchors → research-only', () => {
    const mode = resolveAnchorRenderMode([]);
    expect(mode.mode).toBe('research_only');
  });

  it('Hard missing data detected', () => {
    expect(gannHasHardMissingData({ hard_missing_data: ['x'] })).toBe(true);
    expect(gannHasHardMissingData({ hard_missing_data: [] })).toBe(false);
  });
});
