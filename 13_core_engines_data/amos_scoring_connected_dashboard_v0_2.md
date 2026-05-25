# AMOS Scoring-connected Dashboard v0.2

这是多股票看板的第二版：  
它把 `amos_sample_data_fixture_v0_1.json` 和 `amos_scoring_logic_v0_1.json` 接起来。

## 已接通评分

- Macro Regime Score
- Narrative Strength Score
- Narrative Maturity Score
- Risk Stack Score
- Panic Maturity Score
- Valuation Battle Score
- Decision Confidence Score
- Auto Action

## 当前限制

这是 sample-only 数据，不是实时数据。  
所以系统自动应用硬上限：

- Decision Confidence 不超过 60
- Gann / Gamma / AVWAP 未接通
- 评分只是决策辅助，不是真理

## 这一步的意义

之前 fixture 里有手写 action_bias。  
现在 dashboard 可以根据 scoring logic 自动生成：

- trim_watch
- wait
- hold
- build_or_hold
- probe
- attack

## 下一步

1. 把 Scoring Logic 接入 CRDO v0.2 个股页。
2. 建立真实数据 adapter 字段。
3. 开始填充 live price / RSI / EMA / AVWAP / options / earnings revisions。
4. 生成 AMOS Alpha v0.3 的数据流图。
