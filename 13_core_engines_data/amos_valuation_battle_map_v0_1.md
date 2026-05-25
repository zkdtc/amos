# AMOS Valuation Battle Map v0.1

估值在 AMOS 里不是一个目标价，而是一个多层战场。

核心纪律：

> 宏观定仓位 · 估值定胜率 · 财报定去留 · 周期定时机 · 期权定下限

## 七层估值

### S1 Macro Constraint
宏观约束层。  
决定仓位上限和Beta上限，不直接决定目标价。

核心问题：  
当前环境允许我多激进？

### S2 Intrinsic Value
内在价值层。  
DCF、FCF、Owner Earnings、SBC、毛利率、护城河、管理层。

核心问题：  
这家公司在保守/中性/乐观情景下到底值多少钱？

### S3 Market Consensus
市场共识层。  
分析师上修/下修、Guidance、Consensus、Price Target revision。

核心问题：  
市场正在靠近我的判断，还是远离我的判断？

### S4 Narrative Value
叙事估值层。  
市场愿意给它多少未来？AI/Space/Quantum/BTC这种大叙事是否仍在扩张？

核心问题：  
市场现在相信的未来，还有多少燃料？

### S5 Cycle Value
周期估值层。  
行业周期、资金周期、价格周期、事件周期、Gann时间窗。

核心问题：  
它是早期、主升、拥挤、尾声，还是恐慌成熟？

### S6 Personality Value
股性估值层。  
不同股票的估值容忍度不同。NVDA、TSLA、PLTR、CRDO、IBM不可能用同一把尺。

核心问题：  
这只股票的股性允许多高溢价？

### S7 Extreme Risk Value
极端风险估值层。  
泡沫区、止盈区、恐慌成熟区、强制出清区、失效区。

核心问题：  
涨到哪里该保护利润？跌到哪里才是真机会？

## 行动矩阵

### Attack
宏观允许高Beta，资金流进入，叙事早中期，技术触发确认，风险堆叠不极端。

### Build
逻辑成立，估值不便宜但可接受，叙事强，入场点不过热。

### Hold
趋势完整，逻辑没坏，估值虽然高但没有衰竭证据。

### Trim
Gann时间/压力位、RSI超买、量价背离、拥挤升高、事件风险高。

### Exit
基本面破坏，EPS/营收被下修，关键客户或技术路线出问题，价格结构确认走坏。

### Hedge
核心仓仍成立，但宏观/事件风险升高。  
注意：对用户而言 Put 不是默认，很多时候先 Trim / Sell Call 更符合风格。

### Wait
方向可能对，但时机不成熟。尤其适用于“下跌刚开始，还不是恐慌成熟”。

## CRDO 样板问题

- 增长是否足以支撑高估值？
- AI CapEx链是否继续扩张？
- CRDO是可持续龙头，还是二线高Beta？
- 当前价格由基本面、Narrative还是Gamma驱动？
- 如果AI Infra回调，第一真实恐慌买点在哪里？

## 后续接入

这个模块后续要和以下对象联动：

- `market_state`
- `capital_flow`
- `narrative`
- `stock_state`
- `valuation`
- `gann`
- `options_gamma`
- `event_pressure`
- `decision`
