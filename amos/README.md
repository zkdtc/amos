# AMOS — AI Market Operating System

**Phase:** v0.3B Live-Read Alpha
**Build:** Local JSON/CSV-driven prototype with live Yahoo Finance read (Vite + React + TypeScript)
**Data:** live market data (Yahoo Finance) + sample/manual fallback · NO brokerage · READ ONLY

> AMOS is a personal AI Market Operating System for observing, researching and
> trading U.S. equities with **real evidence, cycle rhythm, leadership rotation,
> risk protection and user-specific behavioral guardrails**. It is **not** a
> generic stock dashboard. This v0.3B prototype enforces every guardrail in
> code, not just UI text. **All v0.3A guardrails remain active** — live data
> is read-only and does not relax any safety rule.

## 1. Setup

```bash
cd amos
npm install
npm run dev      # http://localhost:5173 (Vite proxy to Yahoo Finance)
npm test         # vitest, 48 guardrail + live adapter tests
npm run build    # type-check + production build
```

### Live Data

The app uses a **Vite dev proxy** to fetch real-time prices from Yahoo Finance
(`/api/yahoo/chart/*` → `query1.finance.yahoo.com/v8/finance/chart`). This
works in dev mode only. Requests are staggered (1.5s between tickers) to avoid
rate-limiting. If Yahoo is unreachable the app gracefully falls back to
sample/manual JSON data — every guardrail still applies.

The StatusBar shows **`PHASE v0.3B Live-Read Alpha`** and **`DATA LIVE
READ-ONLY (Yahoo Finance)`** when live data is active, or **`DATA sample /
manual-ready (NOT LIVE)`** when using the fallback.

## 2. Routes

| Route | Page | Source |
| --- | --- | --- |
| `/` | Master Index | `public/sample-data/master-index.json` |
| `/gann-registry` | Gann Live Ticker Registry | `public/sample-data/gann-registry.json` |
| `/stocks/:ticker` | Stock Intelligence (NVDA / CRDO / LITE / IREN / HOOD) | composite of all sample data |
| `/daily-brief` | Daily Brief | `public/sample-data/daily-brief.json` |
| `/events` | Macro / Mechanical Event Calendar | `public/sample-data/events.json` |
| `/evidence` | Evidence Packets | `public/sample-data/evidence.json` |
| `/anchors` | Anchor Verification Checklist | `public/sample-data/anchors.json` |

## 3. Non-negotiable Guardrails (enforced in code)

All guardrails live in `src/rules/*.ts` and are covered by tests in `src/tests/`.

1. **Sample / manual-ready data is not live data.** `StatusBar` and per-page
   `GuardrailBanner` always declare data quality. `data_quality` is part of every
   sample JSON.
2. **Missing freshness blocks aggressive action.** `freshnessCap('Missing')` →
   `Research Only`; `blocksAggressive(...)` returns `true`.
3. **Gann cannot trigger trades alone.** `canGannEmitBuySell()` returns `false`
   and `GannResearchZone` always renders as research-only.
4. **Anchor Verification gate is required before formal Gann use.**
   `resolveAnchorRenderMode([...])` returns `research_only` unless every anchor
   has `usePermission === 'Verified'`. `AnchorVerificationGate` enforces it.
5. **Hard missing data caps Gann action.** `gannMissingDataCap(engine)` caps
   to `Research Only` when `hard_missing_data.length > 0`.
6. **Critical events default to No Attack.** `defaultCapForCriticalEvent(event)`
   and `aggregateEventCap(events)` enforce the cap; `MacroEventCalendarPage`
   shows a red No-Attack banner when any Critical event is in the window.
7. **Counter-evidence is required before any claim can influence action.**
   `computeEvidenceActionGate(packet)` returns `Research Only` whenever
   `counterEvidence` is empty, or `qualityScore < 0.40`, or `biasRisk === 'High'`.

The strictest cap from {freshness, Gann, events, anchors} wins via
`strictestCap([...])`.

## 4. Source Artifacts (preserved, never discarded)

Per the engineering handoff rule (`Do not delete source artifacts`), all
originals live under `artifacts/`:

```
artifacts/
  html/   master index, registry HTML, 5 ticker stock pages (v0.6)
  json/   canonical spec, gann registry, daily-brief exporter config
  xlsx/   manual workbook v0.2, anchor verification v0.2, CSV schema, macro calendar
  csv/    event/evidence/gann/price-technical import templates
tools/python/  daily-brief HTML exporter v0.2
docs/   canonical spec, no-omission checklist, handoff spec, task pack, repo structure, codex initial task
```

`docs/AMOS_NO_OMISSION_CHECKLIST.md` is the authoritative reference for any
future refactor.

## 5. Data Models

See `src/data/schemas.ts`. Mirrors the engineering handoff data model section:
`Ticker`, `ManualInput`, `GannEngine`, `GannRegistry`, `AnchorVerification`,
`EvidencePacket`, `MacroEvent`, `DailyBrief`, `MasterIndex`.

## 6. Components

```
src/components/
  shell/           AppShell, StatusBar
  guardrails/      GuardrailBanner, DataFreshnessBadge, ActionCapBadge,
                   AnchorVerificationGate
  gann/            GannResearchZone, GannScorePanel, GannMissingGates
  stock/           StockHeader, DecisionSummary, PriceActionPanel,
                   EvidencePanel, RiskProtectionPanel
  dailyBrief/      DailyBriefView
  events/          MacroEventCalendar
  master/          MasterIndexView
```

## 7. Engineering Boundaries

- **READ ONLY** — no brokerage, no live trading, no write operations.
- Live price data from Yahoo Finance is labeled `live_market_data` per-field;
  sample/manual fields keep `sample_manual_ready_not_live`.
- **Gann is never a standalone trigger** (enforced: `canGannEmitBuySell()` → `false`).
- Every page shows `GuardrailBanner` and the global `StatusBar` data-quality
  badges. When live data is active, the badge turns green; when falling back to
  sample, it's orange.
- All caps are pure functions, not UI text; 48 tests cover them.
- Yahoo rate limiting is handled by staggered requests (1.5s gap) and graceful
  fallback.

## 8. Live Data Architecture

```
Browser → Vite dev proxy (/api/yahoo/chart/NVDA)
       → query1.finance.yahoo.com/v8/finance/chart/NVDA
       ← JSON { chart.result[0].meta + .timestamp + .indicators }

LiveDataContext (React context)
  ├─ fetchLiveTickerData() per ticker (staggered 1.5s)
  │   ├─ quote: extracted from chart meta (price, 52w range, 50dMA, 200dMA)
  │   ├─ bars: daily OHLCV from chart indicators
  │   ├─ EMA 8/12: computeEMA() pure function
  │   ├─ RSI 14: computeRSI() pure function
  │   ├─ Trend: detectTrendStructure() from recent highs/lows
  │   ├─ AVWAP proxy: detectAVWAPStatus() using 50-day MA
  │   └─ Freshness: deriveFreshness() from quote timestamp
  ├─ fetchAllEarningsDates() from quoteSummary (when available)
  └─ mergeEventsWithEarnings() → combined manual + live event calendar

Fallback: if Yahoo returns 429 / network error → sample/manual JSON
```

## 9. Implementation Status

See `docs/AMOS_IMPLEMENTATION_REPORT.md` for what is implemented vs. what
remains for the next pass (Home Command Center charts, valuation/peer maps,
portfolio battle map, CSV importer UI, Anchor Verification editing, RS-vs-QQQ
live relative strength).
