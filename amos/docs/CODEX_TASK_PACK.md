# AMOS Codex Task Pack v0.1

这是可以逐条交给 Codex 执行的任务卡。每个任务都包含目标、输入、输出、步骤、验收标准和禁止事项。

## Global Constraints

- No live APIs in first pass.
- No brokerage or trading execution.
- No sample data presented as live.
- No Gann-only trade trigger.
- Preserve Anchor Verification gate.
- Preserve Data Freshness action caps.
- Preserve No Attack macro event gating.
- Preserve user-specific risk and behavior guardrails.

## AMOS-CODEX-001 · Create repository skeleton

- **Priority:** P0
- **Goal:** Create a local React/TypeScript project skeleton for AMOS without connecting live APIs.

### Inputs
- `amos_engineering_handoff_spec_v0_1.md`
- `amos_repo_structure_v0_1.md`
- `amos_no_omission_master_checklist_v0_1.md`

### Outputs
- `package.json`
- `src/`
- `docs/`
- `artifacts/`
- `README.md`

### Steps
1. Initialize Next.js or Vite React + TypeScript.
2. Create docs, artifacts, public/sample-data, src/components, src/data, src/rules, src/tests.
3. Copy canonical/handoff/no-omission docs into docs.
4. Add README with current phase: v0.3A Manual Data Alpha.
5. Add sample-data warning to README.

### Acceptance Criteria
- [ ] npm install succeeds.
- [ ] npm run dev starts local app.
- [ ] README links to no-omission checklist.
- [ ] No live APIs are configured.

### Forbidden
- Do not connect brokerage.
- Do not add live market data API.
- Do not delete source artifacts.

## AMOS-CODEX-002 · Implement design tokens and AppShell

- **Priority:** P0
- **Goal:** Preserve the AMOS dark terminal/research cockpit visual language in reusable layout components.

### Inputs
- `amos_alpha_master_index_v0_5.html`
- `amos_canonical_system_integration_spec_v0_1.html`

### Outputs
- `src/components/shell/AppShell.tsx`
- `src/components/shell/Sidebar.tsx`
- `src/components/shell/StatusBar.tsx`
- `src/styles/tokens.css`

### Steps
1. Extract dark background, gold/cyan/green/red palette, card borders and typography rules.
2. Create AppShell with sidebar navigation.
3. Create StatusBar showing phase, mode, Gann Live count, Anchor Check version.
4. Ensure mobile layout works.

### Acceptance Criteria
- [ ] AppShell matches AMOS prototype language.
- [ ] StatusBar shows v0.3A, Manual, Gann Live 5, Anchor Check v0.2.
- [ ] No generic template styling replaces AMOS style.

### Forbidden
- Do not use a plain white dashboard style.
- Do not remove guardrail visibility.

## AMOS-CODEX-003 · Load local manifests and sample data

- **Priority:** P0
- **Goal:** Create local data loaders and TypeScript schemas for AMOS JSON/CSV-driven prototype.

### Inputs
- `amos_gann_live_ticker_registry_v0_4.json`
- `amos_canonical_system_integration_spec_v0_1.json`
- `amos_daily_brief_html_exporter_config_v0_2.json`

### Outputs
- `public/sample-data/gann-registry.json`
- `public/sample-data/daily-brief.json`
- `src/data/loaders.ts`
- `src/data/schemas.ts`

### Steps
1. Copy source JSON files into public/sample-data.
2. Create TypeScript interfaces for Ticker, GannEngine, EvidencePacket, MacroEvent, DailyBrief.
3. Implement local fetch/load functions.
4. Add validation fallback for missing fields.

### Acceptance Criteria
- [ ] Gann registry loads locally.
- [ ] Daily brief fallback rows load locally.
- [ ] Types compile.
- [ ] Missing optional fields do not crash app.

### Forbidden
- Do not fetch remote APIs.
- Do not hardcode live data claims.

## AMOS-CODEX-004 · Implement Guardrail system

- **Priority:** P0
- **Goal:** Encode AMOS guardrails in UI and logic, not just static text.

### Inputs
- `amos_no_omission_master_checklist_v0_1.md`
- `amos_engineering_handoff_spec_v0_1.json`

### Outputs
- `src/components/guardrails/GuardrailBanner.tsx`
- `src/components/guardrails/DataFreshnessBadge.tsx`
- `src/components/guardrails/ActionCapBadge.tsx`
- `src/components/guardrails/AnchorVerificationGate.tsx`
- `src/rules/actionCaps.ts`
- `src/rules/gannGuards.ts`
- `src/rules/eventGuards.ts`
- `src/rules/evidenceGuards.ts`

