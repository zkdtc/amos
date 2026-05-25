# AMOS Alpha Master Index v0.2

这是目前 AMOS Alpha 的总入口目录。

## 当前状态

- 当前阶段：Static Alpha + sample-data-driven prototype
- 已经完成：产品壳、核心引擎、数据结构、评分逻辑、江恩模块、CRDO完整页、通用个股页生成器
- 下一阶段：Real-data-ready Alpha v0.3
- 当前瓶颈：接入真实数据 adapter，并让 Daily Brief 从 computed score packets 自动生成

## Product Shell / 总入口

AMOS 的产品壳、总目录和统一入口。

- ✅ **AMOS Unified App Shell v0.1** — `amos_unified_app_shell_v0_1.html` — 统一产品壳：左侧导航 + 模块工作区
- ✅ **AMOS Alpha Integration Index v0.1** — `amos_alpha_integration_index_v0_1.html` — 第一个 Alpha 工程目录
- ⚠️ **AMOS Alpha Master Index v0.2** — `amos_alpha_master_index_v0_2.html` — 当前总入口

## Core System Engines / 核心系统引擎

宏观、叙事、估值、风险、组合迁移、证据治理等 AMOS 主干。

- ✅ **Macro Regime & Liquidity State Machine** — `amos_macro_regime_liquidity_state_machine_v0_1.html` — 宏观状态机
- ✅ **Narrative Lifecycle & Capital Rotation** — `amos_narrative_lifecycle_capital_rotation_v0_1.html` — 叙事生命周期与资金轮动
- ✅ **Valuation Battle Map** — `amos_valuation_battle_map_v0_1.html` — 七层估值战场
- ✅ **Portfolio Battle Map & Migration** — `amos_portfolio_battle_map_migration_engine_v0_1.html` — 持仓迁移与机会成本
- ✅ **Risk Protection & Behavior Guardrail** — `amos_risk_protection_behavior_guardrail_v0_1.html` — 风险保护与行为护栏
- ✅ **Research Source & Evidence Quality** — `amos_research_source_evidence_quality_engine_v0_1.html` — 证据质量和来源治理
- ✅ **Stock Personality Radar** — `amos_stock_personality_radar_v0_1.html` — 个股股性雷达

## Data / Schema / Scoring / 数据与评分

AMOS 从静态原型转向数据驱动所需的数据结构、样本数据和评分逻辑。

- ✅ **Data Schema v0.1** — `amos_data_schema_v0_1.md` — AMOS 数据骨架
- ✅ **Agent Routing v0.1** — `amos_agent_routing_v0_1.md` — 多 AI 分工路由
- ✅ **Sample Data Fixture v0.1** — `amos_sample_data_fixture_v0_1.html` — NVDA/CRDO/LITE/IREN/HOOD 样本数据
- ✅ **Scoring Logic v0.1** — `amos_scoring_logic_v0_1.html` — 可计算评分规则
- ✅ **Scoring-connected Dashboard v0.2** — `amos_scoring_connected_dashboard_v0_2.html` — 评分接入后的多股票看板
- ✅ **Alpha Data Flow Map v0.1** — `amos_alpha_data_flow_map_v0_1.html` — Raw Input 到 UI 的完整数据流
- ✅ **Real Data Adapter Schema v0.1** — `amos_real_data_adapter_schema_v0_1.html` — 真实数据接入字段接口

## Gann Research / 江恩研究区

用户高优先级工具：九方图、时间窗、价格/时间共振、Gann Research Zone。

- ✅ **Gann Calculator Module v0.1** — `amos_gann_calculator_module_v0_1.html` — 九方图价格位与时间窗口
- ✅ **Gann Cluster & Distance Engine v0.2** — `amos_gann_cluster_distance_engine_v0_2.html` — 最近支撑/压力与多锚点密集区
- ✅ **Gann Time Distance Engine v0.3** — `amos_gann_time_distance_engine_v0_3.html` — 时间窗口距离与时间密集区
- ✅ **Unified Gann Resonance Engine v0.4** — `amos_unified_gann_resonance_engine_v0_4.html` — 价格+时间+确认门统一共振
- ✅ **CRDO Gann Research Zone v0.4** — `crdo_gann_research_zone_v0_4.html` — CRDO 独立江恩研究区

## Stock Intelligence Pages / 个股作战页

CRDO 完整页与通用个股页生成器生成的五个样板标的页面。

- ✅ **CRDO Data-driven Stock Page v0.2** — `crdo_data_driven_stock_page_v0_2.html` — CRDO 数据驱动页
- ✅ **CRDO Scoring-connected Stock Page v0.3** — `crdo_scoring_connected_stock_page_v0_3.html` — CRDO 接入评分页
- ✅ **CRDO Full Stock Intelligence Page v0.4** — `crdo_full_stock_intelligence_page_v0_4.html` — CRDO 完整个股作战页
- ✅ **Generic Stock Page Generator v0.1** — `amos_generic_stock_page_generator_v0_1.html` — 通用个股页生成器
- ✅ **NVDA Generic Stock Page** — `nvda_generic_stock_intelligence_page_v0_1.html` — NVDA 样板页
- ✅ **CRDO Generic Stock Page** — `crdo_generic_stock_intelligence_page_v0_1.html` — CRDO 通用样板页
- ✅ **LITE Generic Stock Page** — `lite_generic_stock_intelligence_page_v0_1.html` — LITE 样板页
- ✅ **IREN Generic Stock Page** — `iren_generic_stock_intelligence_page_v0_1.html` — IREN 样板页
- ✅ **HOOD Generic Stock Page** — `hood_generic_stock_intelligence_page_v0_1.html` — HOOD 样板页

## Dashboards / Daily Brief / 看板与日报

多股票看板、日报模板和执行报告入口。

- ✅ **Multi-stock Dashboard v0.1** — `amos_multistock_dashboard_v0_1.html` — 多股票战场视图
- ✅ **Daily Market Brief Template v0.1** — `amos_daily_market_brief_template_v0_1.html` — 盘前/盘后/周末报告模板
- ✅ **Home Command Center** — `amos_home_command_center_v0_1.html` — 首页战情室
- ✅ **CRDO Original Stock Intelligence Page** — `crdo_stock_intelligence_page_v0_1.html` — 早期 CRDO 个股页

## 下一步 Build Sequence

1. Create AMOS Alpha v0.3 Roadmap
2. Build real-data manual input sheet/schema
3. Generate daily brief from computed score packets
4. Create peer map for CRDO/LITE/COHR/NVDA/AVGO/ANET
5. Add Gann Research Zone into generic page generator
6. Begin real evidence packets for NVDA/CRDO/LITE/HOOD/IREN
