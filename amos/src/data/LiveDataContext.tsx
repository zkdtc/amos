/**
 * LiveDataContext — THE single source of truth for all AMOS data.
 *
 * v0.3B: Everything live. Yahoo Finance for prices/technicals,
 * real macro calendar, live Gann computation from anchors + real price,
 * live macro benchmarks → market regime, live options chain when proxy permits.
 *
 * All guardrails remain enforced. Phase: v0.3B Live-Read Alpha.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { LiveTickerData } from './liveAdapter';
import type {
  AnchorVerification,
  DailyBrief,
  DailyBriefRow,
  EvidencePacket,
  GannEngine,
  GannRegistry,
  MacroEvent,
  MasterIndex,
  Ticker
} from './schemas';
import { fetchLiveTickerData, getMarketClock, type MarketClockState } from './liveAdapter';
import { fetchAllEarningsDates, mergeEventsWithEarnings } from './liveEvents';
import { getAllRealEvents } from './realEvents';
import { buildLiveGannEngine } from './gannLive';
import { loadAnchors, loadEvidence } from './loaders';
import { fetchAllBenchmarks, type BenchmarkSnapshot, relativeStrengthLabel } from './liveBenchmarks';
import { classifyRegime, type RegimeSnapshot } from './marketRegime';

// ─── Ticker definitions (real company info) ─────────────────────────
// Default seed list — used when the user has never customised. Stored to
// localStorage on first edit; later loads come from there.

const DEFAULT_TICKER_DEFS: Ticker[] = [
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', role: 'Core', priority: 'P1', tags: ['AI Infra', 'Compute', 'Leader'], archetype: 'AI Infra Leader', sectorBranch: 'AI Infrastructure / GPU', classification: 'Leader' },
  { symbol: 'CRDO', companyName: 'Credo Technology Group', role: 'Swing', priority: 'P1', tags: ['AI Infra', 'Optical / SerDes'], archetype: 'AI Connectivity Picks-and-Shovels', sectorBranch: 'AI Infrastructure / Optical-SerDes', classification: 'Leader-Follower' },
  { symbol: 'LITE', companyName: 'Lumentum Holdings', role: 'Swing', priority: 'P2', tags: ['Optical', 'CPO', 'AI Infra'], archetype: 'Optical Components', sectorBranch: 'AI Infrastructure / Optical-CPO', classification: 'Follower' },
  { symbol: 'IREN', companyName: 'IREN Limited', role: 'Tactical', priority: 'P2', tags: ['BTC Miner', 'AI Compute', 'Power'], archetype: 'BTC-AI Compute Hybrid', sectorBranch: 'BTC Miner / AI Compute Pivot', classification: 'Meme-Hybrid' },
  { symbol: 'HOOD', companyName: 'Robinhood Markets', role: 'Research', priority: 'P3', tags: ['Fintech', 'BTC', 'Retail'], archetype: 'Retail-Crypto Fintech', sectorBranch: 'Fintech / Crypto-Adjacent', classification: 'Meme-Hybrid' }
];

const TICKERS_STORAGE_KEY = 'amos-tickers-v1';

function loadTickerDefs(): Ticker[] {
  if (typeof localStorage === 'undefined') return DEFAULT_TICKER_DEFS;
  try {
    const raw = localStorage.getItem(TICKERS_STORAGE_KEY);
    if (!raw) return DEFAULT_TICKER_DEFS;
    const arr = JSON.parse(raw) as Ticker[];
    if (!Array.isArray(arr) || arr.length === 0) return DEFAULT_TICKER_DEFS;
    return arr;
  } catch {
    return DEFAULT_TICKER_DEFS;
  }
}

function saveTickerDefs(tickers: Ticker[]): void {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(TICKERS_STORAGE_KEY, JSON.stringify(tickers)); } catch { /* ignore */ }
}

export function resetTickerDefsToDefault(): Ticker[] {
  if (typeof localStorage !== 'undefined') localStorage.removeItem(TICKERS_STORAGE_KEY);
  return DEFAULT_TICKER_DEFS;
}

const REFRESH_MS = 5 * 60 * 1000;
const STAGGER_MS = 1500;

// ─── State shape ────────────────────────────────────────────────────

