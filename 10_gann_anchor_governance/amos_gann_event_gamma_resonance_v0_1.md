# AMOS Gann × Event × Gamma Resonance Map v0.1

这个模块是 AMOS 的执行层核心之一。

它把四件事统一：

1. Gann 时间窗口  
2. Gann 价格区域  
3. Event Pressure  
4. Options / Gamma  
5. Price Action 确认  

核心原则：

> Gann 给出候选时间/价格窗口；  
> Event / Gamma 解释为什么波动可能在那里释放；  
> Price Action 决定是否真正行动。

---

## 六层执行栈

### Layer 1 — Gann Time
判断是否接近重要时间窗口。

包括：

- 7 / 14 / 21 / 34 / 55 日短周期
- 60 / 90 / 144 / 180 / 360 日大周期
- 财报周年
- 波段高低点日期锚
- Time = Price 动态窗口

### Layer 2 — Gann Price
判断是否接近九方图或角度线关键价位。

包括：

- Square of Nine
- 多锚点
- Gann angle
- 前高/前低
- ±0.5% 区间

### Layer 3 — Event Pressure
判断附近有没有能改变市场状态的事件。

包括：

- 财报
- NVDA / AI 产业事件
- FOMC / CPI / PCE / NFP
- OPEX
- 美债拍卖
- 产业会议
- IPO流动性吸收
- 地缘政治

### Layer 4 — Gamma Structure
判断期权结构是在压制、放大还是释放波动。

包括：

- Call wall
- Put wall
- Max pain
- Dealer gamma
- IV rank
- Skew
- 0DTE
- OPEX

### Layer 5 — Price Action Confirmation
判断价格行为是否确认窗口。

包括：

- TCG HH/HL 或 LH/LL
- 8EMA / 12EMA
- Inside Bar / Equilibrium
- RSI 背离
- 成交量衰竭
- AVWAP reclaim / break
- 缠论中枢突破 / 跌破

### Layer 6 — Decision Trigger
最终分类：

- Panic Buy
- Breakout Add
- Trim Zone
- Hedge Zone
- Exit Zone
- Wait

---

## 初始评分公式

```text
resonance_score =
  0.25 * Gann Time
+ 0.25 * Gann Price
+ 0.15 * Event Pressure
+ 0.15 * Gamma Structure
+ 0.20 * Price Action Confirmation
```

注意：这是初始权重，不是真理。  
因为用户长期依赖 Gann，所以 Gann 时间和价格权重较高。  
但 Price Action 必须确认，防止盲目相信江恩点位。

---

## 典型设置

### Panic Buy
需要：

- 宏观不是系统性危机
- Narrative 没死
- Gann 支撑区
- Gann 时间窗
- RSI 超卖或背离
- 成交量衰竭
- AVWAP reclaim 或 TCG 反转

禁止：

- 基本面坏了还抄底
- EPS 预期大幅下修
- 无反转确认
- 流动性仍在强制出清

### Breakout Add
需要：

- Regime 支持高Beta
- 资金流进入该叙事
- 突破 Gann 压力
- 放量
- 8/12EMA趋势完整
- Gamma结构支持

### Trim Zone
需要：

- Gann 压力区
- Gann 时间窗
- RSI 超买
- 量价背离
- 拥挤上升
- 事件风险临近

### Hedge Zone
需要：

- 核心逻辑仍成立
- 估值扩张明显
- 宏观/事件风险上升
- 跌破8EMA/AVWAP
- Gamma转负

用户风格：优先 Trim / Sell Call，Put 只在极端非对称风险时使用。

### Exit Zone
需要：

- 基本面破坏或 EPS 下修
- LH/LL确认
- AVWAP跌破且反抽失败
- Gann支撑失效
- Narrative恶化

---

## CRDO 样板问题

- CRDO是否在 NVDA 或自身财报附近进入 Gann 时间/压力窗口？
- 期权结构是在压制还是放大波动？
- Price Action 是延续还是衰竭？
- 当前是 Breakout Add、Hold、还是 Trim Zone？
- 如果下跌，是恐慌成熟，还是下跌早期？
