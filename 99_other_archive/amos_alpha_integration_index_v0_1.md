# AMOS Alpha Integration Index v0.1

这个文件是目前 AMOS Alpha 的总目录。它把已经完成的模块、作用、文件入口和下一步工程路线统一整理。

## 当前真实状态

- 系统主干：已经成型
- 页面原型：已完成首页 + CRDO个股页 + 多个核心模块可视版
- 数据骨架：已完成 Data Schema
- AI分工：已完成 Agent Routing
- 证据治理：已完成 Research Source & Evidence Quality
- 下一瓶颈：从静态原型转成数据驱动组件，并开始真实证据填充

## 已交付模块

### 1. Home Command Center
**状态**：Prototype

AMOS首页战情室：市场状态、时间轴、资金迁移、事件压力、持仓战场。

- HTML: `amos_home_command_center_v0_1.html`

### 2. CRDO Stock Intelligence Page
**状态**：Prototype

个股作战室样板：个股身份、估值战场、Gann、事件、AI Debate、证据链。

- HTML: `crdo_stock_intelligence_page_v0_1.html`

### 3. Data Schema
**状态**：Foundation

AMOS数据骨架：market_state、capital_flow、narrative、valuation、gann、decision等。

- Markdown: `amos_data_schema_v0_1.md`
- JSON: `amos_data_schema_v0_1.json`

### 4. Agent Routing
**状态**：Foundation

多AI分工：Research、Macro、Capital Flow、Narrative、Risk、Debate、Decision等。

- Markdown: `amos_agent_routing_v0_1.md`
- JSON: `amos_agent_routing_v0_1.json`

### 5. Valuation Battle Map
**状态**：Core

七层估值：宏观约束、内在价值、市场共识、Narrative、周期、股性、极端风险。

- HTML: `amos_valuation_battle_map_v0_1.html`
- Markdown: `amos_valuation_battle_map_v0_1.md`
- JSON: `amos_valuation_battle_map_v0_1.json`

### 6. Gann × Event × Gamma Resonance
**状态**：Core

执行层：Gann时间、Gann价格、事件压力、Gamma、Price Action确认。

- HTML: `amos_gann_event_gamma_resonance_v0_1.html`
- Markdown: `amos_gann_event_gamma_resonance_v0_1.md`
- JSON: `amos_gann_event_gamma_resonance_v0_1.json`

### 7. Narrative Lifecycle & Capital Rotation
**状态**：Core

叙事生命周期与资金迁移：Expansion、Rotation、Defensive Shift、Late-cycle Chase。

- HTML: `amos_narrative_lifecycle_capital_rotation_v0_1.html`
- Markdown: `amos_narrative_lifecycle_capital_rotation_v0_1.md`
- JSON: `amos_narrative_lifecycle_capital_rotation_v0_1.json`

### 8. Stock Personality Radar
**状态**：Core

个股股性雷达：核心龙头、二线高Beta、流动性赌场代理、长久期未来故事等。

- HTML: `amos_stock_personality_radar_v0_1.html`
- Markdown: `amos_stock_personality_radar_v0_1.md`
- JSON: `amos_stock_personality_radar_v0_1.json`

### 9. Portfolio Battle Map & Migration
**状态**：Core

持仓迁移系统：旧仓健康、新战线强度、机会成本、执行窗口、迁移动作。

- HTML: `amos_portfolio_battle_map_migration_engine_v0_1.html`
- Markdown: `amos_portfolio_battle_map_migration_engine_v0_1.md`
- JSON: `amos_portfolio_battle_map_migration_engine_v0_1.json`

### 10. Risk Protection & Behavior Guardrail
**状态**：Core

风险保护：高位止盈、恐慌成熟、禁止杠杆、Core/Swing分离、机会成本。

- HTML: `amos_risk_protection_behavior_guardrail_v0_1.html`
- Markdown: `amos_risk_protection_behavior_guardrail_v0_1.md`
- JSON: `amos_risk_protection_behavior_guardrail_v0_1.json`

### 11. Research Source & Evidence Quality
**状态**：Governance

证据系统：YouTube/X/财报/官方数据/研报/书籍的质量评分、偏见识别、周期有效性。

- HTML: `amos_research_source_evidence_quality_engine_v0_1.html`
- Markdown: `amos_research_source_evidence_quality_engine_v0_1.md`
- JSON: `amos_research_source_evidence_quality_engine_v0_1.json`

### 12. Macro Regime & Liquidity State Machine
**状态**：Core

宏观状态机：Goldilocks、流动性扩张/收缩、估值压缩、Risk-off、恐慌成熟等。

- HTML: `amos_macro_regime_liquidity_state_machine_v0_1.html`
- Markdown: `amos_macro_regime_liquidity_state_machine_v0_1.md`
- JSON: `amos_macro_regime_liquidity_state_machine_v0_1.json`

## 下一步工程路线

1. 把所有可视模块统一进一个单页应用壳。
2. 创建可复用组件：card、score、ladder、timeline、evidence panel、decision panel。
3. 为 CRDO / LITE / IREN / HOOD / NVDA 创建样本数据。
4. 实现评分公式：macro regime、narrative lifecycle、risk stack、valuation battle、Gann resonance。
5. 创建每日 AI 报告模板。
6. 开始真实证据填充：宏观状态 + CRDO 样板页。

## 工程原则

- 不再继续无限讨论系统哲学。
- 每新增模块必须进入已有主干。
- 用户资料是线索，不是证明。
- AMOS 必须自己找证据和反证。
- 静态原型之后必须转数据驱动。
- 最终目标是美股二级市场个人投研操作系统。