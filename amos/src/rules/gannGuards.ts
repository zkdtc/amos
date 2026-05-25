// Gann guardrails. Gann cannot trigger trades alone.
import type { AnchorVerification, GannEngine } from '../data/schemas';

export interface GannRenderMode {
  mode: 'research_only' | 'confirmation_allowed';
  reasons: string[];
}

// Gann anchor permission gate: if usePermission is "Research Only" or "Do Not Use",
// the Gann levels render research-only.
export function resolveAnchorRenderMode(anchors: AnchorVerification[]): GannRenderMode {
  const reasons: string[] = [];
  if (anchors.length === 0) {
    reasons.push('No anchors provided');
    return { mode: 'research_only', reasons };
  }
  const anyDoNotUse = anchors.some((a) => a.usePermission === 'Do Not Use');
  if (anyDoNotUse) reasons.push('One or more anchors marked Do Not Use');

  const allVerified = anchors.every((a) => a.usePermission === 'Verified');
  if (!allVerified) {
    reasons.push('Not all anchors verified for formal use');
    return { mode: 'research_only', reasons };
  }
  return { mode: 'confirmation_allowed', reasons: [] };
}

// Gann is never a standalone trigger. Always returns false.
export function canGannEmitBuySell(): boolean {
  return false;
}

// True if engine has missing live-context data that should cap action.
export function gannHasHardMissingData(engine: Pick<GannEngine, 'hard_missing_data'>): boolean {
  return (engine.hard_missing_data?.length ?? 0) > 0;
}
