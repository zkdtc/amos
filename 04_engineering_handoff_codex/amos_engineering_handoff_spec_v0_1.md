# AMOS Engineering Handoff Spec v0.1

这是给 Codex / 工程化阶段的正式交接文件。目标是把 AMOS 当前 v0.3A Manual Data Alpha 原型，转成一个本地可运行的 JSON/CSV-driven Web App。

## 1. 项目目标

- **Project:** AMOS / AI Market Operating System
- **Phase:** v0.3A Manual Data Alpha
- **Engineering Goal:** Build a local JSON/CSV-driven prototype app first, preserving all guardrails and no-omission requirements. Do not connect live APIs or brokerage/trading.

## 2. 不可协商原则

- 整合，不是推翻
- Do not simplify AMOS into a generic stock dashboard.
- Do not remove Gann Research Zone depth.
- Do not remove Anchor Verification gate.
- Do not allow Gann-only trade triggers.
- Do not present sample/manual-ready data as live market data.
- Do not drop user-specific risk protection and behavior guardrails.

## 3. 推荐技术栈

- **frontend:** Next.js or Vite React + TypeScript
- **styling:** CSS modules / Tailwind / design tokens; dark terminal style preserved
- **data_layer:** Local JSON + CSV files first
- **charts:** Lightweight local charts later; no need for real-time charting in first pass
- **tests:** Vitest/Jest for guards and data transforms
- **export_scripts:** Python scripts for Excel/CSV/HTML exports remain in tools/

## 4. Source Artifacts

- **canonical_spec:** `amos_canonical_system_integration_spec_v0_1.md/json/html`
- **no_omission_checklist:** `amos_no_omission_master_checklist_v0_1.md`
- **master_index:** `amos_alpha_master_index_v0_5.html`
- **manual_workbook:** `amos_manual_data_workbook_v0_2_unified.xlsx`
- **gann_registry:** `amos_gann_live_ticker_registry_v0_4.html/json`
- **anchor_verification:** `amos_gann_anchor_verification_checklist_v0_2.xlsx`
- **csv_import_schema:** `amos_csv_import_schema_v0_1.xlsx`
- **data_source_map:** `amos_real_market_data_source_map_v0_1.xlsx`
- **macro_calendar:** `amos_macro_event_calendar_manual_input_v0_1.xlsx`
- **daily_brief_exporter:** `amos_daily_brief_html_exporter_v0_2.py`
- **stock_pages:**
  - `nvda_stock_page_gann_registry_v0_6.html`
  - `crdo_stock_page_gann_registry_v0_6.html`
  - `lite_stock_page_gann_registry_v0_6.html`
  - `iren_stock_page_gann_registry_v0_6.html`
  - `hood_stock_page_gann_registry_v0_6.html`

## 5. App Routes

- `/` → **MasterIndexPage** — Entry point linking all modules and showing current phase/status.
- `/command-center` → **HomeCommandCenter** — Macro/liquidity/portfolio/event overview.
- `/stocks/:ticker` → **StockIntelligencePage** — Full ticker battle room with Gann, price action, evidence, risk and strategy.
- `/gann-registry` → **GannRegistryPage** — Show Gann Live engines, scores, missing gates, registry metadata.
- `/anchors` → **AnchorVerificationPage** — Display and edit anchor verification state later; read-only first.
- `/manual-workbook` → **ManualWorkbookViewer** — Render Manual Inputs, Generated Brief, Priority, Evidence as app views.
- `/daily-brief` → **DailyBriefPage** — Render exported daily brief from local JSON/CSV.
- `/evidence` → **EvidencePacketPage** — Claims, source quality, counter-evidence and action gate.
- `/events` → **MacroEventCalendarPage** — Event calendar with No Attack gates.
- `/portfolio` → **PortfolioBattleMapPage** — Position roles, migration, opportunity cost and risk alerts.

## 6. Core Components

- AppShell
- MasterIndex
- StatusBar
- GuardrailBanner
- DataFreshnessBadge
- ActionCapBadge
- TickerCard
- StockHeader
- DecisionSummary
- GannResearchZone
- GannScorePanel
- AnchorVerificationGate
- PriceActionPanel
- AVWAPPanel
- RSIMomentumPanel
- OptionsGammaPanel
- NarrativeLifecyclePanel
- ValuationBattleMap
- EvidencePanel
- CounterEvidencePanel
- RiskProtectionPanel
- PortfolioRolePanel
- PeerMapPanel
- MacroEventCalendar
- DailyBrief
- ManualInputTable
- CSVImportPreview

## 7. Data Models

### Ticker
```text
symbol, companyName, role, priority, tags, archetype, sectorBranch
```
### ManualInput
```text
ticker, lastPrice, rsi14d, ema8State, ema12State, trendStructure, rsVsQqq, rsVsPeers, avwapStatus, riskStack, actionBias, freshness, invalidation
```
### GannEngine
```text
ticker, currentPrice, dataQuality, anchors, nearestSupport, nearestResistance, nearestPriceCluster, nearestTimeCluster, scores, hardMissingData
```
### AnchorVerification
```text
ticker, anchorId, anchorType, anchorDate, anchorPrice, verificationStatus, verificationScore, usePermission, tickerSpecificContextChecked
```
### EvidencePacket
```text
packetId, date, tickers, sourceType, claim, claimType, stance, qualityScore, biasRisk, counterEvidence, whatWouldProveItWrong, actionGate
```
### MacroEvent
```text
eventId, eventDate, eventTime, category, importance, riskMode, actionCap, postEventReviewRequired, sourceUrl
```
### DailyBrief
```text
date, rows, actionCounts, freshnessCounts, gannCounts, guardrails
```

## 8. Guardrail Tests Required

- [ ] If dataFreshness == Missing, aggressive action is blocked.
- [ ] If Gann anchor usePermission is Research Only or Do Not Use, Gann levels render as research-only.
- [ ] If hardMissingData is non-empty, Gann action cap is Watch/Research Only.
- [ ] If event importance is Critical, default action cap is No Attack.
- [ ] If a claim has no counterEvidence, EvidencePanel action gate cannot be Can Influence Action.
- [ ] If page uses sample/manual-ready data, GuardrailBanner must be visible.
- [ ] GannResearchZone never emits buy/sell alone.

## 9. First Codex Tasks

1. Create repo skeleton with Next.js or Vite React + TypeScript.
2. Copy canonical JSON manifests into /data/manifests.
3. Create static routes and AppShell.
4. Implement MasterIndexPage from amos_alpha_master_index_v0_5.
5. Implement GannRegistryPage using amos_gann_live_ticker_registry_v0_4.json.
6. Implement StockIntelligencePage for five sample tickers using local JSON and generated HTML reference.
7. Implement GuardrailBanner, AnchorVerificationGate and DataFreshnessBadge.
8. Implement DailyBriefPage from exporter output/fallback JSON.
9. Add tests for guardrails.
10. Do not connect live APIs yet.

## 10. Acceptance Criteria

- [ ] App runs locally with npm install + npm run dev.
- [ ] Home page clearly shows v0.3A Manual Data Alpha and sample-data guardrail.
- [ ] Five sample tickers render stock pages.
- [ ] Each Gann page shows Gann Live, missing gates and anchor verification link.
- [ ] No component claims live data unless explicitly provided.
- [ ] Guardrail tests pass.
- [ ] No-Omission Checklist is present in repo and linked from README.
- [ ] All source artifacts are preserved in /artifacts or /docs, not discarded.

## 11. 工程边界

第一版只做本地 JSON/CSV 驱动，不接券商、不下单、不做实时交易、不隐藏 sample/manual-ready 风险。