# AMOS Daily Brief Generator from Manual Packet v0.2

这个交付把 `AMOS Manual Data Input Sheet v0.1` 升级成可生成日报的手动数据工作簿。

## 新增工作表

- `Generated Brief`
- `Brief Config`

## Generated Brief 包含

- Executive Summary
- Action Buckets
- Risk Alerts
- Ticker Brief Lines
- No-Trade Rules

## 工作流

1. 在 `Manual Inputs` 更新每天的字段。
2. 在 `Ticker Checklist` 标记数据是否完成。
3. 在 `Evidence Log` 添加关键证据和反证。
4. 进入 `Generated Brief` 读取自动生成的日报。
5. 没有 invalidation 的动作不执行。

## 当前仍然是 v0.3A Manual Data Alpha

这不是实时数据版。  
但是它已经让 AMOS 可以在“手动填数据”的情况下生成每日盘前/盘后简报。
