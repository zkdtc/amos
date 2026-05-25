# AMOS Daily Market Brief Template v0.1

这是 AMOS 每日盘前 / 盘后 / 周末复盘报告模板。

目标：

> 把 Market Regime、Capital Flow、Narrative、Portfolio、Risk、Evidence、Action Plan 组织成你每天真正能用的报告。

---

## 三种模式

### Pre-market Brief
盘前使用。  
目标：定义市场状态、事件压力、观察位和当天行动计划。

包含：

- Market Regime
- Event Pressure
- Capital Flow
- Portfolio Risk
- Watchlist Opportunities
- Action Plan
- Invalidation Conditions

### Post-market Brief
盘后使用。  
目标：复盘当天发生了什么，哪些判断被验证/推翻，更新个股股性和风险状态。

包含：

- What Changed Today
- Market Regime Update
- Leadership / Rotation
- Position Review
- Evidence Updates
- Prediction vs Result
- Tomorrow Watch

### Weekend Review
周末使用。  
目标：做更深的周期、持仓迁移、Gann时间窗、财报/宏观日历和行为复盘。

包含：

- Weekly Regime
- Narrative Lifecycle
- Portfolio Migration
- Gann Windows Next 2 Weeks
- Earnings / Macro Calendar
- Behavior Review
- Next Week Battle Plan

---

## 每日报告结构

### 1. Metadata
报告日期、模式、数据新鲜度、置信度上限。

### 2. Market Regime
必须包含：

- regime_label
- macro_regime_score
- beta_ceiling
- risk_bias
- supporting_evidence
- counter_evidence
- what_would_change_my_mind

### 3. Event Pressure
不是财经日历，而是事件压力：

- today
- this_week
- highest_pressure_event
- affected_positions
- required_watch

### 4. Capital Flow
资金正在去哪：

- primary_theater
- rotation_type
- strongest_narratives
- weakening_narratives
- leader_chain
- tail_chase_warning

### 5. Portfolio Dashboard
每个仓位必须有：

- ticker
- role
- state
- action_bias
- risk_level
- why
- invalidation

### 6. Watchlist
分成：

- build_candidates
- panic_maturity_candidates
- trim_candidates
- research_only

### 7. Action Plan
明确动作：

- attack
- build
- hold
- trim
- exit
- wait
- no_trade_rules

### 8. Evidence Panel
当天新增证据、反证、待验证来源、数据过期警告。

### 9. Behavior Guardrails
当天最重要的行为风险、禁止动作、纪律提醒。

---

## 样板结论

基于当前 sample fixture，样板市场状态是：

`Liquidity expansion with rising crowding`

意思是：

- AI Infra 仍是主战场
- Space / Quantum / Power 更像主周期扩张，不是确认资金离开AI
- CRDO/LITE 等二线高Beta拥挤度上升
- HOOD/IREN 可能有机会，但还需要等待 reset maturity
- 当天禁止：追尾部、加杠杆、因为headline dip满仓