export interface LiveDataState {
  tickers: Ticker[];
  liveMap: Map<string, LiveTickerData>;
  gannEngines: GannEngine[];
  gannRegistry: GannRegistry;
  dailyBrief: DailyBrief;
  events: MacroEvent[];
  evidence: EvidencePacket[];
  anchors: AnchorVerification[];
  masterIndex: MasterIndex;
  benchmarks: Map<string, BenchmarkSnapshot>;
  regime: RegimeSnapshot | null;
  marketClock: MarketClockState;
  isLive: boolean;
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
}

function buildDefaultState(tickers: Ticker[] = loadTickerDefs()): LiveDataState {
  return {
    tickers,
    liveMap: new Map(),
    gannEngines: [],
    gannRegistry: buildGannRegistry([], []),
    dailyBrief: buildDailyBrief(tickers, new Map(), []),
    events: getAllRealEvents(),
    evidence: [],
    anchors: [],
    masterIndex: buildMasterIndex(tickers.map(t => t.symbol), new Map(), [], []),
    benchmarks: new Map(),
    regime: null,
    marketClock: getMarketClock(),
    isLive: false,
    loading: true,
    error: null,
    lastFetched: null
  };
}

// ─── Builders ───────────────────────────────────────────────────────

function buildDailyBrief(
  tickers: Ticker[],
  liveMap: Map<string, LiveTickerData>,
  gannEngines: GannEngine[]
): DailyBrief {
  const today = new Date().toISOString().slice(0, 10);
  const rows: DailyBriefRow[] = tickers.map((t) => {
    const live = liveMap.get(t.symbol);
    const engine = gannEngines.find((g) => g.ticker === t.symbol);
    const freshness = live?.manualInput.freshness ?? 'Missing';
    const priceStr = live ? `$${live.quote.regularMarketPrice.toFixed(2)}` : '—';
    const action = freshness === 'Fresh'
      ? (live?.manualInput.actionBias ?? 'Wait')
      : 'Wait';

    return {
      ticker: t.symbol,
      role: t.role,
      action,
      freshness,
      gann: engine ? 'Gann Live' : 'Gann Pending',
      invalidation: live?.manualInput.invalidation ?? 'No data',
      note: freshness === 'Missing'
        ? 'No aggressive action'
        : `${priceStr} | EMA8 ${live?.manualInput.ema8State} | RSI ${live?.manualInput.rsi14d ?? '—'}`
    };
  });

  const actionCounts: Record<string, number> = {};
  const freshnessCounts: Record<string, number> = {};
  const gannCounts: Record<string, number> = {};
  rows.forEach((r) => {
    actionCounts[r.action] = (actionCounts[r.action] ?? 0) + 1;
    freshnessCounts[r.freshness] = (freshnessCounts[r.freshness] ?? 0) + 1;
    gannCounts[r.gann] = (gannCounts[r.gann] ?? 0) + 1;
  });

  return {
    version: 'AMOS Daily Brief v0.3B Live',
    date: today,
    phase: liveMap.size > 0 ? 'v0.3B Live-Read Alpha' : 'v0.3A Manual Data Alpha',
    data_quality: liveMap.size > 0 ? 'live_market_data' : 'sample_manual_ready_not_live',
    mode: 'manual_alpha',
    guardrails: [
      'Gann cannot trigger trade alone.',
      'Missing freshness blocks aggressive action.',
      'Critical events default to No Attack unless setup is confirmed.',
      'Anchor Verification v0.2 is required before formal Gann use.',
      'Counter-evidence is required before any claim can influence action.'
    ],
    expected_columns: ['Ticker', 'Role', 'Action', 'Freshness', 'Gann', 'Invalidation', 'Note'],
    rows,
    actionCounts,
    freshnessCounts,
    gannCounts
  };
}

function buildGannRegistry(
  engines: GannEngine[],
  pendingTickers: string[]
): GannRegistry {
  return {
    version: 'Gann Live Registry v0.3B',
    created: new Date().toISOString().slice(0, 10),
    purpose:
      'Live Gann research zones computed from real prices + anchors. Gann is a research instrument — never a standalone trade trigger.',
    live_tickers: engines,
    pending_tickers: pendingTickers,
    lookup_rule: 'Use ticker symbol as key. Each engine is computed from verified anchors + live price.',
    guardrails: [
      'Gann cannot trigger trades alone.',
      'All Gann levels are research-only until anchors are verified.',
      'Square of Nine: P_target = (sqrt(P_base) ± angle/180)². Band ±0.5%.',
      'Scores computed live from Yahoo Finance prices + user-defined anchors.',
      'Anchor Verification gate required before formal Gann use.'
    ]
  };
}

