# AMOS v0.3B · Implementation Report

Generated: 2026-05-24
Pack source: AMOS All Source Files Pack v0.1
Stack: Vite 5 + React 18 + TypeScript 5 + react-router-dom 6 + Vitest 2
Live data: Yahoo Finance v8/finance/chart via Vite dev proxy

## Acceptance Criteria (Engineering Handoff §10 + v0.3B Live Extension)

| Criterion | Status |
| --- | --- |
| App runs locally with `npm install + npm run dev` | ✅ verified |
| Home page clearly shows phase + data-quality guardrail | ✅ `StatusBar` shows `v0.3B Live-Read Alpha` when live, `v0.3A Manual Data Alpha` when fallback |
| Five sample tickers (NVDA / CRDO / LITE / IREN / HOOD) render stock pages | ✅ `/stocks/:ticker` with live prices, EMA, RSI, trend, AVWAP |
| Each Gann page shows Gann Live, missing gates, anchor verification link | ✅ `GannResearchZone` + `GannMissingGates` + `AnchorVerificationGate` |
| No component claims live data unless explicitly provided | ✅ per-field `data_quality` labeling; live fields → `live_market_data`, manual fields → `sample_manual_ready_not_live` |
| Guardrail tests pass | ✅ 48/48 pass (7 test files: `actionCaps`, `gannGuards`, `evidenceGuards`, `eventGuards`, `guardrailIntegration`, `liveAdapter`, `liveEvents`) |
| No-Omission Checklist present in repo and linked from README | ✅ `docs/AMOS_NO_OMISSION_CHECKLIST.md` |
| All source artifacts preserved | ✅ `artifacts/{html,json,xlsx,csv}` + `tools/python` + `docs/` |
| Live data gracefully falls back when Yahoo is unreachable | ✅ staggered requests (1.5s gap), fallback to sample JSON, StatusBar shows mode |
| All v0.3A guardrails remain active under live data | ✅ no guardrail relaxed; live data is read-only |

## Codex Task Pack Coverage

| Task | Status | Notes |
| --- | --- | --- |
| AMOS-CODEX-001 Create repository skeleton | ✅ | Vite/React/TS, `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore` |
| AMOS-CODEX-002 Design tokens + AppShell | ✅ | `src/styles.css` (dark terminal, gold/cyan/green/red), `AppShell`, `StatusBar` |
| AMOS-CODEX-003 Load local manifests + sample data | ✅ | `public/sample-data/{master-index,gann-registry,daily-brief,tickers,events,evidence,anchors,manual-inputs}.json`, loaders in `src/data/loaders.ts` |
| AMOS-CODEX-004 Guardrail system | ✅ | `GuardrailBanner`, `DataFreshnessBadge`, `ActionCapBadge`, `AnchorVerificationGate`, plus rules in `src/rules/*.ts` |
| AMOS-CODEX-005 Master Index page | ✅ | `MasterIndexView` |
| AMOS-CODEX-006 Gann Registry page | ✅ | `GannRegistryPage` with table + missing gates + per-ticker links |
| AMOS-CODEX-007 Stock Intelligence pages | ✅ | 5 sample tickers, composite cap, all panels wired |
| AMOS-CODEX-008 Daily Brief page | ✅ | `DailyBriefView` matches exporter config columns + fallback rows |
| AMOS-CODEX-009 Macro Events page | ✅ | `MacroEventCalendar` enforces No Attack on Critical events |
| AMOS-CODEX-010 Evidence Packet page | ✅ | counter-evidence + bias + quality gates |
| AMOS-CODEX-011 Guardrail test suite | ✅ | 5 test files, 23 cases, all pass |
| AMOS-CODEX-012 Engineering README + report | ✅ | `README.md` + this document |

## Guardrail Test Matrix

Each spec rule is mapped to at least one test:

| Spec rule | Test |
| --- | --- |
| Missing freshness blocks aggressive action | `actionCaps.test.ts > Missing freshness blocks aggressive action` |
| Gann cannot trigger action alone | `gannGuards.test.ts > Gann never emits buy/sell alone` |
| Unverified anchors render research-only | `gannGuards.test.ts > Unverified anchors render research-only` |
| `Do Not Use` anchors render research-only | `gannGuards.test.ts > Do Not Use anchors render research-only` |
| Critical event defaults to No Attack | `eventGuards.test.ts > Critical events default to No Attack` |
| Evidence without counter-evidence cannot influence action | `evidenceGuards.test.ts > claim without counter-evidence...` |
| `hard_missing_data` non-empty caps Gann to Research Only | `actionCaps.test.ts > Gann hard_missing_data caps to Research Only` |
| Composite worst-case cap | `actionCaps.test.ts > strictestCap` + `guardrailIntegration.test.ts > Missing freshness + unverified anchors + critical event ⇒ No Attack` |

## No-Omission Checklist · Coverage Snapshot

Cross-referenced with `docs/AMOS_NO_OMISSION_CHECKLIST.md`:

- **Product Identity** ✅ (StatusBar + MasterIndex always label v0.3A and sample data)
- **User Risk Profile** ✅ (RiskProtectionPanel encodes leverage/holding/capitulation behavior notes per-ticker)
- **Stock Page** — partially implemented:
  - ✅ Top-level total judgment + action cap + freshness + invalidation
  - ✅ Ticker profile (role, archetype, tags)
  - ✅ Gann Research Zone (Square of Nine doc + scores + missing gates)
  - ✅ Anchor Verification status link
  - ✅ Price Action panel (TCG 8/12 EMA)
  - ✅ Evidence panel with counter-evidence gate
  - ✅ Risk protection panel
  - ⏳ AVWAP / RSI standalone panels (data captured but not yet broken into dedicated cards)
  - ⏳ Options / Gamma panel — schema reserved, UI pending
  - ⏳ Stock Personality Radar — pending real charting layer
  - ⏳ Peer Map, Narrative Lifecycle, Valuation Battle Map — pending dedicated pages
- **Gann** ✅ (formula docs + ±0.5% band + time windows + multi-anchor permitted + anchor gate + no standalone trigger)
- **Execution** ✅ (price action panel notes + invalidation per-ticker)
- **Risk** ✅ (RiskProtectionPanel) — Panic Maturity / Narrative Health / Exit-Hedge engines are still notes, not engines.
- **Workflow** ✅ — every step is navigable from the Master Index.
- **Engineering** ✅ — no live APIs, all guardrails in code + tests.

## Known Gaps / What Remains

Tracked for the next engineering pass (still respecting "整合，不是推翻"):

1. **Home Command Center** — `/command-center` not yet implemented; needs macro/liquidity/mechanical-date visual layer (Gamma Map, sector rotation heatmap, Gann Time Wheel, Event×Cycle Resonance). Requires a charting choice; deferred until real data plumbing.
2. **Portfolio Battle Map** — `/portfolio`; needs real holdings ingest spec.
3. **Manual Workbook Viewer** — `/manual-workbook` and CSV import UI (parsers exist conceptually via the CSV templates in `artifacts/csv/`). XLSX rendering deferred.
4. **Anchor Verification editing** — current page is read-only per the handoff ("Display and edit anchor verification state later; read-only first").
5. **Peer Map** — needs the `12_peer_maps/` JSON ingested into a dedicated component.
6. **Valuation Battle Map, Narrative Lifecycle, Personality Radar** — defined in `13_core_engines_data/` JSON; cards reserved.
7. **Daily Brief Exporter Integration** — the v0.2 Python exporter stays under `tools/python/`; the in-app view already mirrors its column contract.

## File Inventory

