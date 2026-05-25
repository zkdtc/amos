# AMOS Gann Calculator Module v0.1

这是 AMOS 的独立江恩计算模块。

## 核心原则

- 江恩不是单独交易信号，而是时间和价格研究工具。
- 锚点质量决定计算质量。
- 价格位必须视为区间，不是魔法精确点。
- Gann 只有叠加 Price Action、AVWAP、RSI、成交量、期权/Gamma、事件窗口后才进入执行。
- 多锚点密集区比单一价格位重要。

---

## 九方图公式

```text
P_target = (sqrt(P_base) ± angle/180)^2
```

默认角度：

```text
45°
90°
180°
270°
360°
720°
```

默认价格容忍区间：

```text
±0.5%
```

---

## 时间窗口

短期：

```text
7 / 14 / 21 / 34 / 45 / 55 天
```

中期：

```text
60 / 90 / 144 / 180 天
```

长期：

```text
360 天
```

后续版本会区分 calendar days 和 trading days。

---

## 锚点选择规则

优先锚点：

- 绝对大低点
- 绝对大高点
- 财报缺口高/低
- 重要波段高/低
- ATH
- 恐慌出清低点
- 突破后回踩低点

坏锚点：

- 随机日内价格
- 情绪化选择价格
- 微小噪音拐点
- 为了拟合结果倒推锚点

---

## Resonance Score v0

组件：

- Gann Time Proximity 25%
- Gann Price Proximity 25%
- Anchor Quality 15%
- Multi-anchor Cluster 15%
- Price Action Confirmation 20%

解释：

- 80-100：高共振行动窗口
- 60-79：观察/部分行动
- 40-59：Setup不完整
- 0-39：弱信号或无信号

---

## 当前样本

文件里包含 CRDO 的两个 sample anchors：

- sample major low
- sample major high

注意：这是结构样本，不是实时交易建议。