function buildMasterIndex(
  trackedSymbols: string[],
  liveMap: Map<string, LiveTickerData>,
  engines: GannEngine[],
  anchors: AnchorVerification[]
): MasterIndex {
  const isLive = liveMap.size > 0;
  const liveSymbols = engines.map((e) => e.ticker);
  const pendingSymbols = trackedSymbols.filter((t) => !liveSymbols.includes(t));

  const verifiedCount = anchors.filter((a) => a.usePermission === 'Verified').length;
  const pendingCount = anchors.filter((a) => a.usePermission !== 'Verified').length;

  return {
    version: 'AMOS Master Index v0.3B Live',
    phase: isLive ? 'v0.3B Live-Read Alpha' : 'v0.3A Manual Data Alpha',
    mode: 'manual_alpha',
    data_quality: isLive ? 'live_market_data' : 'sample_manual_ready_not_live',
    deliveries: [
      `Live prices: ${liveMap.size} tickers (Yahoo Finance)`,
      `Gann engines: ${engines.length} live-computed`,
      `Anchors: ${verifiedCount} verified, ${pendingCount} pending`,
      `Events: FOMC 2026 (8 meetings) + monthly OPEX + live earnings`,
      'Evidence packets: user-authored research',
      'Macro regime: live VIX/10Y/DXY/BTC/NVDA/SPY/QQQ/SMH',
      'All v0.3A guardrails active'
    ],
    gann_live: liveSymbols,
    gann_pending: pendingSymbols,
    anchor_check: `${verifiedCount} verified / ${pendingCount} pending — verification required before formal Gann use`,
    guardrails: [
      'Gann cannot trigger trades alone.',
      'Anchor Verification gate is required before formal Gann use.',
      'Critical events default to No Attack.',
      'Missing freshness blocks aggressive action.',
      'Counter-evidence is required before any claim can influence action.',
      'Live data is read-only. No brokerage. No trading.'
    ],
    links: [
      { label: 'Command Center', to: '/command-center' },
      { label: 'Gann Registry', to: '/gann-registry' },
      { label: 'Daily Brief', to: '/daily-brief' },
      { label: 'Macro Events', to: '/events' },
      { label: 'Evidence Packets', to: '/evidence' },
      { label: 'Anchor Verification', to: '/anchors' },
      { label: 'Portfolio Battle Map', to: '/portfolio' },
      { label: 'Peer Map', to: '/peer-map' }
    ]
  };
}

// ─── Context ────────────────────────────────────────────────────────

export interface LiveDataActions {
  addTicker: (t: Ticker) => { ok: boolean; reason?: string };
  removeTicker: (symbol: string) => void;
  updateTicker: (symbol: string, patch: Partial<Ticker>) => void;
  resetTickersToDefault: () => void;
  refreshNow: () => void;
}

const LiveDataCtx = createContext<LiveDataState>(buildDefaultState());
const LiveDataActionsCtx = createContext<LiveDataActions>({
  addTicker: () => ({ ok: false, reason: 'No provider' }),
  removeTicker: () => undefined,
  updateTicker: () => undefined,
  resetTickersToDefault: () => undefined,
  refreshNow: () => undefined
});

export function useLiveData() {
  return useContext(LiveDataCtx);
}

