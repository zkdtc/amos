import { describe, expect, it } from 'vitest';
import {
  SAMPLE_PORTFOLIO,
  buildPortfolioSummaries,
  computeTotals
} from '../data/portfolio';
import type { LiveTickerData } from '../data/liveAdapter';

function mockLive(symbol: string, price: number, freshness: 'Fresh' | 'Stale' | 'Missing' = 'Fresh', trend = 'HH/HL'): LiveTickerData {
  return {
    manualInput: {
      ticker: symbol, lastPrice: price, rsi14d: 55,
      ema8State: 'above', ema12State: 'above', trendStructure: trend,
      rsVsQqq: 'Leader', rsVsPeers: 'Leader', avwapStatus: 'Reclaimed',
      riskStack: 'Core', actionBias: 'Hold', freshness, invalidation: ''
    },
    quote: {
      symbol, regularMarketPrice: price, regularMarketTime: Date.now() / 1000,
      regularMarketChangePercent: 0, regularMarketVolume: 0
    },
    bars: [], dataQuality: 'live_market_data', fetchedAt: new Date().toISOString()
  };
}

describe('portfolio battle map', () => {
  it('builds summaries with P&L percentages', () => {
    const live = new Map<string, LiveTickerData>();
    live.set('NVDA', mockLive('NVDA', 200));
    const rows = buildPortfolioSummaries(SAMPLE_PORTFOLIO, live, []);
    const nvda = rows.find((r) => r.symbol === 'NVDA')!;
    expect(nvda.currentPrice).toBe(200);
    expect(nvda.unrealizedPctNum).toBeGreaterThan(0);
  });

  it('suggests Trim when winner >100%', () => {
    const live = new Map<string, LiveTickerData>();
    live.set('NVDA', mockLive('NVDA', 200)); // avgCost is 95 → +110%
    const rows = buildPortfolioSummaries(SAMPLE_PORTFOLIO, live, []);
    const nvda = rows.find((r) => r.symbol === 'NVDA')!;
    expect(nvda.migrationSuggestion).toContain('Trim');
  });

  it('suggests Rotate when Swing loser + LH/LL', () => {
    const live = new Map<string, LiveTickerData>();
    live.set('CRDO', mockLive('CRDO', 50, 'Fresh', 'LH/LL')); // avgCost 65 → -23%
    const rows = buildPortfolioSummaries(SAMPLE_PORTFOLIO, live, []);
    const c = rows.find((r) => r.symbol === 'CRDO')!;
    expect(c.migrationSuggestion).toContain('Rotate');
  });

  it('totals sum cost basis and market value', () => {
    const live = new Map<string, LiveTickerData>();
    live.set('NVDA', mockLive('NVDA', 100));
    const rows = buildPortfolioSummaries(SAMPLE_PORTFOLIO, live, []);
    const t = computeTotals(rows);
    expect(t.positions).toBeGreaterThan(0);
    expect(t.costBasis).toBeGreaterThan(0);
  });
});
