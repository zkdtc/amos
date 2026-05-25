/**
 * AMOS Portfolio Battle Map.
 *
 * Per single-jianwei doctrine — portfolio is layered into:
 *   Core      — long-horizon belief positions (NVDA, leaders)
 *   Swing     — medium-horizon RS leaders (CRDO, LITE)
 *   Tactical  — short-horizon mean-reversion / panic-rebound (IREN)
 *   Runner    — let-it-run after large profits (trim discipline)
 *   Research  — observation-only (HOOD)
 *
 * The Battle Map adds a "migration" view: which positions look weakest and
 * should be considered for rotation INTO stronger names. This is the
 * "Capital Migration Engine" the user repeatedly asked for.
 *
 * NOTE: Holdings/P&L are inherently user-authored. This module exposes both
 * a static sample roster AND a function to compute migration suggestions
 * from live ticker data — purely as research, never as trade orders.
 */

import type { LiveTickerData } from './liveAdapter';
import type { Ticker, ActionCap } from './schemas';
import { freshnessCap, strictestCap } from '../rules/actionCaps';

export type PositionRole = 'Core' | 'Swing' | 'Tactical' | 'Runner' | 'Research';

export interface PortfolioPosition {
  symbol: string;
  role: PositionRole;
  shares: number;
  avgCost: number;
  thesisShort: string;
  invalidation: string;
}

// Sample roster — these are user-authored research positions.
// Edit /public/sample-data/portfolio.json to override.
export const SAMPLE_PORTFOLIO: PortfolioPosition[] = [
  { symbol: 'NVDA', role: 'Core',     shares: 400, avgCost: 95.0,  thesisShort: 'AI Compute total addressable market expansion to 2028+', invalidation: 'CapEx digestion 2-quarter sustained' },
  { symbol: 'CRDO', role: 'Swing',    shares: 200, avgCost: 65.0,  thesisShort: 'AI networking AEC dominance in 800G/1.6T cycles',       invalidation: 'Flagship hyperscaler design loss' },
  { symbol: 'LITE', role: 'Swing',    shares: 100, avgCost: 80.0,  thesisShort: 'AI optics / CPO ramp',                                  invalidation: 'Optical pricing collapses or LITE loses share' },
  { symbol: 'IREN', role: 'Tactical', shares: 800, avgCost: 9.0,   thesisShort: 'BTC miner pivoting to AI compute revenue',              invalidation: 'Equity raise without contracted AI revenue' },
  { symbol: 'HOOD', role: 'Research', shares: 0,   avgCost: 0,     thesisShort: 'Observation only — retail/crypto regime barometer',     invalidation: '—' }
];

export interface PositionSummary extends PortfolioPosition {
  currentPrice: number | null;
  unrealizedPctNum: number | null; // % vs avg cost
  marketValue: number | null;
  freshness: string;
  ticker?: Ticker;
  effectiveCap: ActionCap;
  migrationSuggestion: string;
}

export function buildPortfolioSummaries(
  positions: PortfolioPosition[],
  liveMap: Map<string, LiveTickerData>,
  tickerMeta: Ticker[]
): PositionSummary[] {
  return positions.map((p) => {
    const live = liveMap.get(p.symbol);
    const currentPrice = live?.quote.regularMarketPrice ?? null;
    const unrealizedPctNum = currentPrice && p.avgCost
      ? ((currentPrice - p.avgCost) / p.avgCost) * 100
      : null;
    const marketValue = currentPrice ? currentPrice * p.shares : null;
    const freshness = live?.manualInput.freshness ?? 'Missing';
    const cap = strictestCap([freshnessCap(freshness as any)]);

    return {
      ...p,
      currentPrice,
      unrealizedPctNum,
      marketValue,
      freshness,
      ticker: tickerMeta.find((t) => t.symbol === p.symbol),
      effectiveCap: cap,
      migrationSuggestion: suggestMigration(p, unrealizedPctNum, live)
    };
  });
}

/**
 * Heuristic capital-migration suggestion per single-jianwei principles.
 *   - Big winners (>50%) + Saturation symptoms → consider Trim → Runner
 *   - Loss/RS-losers in Swing → consider Rotate to stronger peer
 *   - Tactical names without follow-through → time-stop
 */
function suggestMigration(
  p: PortfolioPosition,
  pct: number | null,
  live?: LiveTickerData
): string {
  if (p.shares === 0) return '—';
  if (pct == null) return 'No live price — defer.';
  const trend = live?.manualInput.trendStructure ?? '';

  if (p.role === 'Swing' && pct < -10 && (trend === 'LH/LL' || trend === 'Lost')) {
    return 'Rotate → consider rotating into a stronger peer.';
  }
  if (p.role === 'Tactical' && pct < -8) {
    return 'Time-stop — tactical conviction must be reset.';
  }
  if ((p.role === 'Core' || p.role === 'Swing') && pct > 100) {
    return 'Trim → reclassify portion as Runner. Protect P/L.';
  }
  if (p.role === 'Core' && pct > 30 && trend === 'HH/HL') {
    return 'Hold core. Let leaders compound.';
  }
  return 'Maintain. Reassess on event.';
}

/**
 * Aggregate portfolio summary (total cost, total MV, weighted return).
 */
export interface PortfolioTotals {
  costBasis: number;
  marketValue: number;
  pnl: number;
  pnlPct: number;
  positions: number;
}

export function computeTotals(rows: PositionSummary[]): PortfolioTotals {
  let cost = 0;
  let mv = 0;
  let pos = 0;
  for (const r of rows) {
    if (r.shares === 0) continue;
    pos++;
    cost += r.avgCost * r.shares;
    mv += r.marketValue ?? r.avgCost * r.shares;
  }
  const pnl = mv - cost;
  return {
    costBasis: cost,
    marketValue: mv,
    pnl,
    pnlPct: cost > 0 ? (pnl / cost) * 100 : 0,
    positions: pos
  };
}
