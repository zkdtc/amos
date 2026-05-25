# AMOS Gann Anchor Verification Checklist v0.2

这个交付把 CRDO / NVDA / LITE / IREN / HOOD 所有 sample anchors 纳入“待验证锚点”。

## 本版变化

- 加入 IREN sample anchors。
- 加入 HOOD sample anchors。
- 新增 Ticker-Specific Rules。
- 新增 `Ticker-Specific Context Checked?` 字段。
- 所有五个 Gann Live 标的都有锚点验证入口。

## 当前范围

- Tickers: CRDO / NVDA / LITE / IREN / HOOD
- Total anchors: 12

## 核心规则

- Sample anchor 不能用于正式交易。
- 锚点错了，所有九方图价格位都会被污染。
- 正式使用必须满足：
  - verified anchor
  - live price
  - AVWAP / RSI / TCG confirmation
  - ticker-specific context confirmation
  - 明确的失效条件

## Verification Score 逻辑

```text
Verified:
  30% current quality
  + 18 if absolute high/low confirmed
  + 14 if volume/event confirmed
  + 14 if market-wide context checked
  + 12 if no better alternative anchor
  + 12 if ticker-specific context checked

Candidate:
  capped at 60

Unverified:
  capped at 40

Rejected:
  0
```

## Use Permission

- >=80: Can Use
- >=65: Can Use With Confirmation
- >=50: Watch Only
- >=30: Research Only
- <30: Do Not Use
