// AMOS data schemas (v0.3A Manual Data Alpha)
// Mirrors the canonical spec and engineering handoff doc.

export type DataQuality =
  | 'live_market_data'
  | 'cached_fallback_not_live'
  | 'sample_manual_ready_not_live'
  | 'sample_only_not_live';

export type Freshness = 'Fresh' | 'Stale' | 'Missing';

export type ActionCap =
  | 'Attack'
  | 'Normal'
  | 'Reduced Size'
  | 'Watch'
  | 'Research Only'
  | 'No Attack';

export type GannStatus = 'Gann Live' | 'Gann Pending' | 'Not Tracked';

export type AnchorUsePermission =
  | 'Verified'
  | 'Research Only'
  | 'Do Not Use';

export type EventImportance = 'Critical' | 'High' | 'Medium' | 'Low';

export type EvidenceActionGate =
  | 'Can Influence Action'
  | 'Research Only'
  | 'Blocked';

export interface Ticker {
  symbol: string;
  companyName: string;
  role: 'Core' | 'Swing' | 'Tactical' | 'Runner' | 'Research';
  priority: string;
  tags: string[];
  archetype: string;
  sectorBranch: string;
  classification?: string;
}

export interface ManualInput {
  ticker: string;
  lastPrice: number | null;
  rsi14d: number | null;
  ema8State: 'above' | 'below' | string;
  ema12State: 'above' | 'below' | string;
  trendStructure: string;
  rsVsQqq: string;
  rsVsPeers: string;
  avwapStatus: string;
  riskStack: string;
  actionBias: string;
  freshness: Freshness;
  invalidation: string;
}

export interface GannEngine {
  ticker: string;
  engine_file: string;
  engine_version: string;
  data_quality: DataQuality;
  current_price: number | null;
  current_date: string;
  gann_price_score: number;
  gann_time_score: number;
  unified_gann_resonance_score: number;
  resonance_state: string;
  hard_missing_data: string[];
  status: GannStatus;
  next_required: string[];
}

export interface GannRegistry {
  version: string;
  created: string;
  purpose: string;
  live_tickers: GannEngine[];
  pending_tickers: string[];
  lookup_rule: string;
  guardrails: string[];
  delta_from_v0_3?: string[];
  next?: string[];
}

export interface AnchorVerification {
  ticker: string;
  anchorId: string;
  anchorType: string;
  anchorDate: string;
  anchorPrice: number;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
  verificationScore: number;
  usePermission: AnchorUsePermission;
  tickerSpecificContextChecked: boolean;
}

export interface EvidencePacket {
  packetId: string;
  date: string;
  tickers: string[];
  sourceType: string;
  claim: string;
  claimType: string;
  stance: 'Bullish' | 'Bearish' | 'Mixed';
  qualityScore: number;
  biasRisk: 'Low' | 'Moderate' | 'High';
  counterEvidence: string;
  whatWouldProveItWrong: string;
  actionGate: EvidenceActionGate;
}

export interface MacroEvent {
  eventId: string;
  eventDate: string;
  eventTime: string;
  category: string;
  importance: EventImportance;
  riskMode: string;
  actionCap: ActionCap;
  postEventReviewRequired: boolean;
  title: string;
  sourceUrl: string;
}

export interface DailyBriefRow {
  ticker: string;
  role: string;
  action: string;
  freshness: Freshness;
  gann: GannStatus;
  invalidation: string;
  note: string;
}

export interface DailyBrief {
  version: string;
  date: string;
  phase: string;
  data_quality: DataQuality;
  mode: string;
  guardrails: string[];
  expected_columns: string[];
  rows: DailyBriefRow[];
  actionCounts: Record<string, number>;
  freshnessCounts: Record<string, number>;
  gannCounts: Record<string, number>;
}

export interface MasterIndex {
  version: string;
  phase: string;
  mode: string;
  data_quality: DataQuality;
  deliveries: string[];
  gann_live: string[];
  gann_pending: string[];
  anchor_check: string;
  guardrails: string[];
  links: { label: string; to: string }[];
}