export function useLiveDataActions(): LiveDataActions {
  return useContext(LiveDataActionsCtx);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const VALID_SYMBOL = /^[A-Z][A-Z0-9.\-]{0,9}$/;

function normaliseTicker(input: Ticker): Ticker {
  return {
    ...input,
    symbol: input.symbol.trim().toUpperCase(),
    companyName: (input.companyName ?? '').trim() || input.symbol.trim().toUpperCase(),
    tags: Array.isArray(input.tags) ? input.tags.map((s) => s.trim()).filter(Boolean) : []
  };
}

export function LiveDataProvider({ children }: { children: React.ReactNode }) {
  const [tickerDefs, setTickerDefs] = useState<Ticker[]>(() => loadTickerDefs());
  const [state, setState] = useState<LiveDataState>(() => buildDefaultState(tickerDefs));
  // Bump this counter to force the fetch effect to rerun (manual refresh).
  const [fetchTick, setFetchTick] = useState(0);

  // Persist any ticker change
  useEffect(() => { saveTickerDefs(tickerDefs); }, [tickerDefs]);

  // ── Actions ──────────────────────────────────────────────────────
  const actions: LiveDataActions = React.useMemo(() => ({
    addTicker: (t) => {
      const norm = normaliseTicker(t);
      if (!VALID_SYMBOL.test(norm.symbol)) {
        return { ok: false, reason: `Invalid symbol "${norm.symbol}" — must be 1-10 chars, A-Z/0-9/./-` };
      }
      if (tickerDefs.some((x) => x.symbol === norm.symbol)) {
        return { ok: false, reason: `${norm.symbol} is already tracked.` };
      }
      setTickerDefs((prev) => [...prev, norm]);
      return { ok: true };
    },
    removeTicker: (symbol) => {
      const sym = symbol.toUpperCase();
      setTickerDefs((prev) => prev.filter((x) => x.symbol !== sym));
    },
    updateTicker: (symbol, patch) => {
      const sym = symbol.toUpperCase();
      setTickerDefs((prev) =>
        prev.map((x) => (x.symbol === sym ? normaliseTicker({ ...x, ...patch }) : x))
      );
    },
    resetTickersToDefault: () => {
      const def = resetTickerDefsToDefault();
      setTickerDefs(def);
    },
    refreshNow: () => setFetchTick((n) => n + 1)
  }), [tickerDefs]);

  // ── Live data fetch loop — reruns when ticker list or refresh tick changes
  useEffect(() => {
    let cancelled = false;
    const symbols = tickerDefs.map((t) => t.symbol);

    async function doFetch() {
      setState((s) => ({ ...s, tickers: tickerDefs, loading: true }));

      const [anchors, evidence] = await Promise.all([
        loadAnchors().catch(() => [] as AnchorVerification[]),
        loadEvidence().catch(() => [] as EvidencePacket[])
      ]);

      const liveMap = new Map<string, LiveTickerData>();
      for (let i = 0; i < symbols.length; i++) {
        if (cancelled) break;
        if (i > 0) await delay(STAGGER_MS);
        try {
          const data = await fetchLiveTickerData(symbols[i]);
          liveMap.set(symbols[i], data);
        } catch {
          // skip this ticker (may not exist on Yahoo, or rate-limited)
        }
      }

      let benchmarks = new Map<string, BenchmarkSnapshot>();
      try { benchmarks = await fetchAllBenchmarks(); } catch { /* ignore */ }

      const qqq = benchmarks.get('QQQ');
      if (qqq) {
        for (const [, live] of liveMap) {
          live.manualInput.rsVsQqq = relativeStrengthLabel(live.bars, qqq.bars, 20);
        }
      }

      let liveEarnings: MacroEvent[] = [];
      try { liveEarnings = await fetchAllEarningsDates(symbols); } catch { /* ignore */ }
      const allEvents = mergeEventsWithEarnings(getAllRealEvents(), liveEarnings);

      const gannEngines: GannEngine[] = [];
      for (const ticker of symbols) {
        const live = liveMap.get(ticker);
        if (live) {
          gannEngines.push(buildLiveGannEngine(
            ticker, live.quote.regularMarketPrice, anchors, live.manualInput.trendStructure
          ));
        }
      }

      const gannRegistry = buildGannRegistry(gannEngines, symbols.filter((t) => !liveMap.has(t)));
      const dailyBrief = buildDailyBrief(tickerDefs, liveMap, gannEngines);
      const masterIndex = buildMasterIndex(symbols, liveMap, gannEngines, anchors);
      const regime = benchmarks.size > 0 ? classifyRegime(benchmarks) : null;

      if (!cancelled) {
        const clock = getMarketClock();
        setState({
          tickers: tickerDefs,
          liveMap,
          gannEngines,
          gannRegistry,
          dailyBrief,
          events: allEvents,
          evidence,
          anchors,
          masterIndex,
          benchmarks,
          regime,
          marketClock: clock,
          isLive: liveMap.size > 0,
          loading: false,
          error: liveMap.size === 0
            ? 'Live data unavailable (rate limited). Showing real events + user data.'
            : null,
          lastFetched: new Date().toISOString()
        });
      }
    }

    doFetch();
    const timer = setInterval(doFetch, REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  // Re-run when the symbol list changes (add/remove) or manual refresh is requested.
  // We use the JSON serialisation as a stable signal to avoid React thinking the
  // array changed on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tickerDefs.map((t) => t.symbol)), fetchTick]);

  return (
    <LiveDataCtx.Provider value={state}>
      <LiveDataActionsCtx.Provider value={actions}>
        {children}
      </LiveDataActionsCtx.Provider>
    </LiveDataCtx.Provider>
  );
}
