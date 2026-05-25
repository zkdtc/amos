# CRDO Scoring-connected Stock Page v0.3

这是 CRDO 数据驱动个股页的第三版。

## v0.3 新增内容

v0.2 读取 sample fixture。  
v0.3 接入 Scoring Logic，自动计算：

- Macro Regime Score
- Narrative Strength Score
- Narrative Maturity Score
- Risk Stack Score
- Panic Maturity Score
- Valuation Battle Score
- Decision Confidence Score
- Auto Action

## 当前自动评分结果

```json
{
  "macro_regime_score": 65,
  "narrative_strength_score": 79,
  "narrative_maturity_score": 67,
  "risk_stack_score": 73,
  "panic_maturity_score": 36,
  "valuation_battle_score": 54,
  "decision_confidence_score": 54,
  "auto_action": "trim_watch"
}
```

## 当前解释

CRDO 原始 fixture 结论是：

`hold_no_chase_trim_if_exhaustion`

接入评分后，自动动作变成：

`trim_watch`

原因是：

- Risk Stack Score 偏高
- Narrative 强，但 Maturity 也偏高
- Valuation Battle 未达到强进攻区
- Panic Maturity 不支持抄底逻辑
- 数据仍为 sample-only，Decision Confidence 被限制

## 这不是卖空信号

`trim_watch` 的意思是：

- 不追高
- 已有仓位进入高位保护观察
- 等 Gann / RSI / AVWAP / Gamma 接入后确认是否真正 trim
- 如果价格继续强、结构健康，可以继续 hold
- 如果事件兑现 + 量价背离 + Gann压力共振，执行减仓

## 下一步

v0.4 要接入：

- Gann levels
- AVWAP
- RSI / EMA
- Options / Gamma
- Relative Strength vs NVDA / AVGO / LITE / COHR