### Steps
1. Implement sample/manual-ready warning banner.
2. Implement Missing freshness → no aggressive action cap.
3. Implement unverified Gann anchor → research-only rendering.
4. Implement critical event → No Attack default.
5. Implement evidence without counter-evidence → cannot influence action.

### Acceptance Criteria
- [ ] Guardrails are visible on all relevant pages.
- [ ] Rules are reusable pure functions.
- [ ] Rules have tests in later task.
- [ ] Gann cannot emit buy/sell alone.

### Forbidden
- Do not make guardrails dismissible by default.
- Do not hide sample-data warning behind tooltip only.

## AMOS-CODEX-005 · Implement Master Index page

- **Priority:** P0
- **Goal:** Convert AMOS Alpha Master Index v0.5 into the app home page.

### Inputs
- `amos_alpha_master_index_v0_5.html`
- `amos_alpha_master_index_v0_5.json`
- `amos_canonical_system_integration_spec_v0_1.json`

### Outputs
- `src/app/page.tsx or src/pages/index.tsx`
- `src/components/master/MasterIndex.tsx`

### Steps
1. Show phase, deliveries, Gann Live, Pending, Anchor Check, Mode.
2. Render current workflow.
3. Render module sections and links/routes.
4. Include important guardrail.

### Acceptance Criteria
- [ ] Home page clearly says v0.3A Manual Data Alpha.
- [ ] Shows Gann Live 5 / Pending 0.
- [ ] Links to Gann Registry, stock pages, Daily Brief, Events, Evidence.
- [ ] No source section from v0.5 is silently omitted.

### Forbidden
- Do not replace master index with a generic landing page.

## AMOS-CODEX-006 · Implement Gann Registry page

- **Priority:** P0
- **Goal:** Render Gann Live Registry v0.4 from local JSON.

### Inputs
- `amos_gann_live_ticker_registry_v0_4.json`
- `amos_gann_live_ticker_registry_v0_4.html`

### Outputs
- `src/app/gann-registry/page.tsx or src/pages/gann-registry.tsx`
- `src/components/gann/GannRegistry.tsx`
- `src/components/gann/GannMissingGates.tsx`

### Steps
1. Load registry JSON.
2. Render five Gann Live tickers.
3. Show engine file, data quality, price/time/unified scores, resonance state.
4. Show hard missing data.
5. Show guardrail: sample/manual-ready, not live.

### Acceptance Criteria
- [ ] CRDO / NVDA / LITE / IREN / HOOD all render as Gann Live.
- [ ] No pending tickers in sample set.
- [ ] Missing gates are visible.
- [ ] Anchor Verification link is visible.

### Forbidden
- Do not convert Gann Live into trade signal.
- Do not hide hard_missing_data.

## AMOS-CODEX-007 · Implement Stock Intelligence pages

- **Priority:** P0
- **Goal:** Create reusable StockIntelligencePage for five sample tickers.

### Inputs
- `nvda_stock_page_gann_registry_v0_6.html`
- `crdo_stock_page_gann_registry_v0_6.html`
- `lite_stock_page_gann_registry_v0_6.html`
- `iren_stock_page_gann_registry_v0_6.html`
- `hood_stock_page_gann_registry_v0_6.html`
- `amos_canonical_system_integration_spec_v0_1.json`

### Outputs
- `src/app/stocks/[ticker]/page.tsx or src/pages/stocks/[ticker].tsx`
- `src/components/stock/StockHeader.tsx`
- `src/components/stock/DecisionSummary.tsx`
- `src/components/gann/GannResearchZone.tsx`
- `src/components/stock/EvidencePanel.tsx`
- `src/components/stock/RiskProtectionPanel.tsx`

### Steps
1. Implement route for ticker.
2. Render ticker profile, action, confidence/data cap.
3. Render GannResearchZone with anchor gate.
4. Render missing data and hard missing gates.
5. Stub remaining modules but keep headings: valuation, price action, AVWAP, RSI, options/gamma, narrative, evidence, risk, peer map.

### Acceptance Criteria
- [ ] Five sample tickers render.
- [ ] Every page has Gann Zone.
- [ ] Every page has sample-data warning.
- [ ] No required Stock Intelligence module heading is omitted.
- [ ] Missing modules are marked Pending, not silently deleted.

### Forbidden
- Do not simplify stock page to only price chart and summary.
- Do not remove user-specific risk protection modules.

## AMOS-CODEX-008 · Implement Daily Brief page

- **Priority:** P1
- **Goal:** Render daily brief from local JSON/config fallback and preserve action buckets.

