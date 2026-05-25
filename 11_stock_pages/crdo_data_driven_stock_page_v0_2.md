# CRDO Data-driven Stock Page v0.2

这是 CRDO 个股页的第二版。

## 与 v0.1 的区别

v0.1 是静态页面。  
v0.2 开始从 `amos_sample_data_fixture_v0_1.json` 读取数据生成页面内容。

## 当前读取的数据字段

- `profile`
- `state`
- `risk_stack`
- `narrative_exposure`
- `decision`
- `evidence_chain`
- `counter_evidence`
- `invalidation_conditions`
- `gann_resonance_placeholder`

## 当前样本结论

CRDO 当前样本 action 是：

`hold`

但不是追高买入。

主要原因：

- AI Infra / Optical narrative 仍强
- CRDO 属于二线高Beta受益标的
- 但 valuation demanding
- event pressure 和 crowding 偏高
- 需要 Gann / Gamma / Price Action 进一步确认

## 下一步

1. 接入 Scoring Logic v0.1
2. 根据 fixture 自动计算：
   - risk_stack_score
   - narrative_strength_score
   - decision_confidence_score
3. 替换 placeholder：
   - live price
   - RSI
   - EMA
   - AVWAP
   - Gann levels
   - options/gamma
4. 生成 LITE / IREN / HOOD / NVDA 的数据驱动个股页
