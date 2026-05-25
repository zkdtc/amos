/**
 * AMOS v0.3B Live Options — Yahoo Finance options chain.
 *
 * Mirrors shanjianwei-stock/options_gamma.py:
 *   - call wall (max OI strike)
 *   - put wall (max OI strike)
 *   - implied gamma flip (mid of put-wall + call-wall)
 *   - ATM IV
 *   - put/call OI ratio
 *
 * Endpoint: /v7/finance/options/<SYMBOL>?date=<unix>  (we proxy via /api/yahoo/options)
 * If proxy not configured, fail gracefully → return null and surface as
 * "Options data not available — render research-only".
 *
 * GUARDRAIL: Options/Gamma is risk-cap input only. It never triggers trades alone.
 */

export interface YahooOptionContract {
  strike: number;
  openInterest?: number;
  volume?: number;
  impliedVolatility?: number;
  lastPrice?: number;
  bid?: number;
  ask?: number;
}

export interface OptionsExpiration {
  expirationDate: string; // YYYY-MM-DD
  expirationUnix: number;
  calls: YahooOptionContract[];
  puts: YahooOptionContract[];
}

export interface OptionsStructure {
  symbol: string;
  underlyingPrice: number;
  nearestExpiration?: OptionsExpiration;
  expirations: string[]; // available dates
  callWall: number | null; // strike with max call OI
  putWall: number | null; // strike with max put OI
  gammaFlip: number | null; // mid between walls
  atmIV: number | null; // implied vol at the at-the-money strike
  putCallRatio: number | null; // OI(puts) / OI(calls)
  regime: 'Negative Gamma' | 'Near Flip' | 'Positive Gamma' | 'Unknown';
  alerts: string[];
}

interface YahooOptionsResponse {
  optionChain?: {
    result?: Array<{
      underlyingSymbol: string;
      expirationDates?: number[];
      quote?: { regularMarketPrice?: number };
      options?: Array<{
        expirationDate: number;
        calls: YahooOptionContract[];
        puts: YahooOptionContract[];
      }>;
    }>;
    error?: unknown;
  };
}

/**
 * Fetch options chain for a symbol (defaults to nearest expiration).
 * Returns null gracefully on failure — caller renders research-only.
 */
export async function fetchOptionsChain(
  symbol: string,
  expirationUnix?: number
): Promise<OptionsStructure | null> {
  try {
    const dateParam = expirationUnix ? `?date=${expirationUnix}` : '';
    // Note: this requires a /api/yahoo/options proxy. If absent, fetch will fail.
    const url = `/api/yahoo/options/${symbol}${dateParam}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json: YahooOptionsResponse = await res.json();
    const result = json?.optionChain?.result?.[0];
    if (!result || !result.options?.length) return null;

    const chain = result.options[0];
    const underlyingPrice = result.quote?.regularMarketPrice ?? 0;
    if (!underlyingPrice) return null;

    return buildOptionsStructure(symbol, underlyingPrice, chain, result.expirationDates ?? []);
  } catch {
    return null;
  }
}

/**
 * Pure function used both by the live fetcher and by tests.
 */
export function buildOptionsStructure(
  symbol: string,
  underlyingPrice: number,
  chain: { expirationDate: number; calls: YahooOptionContract[]; puts: YahooOptionContract[] },
  expirationUnixList: number[]
): OptionsStructure {
  const expirations = expirationUnixList.map((u) => new Date(u * 1000).toISOString().slice(0, 10));

  // Call wall = strike with max call OI
  const callWall = maxOIStrike(chain.calls);
  // Put wall = strike with max put OI
  const putWall = maxOIStrike(chain.puts);
  // Gamma flip = mid of walls (proxy)
  const gammaFlip = callWall != null && putWall != null ? (callWall + putWall) / 2 : null;

  // ATM IV = average IV of nearest strikes (above + below)
  const atmIV = atmImpliedVol(chain.calls, chain.puts, underlyingPrice);

  // Put/Call OI ratio
  const putOI = totalOI(chain.puts);
  const callOI = totalOI(chain.calls);
  const putCallRatio = callOI > 0 ? putOI / callOI : null;

  // Regime classification — single-jianwei doctrine:
  // price < gamma flip → negative gamma (dealers short gamma, volatility amplified)
  // price > gamma flip → positive gamma (dealers absorb moves)
  let regime: OptionsStructure['regime'] = 'Unknown';
  const alerts: string[] = [];
  if (gammaFlip != null) {
    const dist = Math.abs(underlyingPrice - gammaFlip) / underlyingPrice;
    if (dist < 0.01) {
      regime = 'Near Flip';
      alerts.push('Price near gamma flip — mechanical volatility likely.');
    } else if (underlyingPrice < gammaFlip) {
      regime = 'Negative Gamma';
      alerts.push('Negative gamma regime — dealers amplify moves; expect choppy/sharp swings.');
    } else {
      regime = 'Positive Gamma';
      alerts.push('Positive gamma regime — dealers absorb moves; price tends to pin.');
    }
  }

  if (atmIV != null && atmIV > 1.0) {
    alerts.push(`ATM IV ${(atmIV * 100).toFixed(0)}% — elevated. Premium-selling preferred over premium-buying.`);
  }
  if (putCallRatio != null && putCallRatio > 1.5) {
    alerts.push('Put/Call OI > 1.5 — defensive positioning.');
  }
  if (putCallRatio != null && putCallRatio < 0.4) {
    alerts.push('Put/Call OI < 0.4 — euphoric positioning. Risk of reversal.');
  }

  return {
    symbol,
    underlyingPrice,
    nearestExpiration: {
      expirationDate: new Date(chain.expirationDate * 1000).toISOString().slice(0, 10),
      expirationUnix: chain.expirationDate,
      calls: chain.calls,
      puts: chain.puts
    },
    expirations,
    callWall,
    putWall,
    gammaFlip,
    atmIV,
    putCallRatio,
    regime,
    alerts
  };
}

function maxOIStrike(contracts: YahooOptionContract[]): number | null {
  if (contracts.length === 0) return null;
  let bestStrike: number | null = null;
  let bestOI = -1;
  for (const c of contracts) {
    const oi = c.openInterest ?? 0;
    if (oi > bestOI) {
      bestOI = oi;
      bestStrike = c.strike;
    }
  }
  return bestOI > 0 ? bestStrike : null;
}

function totalOI(contracts: YahooOptionContract[]): number {
  return contracts.reduce((a, c) => a + (c.openInterest ?? 0), 0);
}

function atmImpliedVol(
  calls: YahooOptionContract[],
  puts: YahooOptionContract[],
  spot: number
): number | null {
  const nearest = (contracts: YahooOptionContract[]) => {
    if (contracts.length === 0) return null;
    return [...contracts].sort(
      (a, b) => Math.abs(a.strike - spot) - Math.abs(b.strike - spot)
    )[0];
  };
  const nc = nearest(calls);
  const np = nearest(puts);
  const ivs = [nc?.impliedVolatility, np?.impliedVolatility].filter(
    (v): v is number => typeof v === 'number' && v > 0
  );
  if (ivs.length === 0) return null;
  return ivs.reduce((a, b) => a + b, 0) / ivs.length;
}