### Inputs
- `amos_daily_brief_html_exporter_config_v0_2.json`
- `amos_daily_brief_exported_from_unified_v0_2.html`

### Outputs
- `src/app/daily-brief/page.tsx or src/pages/daily-brief.tsx`
- `src/components/dailyBrief/DailyBrief.tsx`

### Steps
1. Load fallback rows.
2. Compute action counts, freshness counts, Gann counts.
3. Render action buckets and ticker rows.
4. Render guardrails.

### Acceptance Criteria
- [ ] Daily brief matches exported HTML structure.
- [ ] Missing Data count is visible.
- [ ] Gann Live count is visible.
- [ ] Trim Watch and Wait are visually distinct.

### Forbidden
- Do not remove guardrails from brief.

## AMOS-CODEX-009 · Implement Macro Events page

- **Priority:** P1
- **Goal:** Render manual macro/event calendar structure and No Attack logic.

### Inputs
- `amos_macro_event_calendar_manual_input_v0_1.xlsx`
- `amos_macro_event_calendar_manual_input_v0_1.json`

### Outputs
- `src/app/events/page.tsx or src/pages/events.tsx`
- `src/components/events/MacroEventCalendar.tsx`
- `src/rules/eventGuards.ts`

### Steps
1. Create local event sample JSON if needed.
2. Render event category, importance, risk mode, action cap.
3. Highlight Critical events and No Attack caps.
4. Show official source links as metadata.

### Acceptance Criteria
- [ ] Critical events default to No Attack.
- [ ] OPEX/FOMC/CPI/Treasury/BTC/Earnings categories are present.
- [ ] Event guardrail tests pass.

### Forbidden
- Do not treat event calendar as decoration; it must cap action.

## AMOS-CODEX-010 · Implement Evidence Packet page

- **Priority:** P1
- **Goal:** Render evidence claims with quality, bias, counter-evidence and action gate.

### Inputs
- `amos_manual_data_workbook_v0_2_unified.xlsx`
- `amos_csv_import_schema_v0_1.xlsx`
- `amos_canonical_system_integration_spec_v0_1.json`

### Outputs
- `src/app/evidence/page.tsx or src/pages/evidence.tsx`
- `src/components/stock/EvidencePanel.tsx`
- `src/rules/evidenceGuards.ts`

### Steps
1. Create sample evidence JSON from existing workbook/config.
2. Render claim, source type, quality, bias risk, counter-evidence, what would prove it wrong.
3. Implement no-counter-evidence action block.
4. Show source quality notes.

### Acceptance Criteria
- [ ] Evidence without counter-evidence cannot influence action.
- [ ] Source quality and bias risk are visible.
- [ ] Claims are linked to ticker(s).

### Forbidden
- Do not allow YouTube/X claims to bypass evidence gates.

## AMOS-CODEX-011 · Add guardrail test suite

- **Priority:** P0
- **Goal:** Make AMOS safety and no-omission guardrails executable tests.

### Inputs
- `amos_engineering_handoff_spec_v0_1.json`
- `amos_no_omission_master_checklist_v0_1.md`

### Outputs
- `src/tests/actionCaps.test.ts`
- `src/tests/gannGuards.test.ts`
- `src/tests/evidenceGuards.test.ts`
- `src/tests/eventGuards.test.ts`

### Steps
1. Test Missing freshness blocks Attack.
2. Test unverified anchors force Research Only / Watch.
3. Test hard_missing_data caps Gann action.
4. Test Critical event defaults No Attack.
5. Test evidence without counter-evidence cannot influence action.
6. Test sample-data banner required on Gann/Stock pages.

### Acceptance Criteria
- [ ] All guardrail tests pass.
- [ ] Tests fail if Gann emits buy/sell alone.
- [ ] Tests fail if missing-data aggressive action is allowed.

### Forbidden
- Do not mark guardrail tests as optional.

## AMOS-CODEX-012 · Create engineering README and implementation report

- **Priority:** P1
- **Goal:** Document what Codex implemented, what remains, and where source artifacts live.

### Inputs
- `amos_engineering_handoff_spec_v0_1.md`
- `amos_repo_structure_v0_1.md`
- `amos_codex_task_pack_v0_1.md`

### Outputs
- `README.md`
- `docs/IMPLEMENTATION_REPORT.md`

### Steps
1. Write setup commands.
2. List routes and components.
3. List source artifacts copied.
4. List guardrail tests.
5. List known limitations and next tasks.
6. State no live APIs / no brokerage.

### Acceptance Criteria
- [ ] New engineer can run project from README.
- [ ] Implementation report states exactly what is done and not done.
- [ ] No-omission checklist is linked.

### Forbidden
- Do not claim production readiness.
