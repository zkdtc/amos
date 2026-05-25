# AMOS Data Schema v0.1

这是 AMOS 的第一版数据骨架。它的作用不是展示给最终用户，而是约束后续所有页面、AI判断、数据接入和证据链生成。

## 核心原则

- 市场先于用户认知
- 证据链先于结论
- 系统主干先于个性化
- 用户观点是输入信号，不是真理
- 所有判断必须有证据、反证和失效条件

## 主要实体

1. `market_state`  
   市场状态机：风险偏好、流动性、利率压力、信用压力、VIX/Gamma/BTC等。

2. `capital_flow`  
   资金迁移：主战场、二级扩散、轮动类型、拥挤度、领导链。

3. `narrative`  
   叙事生命周期：从 dormant 到 crowded consensus 到 exhaustion。

4. `stock_profile`  
   个股静态身份：所属产业、股性标签、核心/波段适配、驱动与风险。

5. `stock_state`  
   个股动态状态：价格结构、相对强弱、EMA/AVWAP/Gann/Gamma状态。

6. `valuation`  
   多层估值：内在估值、市场共识、Narrative估值、周期估值、股性估值、极端风险估值。

7. `gann`  
   江恩价格与时间：多锚点、九方图、时间窗、时价共振。

8. `options_gamma`  
   期权与Gamma：call wall、put wall、max pain、IV、dealer gamma、squeeze/pin风险。

9. `event_pressure`  
   事件压力：宏观、财报、OPEX、IPO、地缘政治等，不是日历垃圾堆。

10. `portfolio`  
    持仓与观察仓：仓位角色、Narrative暴露、Beta暴露、相关性、迁移候选。

11. `decision`  
    决策输出：action、timeframe、confidence、evidence、counter-evidence、invalidation。

12. `research_source`  
    外部研究源：官方数据、财报、YouTube、X、书籍、研报，并记录质量与偏见风险。

13. `model_governance`  
    系统治理：任何新增逻辑都要记录证据、影响模块、过拟合风险和回滚计划。

## 页面依赖

### Home Command Center
依赖：
- market_state
- capital_flow
- event_pressure
- portfolio
- narrative
- decision

### Stock Intelligence Page
依赖：
- stock_profile
- stock_state
- valuation
- gann
- options_gamma
- event_pressure
- narrative
- decision
- research_source

### Capital Radar
依赖：
- capital_flow
- narrative
- market_state
- research_source

### Cognitive Lab
依赖：
- decision
- portfolio
- research_source
- model_governance

## 下一步

- 定义 market_state 的评分公式
- 定义 narrative 生命周期评分
- 定义 stock personality 标签体系
- 定义 Gann 计算服务
- 定义 evidence quality 评分
- 定义 decision confidence 公式
