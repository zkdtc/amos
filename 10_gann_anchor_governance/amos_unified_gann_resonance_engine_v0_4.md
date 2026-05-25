# AMOS Unified Gann Resonance Engine v0.4

这是 Gann 模块第四版。  
它把前两步的价格分数和时间分数合并，并预留 AVWAP、RSI、TCG、Gamma/Event、Volume 确认位。

注意：当前仍是 sample-only，不是实时 CRDO 数据。

---

## 输入文件

- `amos_gann_cluster_distance_engine_v0_2.json`
- `amos_gann_time_distance_engine_v0_3.json`

---

## 当前分数

```text
Gann Price Score = 62
Gann Time Score = -7
Unified Gann Resonance Score = 32
Resonance State = no_actionable_resonance
```

---

## 统一共振公式

```text
Unified Gann Resonance Score =
0.28 × Gann Price Score
+ 0.28 × Gann Time Score
+ 0.14 × AVWAP Confirmation
+ 0.10 × RSI Momentum
+ 0.10 × TCG Price Action
+ 0.06 × Gamma/Event
+ 0.04 × Volume Confirmation
```

---

## 为什么现在不能直接行动？

因为这些确认位还没接真实数据：

- AVWAP not connected
- RSI not connected
- Gamma/options not connected
- Live price not connected

所以当前即使 Gann Price / Time 出现信号，也只能进入 watch，不允许自动买卖。

---

## 行动解释

当前状态：

```text
no_actionable_resonance
```

解释：

```text
No Gann edge.
```

---

## 规则

- Gann 高分只是提高观察优先级。
- 不允许 Gann 单独触发交易。
- 买入需要：Gann支撑/时间 + Panic Maturity + RSI/AVWAP/TCG反转。
- 减仓需要：Gann压力/时间 + RSI超买 + 事件兑现 + 量价背离。
- 清仓需要：结构破坏 + AVWAP失守 + 基本面/叙事失效。

---

## 下一步

v0.5 接入 CRDO 个股页，使个股页出现真正的 “Gann Research Zone”。
