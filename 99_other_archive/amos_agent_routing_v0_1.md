# AMOS Agent Routing v0.1

这份文件定义 AMOS 里的 AI 角色如何分工、如何互相验证、谁有否决权、最终如何生成决策。  
核心目标：避免 AMOS 变成“一个大模型随口总结”，而是变成一个多角色研究系统。

## 总原则

AMOS 不是用户观点镜像。  
用户观点可以成为线索，但不能直接成为结论。  
所有判断都必须经过：

1. 证据收集
2. 来源质量评分
3. 宏观状态识别
4. 资金流识别
5. Narrative 生命周期识别
6. 个股人格识别
7. 估值分层
8. 技术执行分析
9. 期权/Gamma分析
10. 风险审查
11. 多AI辩论
12. 决策合成
13. UI压缩/展开
14. 治理记录

## Agent 列表

### Research AI
负责找证据、反证、来源质量评分。  
不接受用户观点作为证据。

### Macro AI
负责宏观流动性、利率、美元、信用、波动率、BTC风险偏好。  
有权降低组合风险上限。

### Capital Flow AI
负责资金迁移、主线扩散、轮动、尾部狂欢识别。

### Narrative AI
负责叙事生命周期：早期、机构认同、资金扩张、FOMO、拥挤、衰竭、重置。

### Stock Personality AI
负责个股行为DNA：高Beta、财报敏感、Gamma放大、核心龙头、二线扩散、尾部妖股等。

### Valuation AI
负责多层估值：内在估值、市场共识、Narrative估值、周期估值、股性估值、极端风险估值。

### Technical AI
负责 Gann / AVWAP / TCG / 缠论结构 / RSI / EMA / MTFA。

### Options Gamma AI
负责 call wall、put wall、max pain、IV、dealer gamma、OPEX、squeeze/pin/reset。

### Risk AI
负责用户风险保护、高位兴奋、恐慌不成熟、拥挤、事件风险。  
有权在极端风险堆叠时否决看多输出。

### Debate AI
负责让 Bull / Bear / Macro / Valuation / Risk / Technical 互相辩论。  
分歧越大，最终信心越低。

### Decision AI
负责输出行动：attack / build / add / hold / trim / exit / hedge / wait / research。

### Compression AI
负责不同页面的信息密度：
- 首页压缩
- 个股页展开
- 风险警报突出

### Governance AI
负责防止系统乱长。新理论必须有证据、影响范围、过拟合风险和回滚计划。

## 决策输出必须包含

- action
- confidence
- timeframe
- evidence_chain
- counter_evidence
- invalidation_conditions
- risk_alerts
- next_check

## 禁止输出

- 因为用户喜欢所以买
- 绝对化预测
- 没有反证的单边结论
- 没有市场定价证据的宏观结论

## 示例路由

### NVDA 事件影响 CRDO/LITE
Research → Macro → Capital Flow → Narrative → Stock Personality → Options Gamma → Risk → Debate → Decision

### 用户提出 Quantum 牛市
Research 先找证据和反证，不能直接接受用户观点。

### HOOD/BTC 因中国监管消息下跌
先区分 headline 和 actual market pricing，再判断恐慌是否成熟。
