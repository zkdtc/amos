# CRDO Gann Research Zone v0.4

这是 CRDO 个股页的独立 Gann 研究区。

它接入：

- `amos_unified_gann_resonance_engine_v0_4.json`
- `amos_sample_data_fixture_v0_1.json`

## 当前状态

```text
Unified Gann Resonance Score = 32
Resonance State = no_actionable_resonance
Action Gate = WATCH
```

## 解释

CRDO 的 Gann 模块现在可以展示：

- Gann Price Score
- Gann Time Score
- Unified Gann Resonance Score
- 最近 Gann support
- 最近 Gann resistance
- 价格密集区
- 时间密集区
- 缺失确认门
- Gann 操作规则

## 为什么还不能自动行动？

因为以下确认门没有真实接入：

- AVWAP
- RSI
- TCG Price Action
- Gamma / Options
- Volume
- Live Price

所以当前是：

```text
Gann 高分 = 提高观察优先级
不是自动买卖信号
```

## 当前 CRDO 操作含义

- 不追高。
- 已有仓位进入 Gann watch。
- 如果后续接入真实数据后出现：
  - Gann压力/时间
  - RSI超买
  - AVWAP失守
  - 事件兑现
  - 量价背离  
  则进入 Trim 逻辑。

- 如果出现：
  - Gann支撑/时间
  - Panic Maturity
  - RSI底背离
  - AVWAP reclaim
  - TCG HH/HL恢复  
  才进入加仓/试仓逻辑。
