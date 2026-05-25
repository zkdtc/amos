# AMOS Alpha Data Flow Map v0.1

这个模块定义 AMOS 从原始数据到最终决策和页面渲染的完整数据流。

核心原则：

> 每一个输出都必须能追溯到数据、证据、评分、AI辩论和失效条件。

---

## 1. Raw Inputs

原始输入包括：

- 市场数据
- 宏观数据
- 财报和公司文件
- 期权数据
- 新闻/事件
- YouTube / X / 博主观点
- 用户观察

输出：`raw_input_objects`

---

## 2. Evidence Quality Layer

把输入拆成：

- fact
- interpretation
- forecast
- opinion

并评分：

- evidence_quality_score
- bias_risk_score
- cycle_validity_score
- framework_value_score

输出：`validated_evidence`

---

## 3. Normalized Data Objects

把证据转换进 AMOS schema：

- market_state
- capital_flow
- narrative
- stock_state
- valuation
- gann
- options_gamma
- risk
- decision

---

## 4. Engine Scoring

计算：

- macro_regime_score
- narrative_strength_score
- narrative_maturity_score
- risk_stack_score
- panic_maturity_score
- gann_resonance_score
- valuation_battle_score
- decision_confidence_score

---

## 5. Agent Debate

多AI分工互相质询：

- bull_case
- bear_case
- risk_objection
- macro_objection
- valuation_objection
- technical_confirmation
- decision_vote

---

## 6. Decision Contract

最终输出：

- action
- position_role
- confidence
- evidence_chain
- counter_evidence
- invalidation_conditions
- next_watch

---

## 7. UI Rendering

渲染：

- Unified App Shell
- Multi-stock Dashboard
- CRDO Stock Page
- Daily Market Brief
- Portfolio Migration View

---

## 8. Review & Learning

复盘：

- prediction
- action
- result

更新：

- stock_personality
- scoring_calibration
- source_quality
- behavior_guardrail

---

## 当前 Alpha 文件流

- `amos_sample_data_fixture_v0_1.json`
- `amos_scoring_logic_v0_1.json`
- `amos_scoring_connected_dashboard_v0_2.html`
- `crdo_scoring_connected_stock_page_v0_3.html`
- `amos_daily_market_brief_template_v0_1.html`
- `amos_unified_app_shell_v0_1.html`

---

## 下一瓶颈

1. 建立真实数据 adapter schema
2. 明确数据来源/API/手动采集来源
3. 实现 Gann level calculator
4. 实现 AVWAP / EMA / RSI adapter
5. 实现 options / gamma adapter
6. 建立 evidence database
7. 让 Daily Brief 读取 computed score packets