```
amos/
  README.md
  package.json, tsconfig.json, vite.config.ts, index.html, .gitignore
  docs/
    AMOS_CANONICAL_SPEC.md
    AMOS_NO_OMISSION_CHECKLIST.md
    AMOS_ENGINEERING_HANDOFF.md
    CODEX_TASK_PACK.md
    AMOS_REPO_STRUCTURE.md
    AMOS_CODEX_INITIAL_TASK.md
    AMOS_IMPLEMENTATION_REPORT.md   ← this file
  artifacts/
    html/{master_index, gann_registry, nvda|crdo|lite|iren|hood ...}.html
    json/{canonical_spec, gann_registry, daily_brief_exporter_config}.json
    xlsx/{manual_workbook_v0_2, anchor_verification_v0_2, csv_import_schema, macro_calendar}.xlsx
    csv/{event, evidence, gann, price_technical}_import_template_v0_1.csv
  tools/python/amos_daily_brief_html_exporter_v0_2.py
  public/sample-data/{master-index, gann-registry, daily-brief, tickers,
                      events, evidence, anchors, manual-inputs}.json
  src/
    main.tsx, App.tsx, styles.css, vite-env.d.ts
    components/
      shell/{AppShell, StatusBar}.tsx
      guardrails/{GuardrailBanner, DataFreshnessBadge, ActionCapBadge, AnchorVerificationGate}.tsx
      gann/{GannResearchZone, GannScorePanel, GannMissingGates}.tsx
      stock/{StockHeader, DecisionSummary, PriceActionPanel, EvidencePanel, RiskProtectionPanel}.tsx
      dailyBrief/DailyBrief.tsx
      events/MacroEventCalendar.tsx
      master/MasterIndex.tsx
    data/{schemas, loaders, useFetch, liveAdapter, liveEvents, LiveDataContext}.ts/.tsx
    rules/{actionCaps, gannGuards, evidenceGuards, eventGuards}.ts
    pages/{MasterIndex, GannRegistry, StockIntelligence, DailyBrief,
           MacroEventCalendar, EvidencePacket, AnchorVerification}Page.tsx
    tests/{actionCaps, gannGuards, evidenceGuards, eventGuards,
           guardrailIntegration, liveAdapter, liveEvents}.test.ts
```

## v0.3B Live Data Integration

### Architecture

```
Browser → Vite dev proxy (/api/yahoo/chart/:symbol)
       → query1.finance.yahoo.com/v8/finance/chart/:symbol
       ← JSON { chart.result[0].meta + .timestamp + .indicators }
```

### What goes live

| Data | Source | Freshness |
| --- | --- | --- |
| Last price | Yahoo chart meta `regularMarketPrice` | deriveFreshness() from `regularMarketTime` |
| EMA 8/12 state | computeEMA() on 6-month daily bars | Live |
| RSI 14D | computeRSI() on 6-month daily bars | Live |
| Trend structure | detectTrendStructure() from recent highs/lows | Live |
| AVWAP status | detectAVWAPStatus() using 50-day MA from meta | Live (proxy) |
| 52-week range | Yahoo chart meta | Live |
| Earnings dates | Yahoo quoteSummary calendarEvents (when available) | Live |
| Gann anchors | Manual sample JSON | Manual |
| Events (FOMC/CPI/PCE) | Manual sample JSON | Manual |
| Evidence packets | Manual sample JSON | Manual |
| RS vs QQQ/Peers | Fallback to manual (live RS needs QQQ bars — future) | Manual |

### Rate Limiting

Yahoo rate limits aggressively (~5 rapid requests trigger 429). The app
mitigates this with:
- Staggered fetching: 1.5s between tickers in `LiveDataContext`
- Graceful fallback: if any ticker fails, it's skipped; remaining tickers load
- Refresh cycle: every 5 minutes, not continuous polling
- StatusBar indicator: shows "⚠ fallback" when rate-limited

### Live-verified

```
CRDO: ✅ $218.41 (via proxy, 2026-05-24)
```

## Test Output

```
Test Files  7 passed (7)
     Tests  48 passed (48)
```

### Test files

| File | Tests | Coverage |
| --- | --- | --- |
| actionCaps.test.ts | 6 | freshnessCap, gannMissingDataCap, eventCap, strictestCap, canAttack, blocksAggressive |
| gannGuards.test.ts | 6 | canGannEmitBuySell, resolveAnchorRenderMode (verified/unverified/DoNotUse/empty), gannHasHardMissingData |
| evidenceGuards.test.ts | 4 | counterEvidence gate, quality gate, bias gate |
| eventGuards.test.ts | 4 | criticalEvent→NoAttack, aggregateEventCap, noAttackInForce |
| guardrailIntegration.test.ts | 3 | composite Missing+unverified+critical→NoAttack, evidence without counter, sample-data label |
| liveAdapter.test.ts | 21 | computeEMA, computeRSI, deriveFreshness, detectTrendStructure, detectAVWAPStatus, NaN safety |
| liveEvents.test.ts | 4 | mergeEventsWithEarnings (merge, dedup, empty, guardrail) |

## Build Output

```
dist/index.html                  0.48 kB
dist/assets/index-*.css          4.22 kB
dist/assets/index-*.js         200.57 kB (63.50 kB gzip)
```
