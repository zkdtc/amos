/**
 * AMOS Multi-Layer Valuation Engine.
 *
 * Per single-jianwei doctrine (MULTI-LAYER VALUATION ENGINE):
 *   - Layer 1: Fundamental Floor Valuation (Duan-Yongping style) → 底线
 *   - Layer 2: Narrative Expansion Valuation → 中枢
 *   - Layer 3: Execution Risk Valuation (现金流/dilution/timing) → 上限
 *
 * Output: four price zones (Conservative / Base / Bull / Euphoria)
 *         + a "discount horizon" narrative (which year the market is trading).
 *
 * The numbers below are research zones. They are NOT price targets.
 */

export interface ValuationZones {
  conservative: number; // Layer 1 floor
  base: number;         // current consensus
  bull: number;         // narrative-expansion price
  euphoria: number;     // late-cycle overshoot
  currentPrice: number;
  zone: 'Below Conservative' | 'Conservative Zone' | 'Below Base' | 'Base→Bull' | 'Bull Zone' | 'Euphoria Zone';
  discountNarrative: string;
  distanceToConservativePct: number;
  distanceToBasePct: number;
  notes: string[];
}

export interface ValuationInputs {
  symbol: string;
  currentPrice: number;
  conservativeFloor: number; // Duan-Yongping floor (manual research input)
  consensusBase: number;     // sell-side / market consensus
  discountHorizon?: string;  // e.g. "2028-2030" → market trading far future
  // Optional execution-risk modifier (-0.20 → -20% bull/euphoria due to dilution/exec risk)
  executionRiskModifier?: number;
}

export function buildValuationZones(inp: ValuationInputs): ValuationZones {
  const mod = 1 + (inp.executionRiskModifier ?? 0);
  const conservative = round2(inp.conservativeFloor);
  const base = round2(inp.consensusBase);
  // Single-jianwei spread rules of thumb:
  // Bull ≈ 1.35× Base; Euphoria ≈ 1.75× Base, both scaled by execution mod.
  const bull = round2(inp.consensusBase * 1.35 * mod);
  const euphoria = round2(inp.consensusBase * 1.75 * mod);

  const price = inp.currentPrice;
  let zone: ValuationZones['zone'];
  if (price < conservative) zone = 'Below Conservative';
  else if (price < (conservative + base) / 2) zone = 'Conservative Zone';
  else if (price < base) zone = 'Below Base';
  else if (price < bull) zone = 'Base→Bull';
  else if (price < euphoria) zone = 'Bull Zone';
  else zone = 'Euphoria Zone';

  const discountNarrative = describeDiscount(inp.discountHorizon);

  const notes: string[] = [];
  notes.push('Layer 1 (Fundamental Floor): Duan-Yongping style — protect against narrative damage.');
  notes.push('Layer 2 (Narrative Expansion): how much future the market is willing to discount.');
  if ((inp.executionRiskModifier ?? 0) < 0) {
    notes.push(`Layer 3 (Execution Risk): -${Math.abs((inp.executionRiskModifier ?? 0) * 100).toFixed(0)}% applied — dilution/timing risk discounts upper zones.`);
  } else if ((inp.executionRiskModifier ?? 0) > 0) {
    notes.push(`Layer 3 (Execution Risk): +${((inp.executionRiskModifier ?? 0) * 100).toFixed(0)}% applied — execution certainty boost.`);
  }

  return {
    conservative,
    base,
    bull,
    euphoria,
    currentPrice: round2(price),
    zone,
    discountNarrative,
    distanceToConservativePct: round1(((price - conservative) / conservative) * 100),
    distanceToBasePct: round1(((price - base) / base) * 100),
    notes
  };
}

function describeDiscount(horizon?: string): string {
  if (!horizon) return 'Discount horizon not set.';
  if (/2028|2029|2030/.test(horizon)) return `Market is discounting ${horizon} — a long, narrative-heavy horizon.`;
  if (/2027/.test(horizon)) return `Market is discounting ${horizon} — medium-horizon narrative.`;
  if (/2026/.test(horizon)) return `Market is discounting ${horizon} — near-term earnings realization.`;
  return horizon;
}

function round2(x: number) { return Math.round(x * 100) / 100; }
function round1(x: number) { return Math.round(x * 10) / 10; }

// Static research inputs per ticker — these are user-research values, NOT live prices.
// Numbers here mirror the per-ticker meta from shanjianwei-stock/watchlist.json + AMOS pack notes.
export const VALUATION_RESEARCH: Record<string, Omit<ValuationInputs, 'currentPrice' | 'symbol'>> = {
  NVDA: { conservativeFloor: 150, consensusBase: 230, discountHorizon: '2028-2030', executionRiskModifier: 0 },
  CRDO: { conservativeFloor: 90,  consensusBase: 190, discountHorizon: '2027-2028', executionRiskModifier: 0 },
  LITE: { conservativeFloor: 680, consensusBase: 1020, discountHorizon: '2026-2027', executionRiskModifier: 0 },
  IREN: { conservativeFloor: 7,   consensusBase: 14, discountHorizon: '2027-2028', executionRiskModifier: -0.15 },
  HOOD: { conservativeFloor: 38,  consensusBase: 75, discountHorizon: '2026-2027', executionRiskModifier: -0.10 }
};

export function valuationFor(symbol: string, currentPrice: number): ValuationZones | null {
  const research = VALUATION_RESEARCH[symbol.toUpperCase()];
  if (!research) return null;
  return buildValuationZones({ symbol, currentPrice, ...research });
}
