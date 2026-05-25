# AMOS Gann Anchor Verification Checklist v0.1

这个交付把 CRDO / NVDA / LITE 目前所有 sample anchors 变成“待验证锚点”。

## 核心规则

- Sample anchor 不能用于正式交易。
- 锚点错了，所有九方图价格位都会被污染。
- 正式使用必须满足：
  - verified anchor
  - live price
  - AVWAP / RSI / TCG confirmation
  - 明确的失效条件

## 工作簿包含

- Dashboard
- Anchor Checklist
- Verification Rules
- Lists

## Verification Score 逻辑

```text
Verified:
  35% current quality
  + 20 if absolute high/low confirmed
  + 15 if volume/event confirmed
  + 15 if market-wide context checked
  + 15 if no better alternative anchor

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
