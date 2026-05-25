# AMOS Alpha Master Index v0.5

当前阶段：**v0.3A Manual Data Alpha**

## 当前真实状态

- Gann Live: CRDO / NVDA / LITE / IREN / HOOD
- Gann Pending: none
- Anchor Verification: v0.2 covers all five sample tickers
- Warning: all Gann engines are sample/manual-ready; anchors must be verified before formal trading use.

## 当前主工作流

- Open Master Index v0.5
- Open Manual Data Workbook
- Update Manual Inputs
- Check Priority Checklist
- Add Evidence Packet
- Read Generated Daily Brief Snapshot
- Use CRDO Peer Map for migration decisions
- Open Gann Registry v0.4
- Open ticker's Gann Registry Page v0.6
- Open Anchor Verification Checklist v0.2 before any formal use of Gann levels

## v0.3A Manual Data Alpha

手动数据 → 证据包 → 日报 → Peer Map → Gann Registry → 锚点验证

- ✅ **Manual Data Workflow Guide v0.1** — `amos_manual_data_workflow_guide_v0_1.html`
- ✅ **Manual Data Input Sheet v0.1** — `amos_manual_data_input_sheet_v0_1.xlsx`
- ✅ **Daily Brief Generator v0.2** — `amos_daily_brief_generator_from_manual_packet_v0_2.xlsx`
- ✅ **Generated Daily Brief Snapshot v0.1** — `amos_generated_daily_brief_snapshot_v0_1.html`
- ✅ **Priority Ticker Checklist v0.1** — `amos_priority_ticker_checklist_v0_1.xlsx`
- ✅ **Real Evidence Packet Template v0.1** — `amos_real_evidence_packet_template_v0_1.xlsx`

## Gann Live Registry

五个样板标的全部 Gann Live；Registry 自动识别 Gann Zone。

- ✅ **Gann Live Ticker Registry v0.4** — `amos_gann_live_ticker_registry_v0_4.html`
- ✅ **Gann Live Ticker Registry v0.4 JSON** — `amos_gann_live_ticker_registry_v0_4.json`
- ✅ **Gann Live Ticker Registry v0.4 Markdown** — `amos_gann_live_ticker_registry_v0_4.md`

## Gann Engines

每个标的自己的独立江恩模块；全部仍需真实锚点验证。

- ✅ **CRDO Unified Gann Resonance Engine v0.4** — `amos_unified_gann_resonance_engine_v0_4.html`
- ✅ **NVDA Gann Engine v0.1** — `amos_nvda_gann_engine_v0_1.html`
- ✅ **LITE Gann Engine v0.1** — `amos_lite_gann_engine_v0_1.html`
- ✅ **IREN Gann Engine v0.1** — `amos_iren_gann_engine_v0_1.html`
- ✅ **HOOD Gann Engine v0.1** — `amos_hood_gann_engine_v0_1.html`

## Anchor Verification

所有 sample anchors 必须先验证，才能进入正式交易使用。

- ✅ **Gann Anchor Verification Checklist v0.2** — `amos_gann_anchor_verification_checklist_v0_2.xlsx`
- ✅ **Gann Anchor Verification v0.2 HTML** — `amos_gann_anchor_verification_checklist_v0_2.html`
- ✅ **Gann Anchor Verification v0.2 JSON** — `amos_gann_anchor_verification_checklist_v0_2.json`

## Stock Pages with Gann Registry

通用个股页读取 Registry，并在 Gann Zone 内回链 Anchor Verification。

- ✅ **Generic Page Generator with Gann Registry v0.6** — `amos_generic_page_generator_gann_registry_v0_6.html`
- ✅ **NVDA Gann Registry Page v0.6** — `nvda_stock_page_gann_registry_v0_6.html`
- ✅ **CRDO Gann Registry Page v0.6** — `crdo_stock_page_gann_registry_v0_6.html`
- ✅ **LITE Gann Registry Page v0.6** — `lite_stock_page_gann_registry_v0_6.html`
- ✅ **IREN Gann Registry Page v0.6** — `iren_stock_page_gann_registry_v0_6.html`
- ✅ **HOOD Gann Registry Page v0.6** — `hood_stock_page_gann_registry_v0_6.html`

## Peer Maps

用于判断龙头、跟随、掉队、轮动迁移。

- ✅ **CRDO Peer Map v0.1** — `amos_crdo_peer_map_v0_1.xlsx`
- ✅ **CRDO Peer Map HTML Summary** — `amos_crdo_peer_map_v0_1.html`
- ✅ **CRDO Full Page + Peer Map Link v0.5** — `crdo_full_page_peer_map_link_v0_5.html`

## Core System Engines

宏观、叙事、估值、风险、组合迁移、证据治理等 AMOS 主干。

- ✅ **Macro Regime & Liquidity State Machine** — `amos_macro_regime_liquidity_state_machine_v0_1.html`
- ✅ **Narrative Lifecycle & Capital Rotation** — `amos_narrative_lifecycle_capital_rotation_v0_1.html`
- ✅ **Valuation Battle Map** — `amos_valuation_battle_map_v0_1.html`
- ✅ **Portfolio Battle Map & Migration** — `amos_portfolio_battle_map_migration_engine_v0_1.html`
- ✅ **Risk Protection & Behavior Guardrail** — `amos_risk_protection_behavior_guardrail_v0_1.html`
- ✅ **Research Source & Evidence Quality** — `amos_research_source_evidence_quality_engine_v0_1.html`
- ✅ **Stock Personality Radar** — `amos_stock_personality_radar_v0_1.html`

## Data / Schema / Scoring

数据结构、样本数据、评分逻辑和真实数据接入接口。

- ✅ **Data Schema v0.1** — `amos_data_schema_v0_1.md`
- ✅ **Agent Routing v0.1** — `amos_agent_routing_v0_1.md`
- ✅ **Sample Data Fixture v0.1** — `amos_sample_data_fixture_v0_1.html`
- ✅ **Scoring Logic v0.1** — `amos_scoring_logic_v0_1.html`
- ✅ **Scoring-connected Dashboard v0.2** — `amos_scoring_connected_dashboard_v0_2.html`
- ✅ **Alpha Data Flow Map v0.1** — `amos_alpha_data_flow_map_v0_1.html`
- ✅ **Real Data Adapter Schema v0.1** — `amos_real_data_adapter_schema_v0_1.html`

## 下一步 Build Sequence

1. Build Manual Data Workbook v0.2 unified workbook
2. Add Anchor Verification link into old standalone Gann Engine pages
3. Build CSV Import Schema v0.1
4. Build Daily Brief HTML exporter script v0.2
5. Build Real Market Data Source Map v0.1
6. Build Macro Event Calendar Manual Input v0.1