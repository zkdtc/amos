# AMOS Research Source & Evidence Quality Engine v0.1

这个模块解决一个核心问题：

> AMOS 不能等用户给证据。  
> 用户给的是线索，不是证明。  
> 系统必须自己找证据、找反证、评估来源质量、判断适用周期。

---

## 核心原则

- 用户提供的资料是 lead，不是 proof。
- 一个来源可以有用，同时也可以有偏见。
- 长期有效性取决于：跨周期有效、可证伪、有预测记录、会自我修正。
- 官方数据不是解释；评论不是数据。
- 每个结论必须有证据、反证、不确定性和失效条件。

---

## 来源类型

### Official Data
FRED、BLS、BEA、Treasury、Fed、SEC。  
质量高，风险是滞后、修正、解释错误。

### Company Primary
10-K、10-Q、财报电话会、Investor Presentation。  
质量高，风险是管理层话术和Non-GAAP美化。

### Market Data
价格、成交量、期权链、ETF flow、breadth、相对强弱。  
质量高，风险是噪音和假信号。

### Sell-side Research
投行研报。  
质量中高，风险是共识偏见、利益冲突、反应滞后。

### Independent Research
独立研究员、Substack、行业专家。  
质量中等到高，风险是过度自信和窄视角。

### YouTube Creator
宏观、技术、行业、龙头战法博主。  
质量变化大，适合提炼框架和观察市场心理，但必须验证。

### X / Twitter
早期信号、情绪、source discovery。  
不是证明。

### Book Framework
Dalio、Soros、Bernanke、Howard Marks、Keynes、Hayek、缠论等。  
适合建模型，不直接当交易信号。

### User Observation
用户观察是研究触发器，不是最终证据。

---

## 四类评分

### Evidence Quality Score
看：

- 是否一手来源
- 数据具体性
- 历史记录
- 可证伪性
- 交叉验证
- 时效性
- 激励一致性

### Bias Risk Score
看：

- 财务激励
- 观众绑架
- 意识形态
- 单资产多头倾向
- 缺少反证
- 病毒传播压力

### Cycle Validity Score
看：

- 牛市表现
- 熊市表现
- 转折点识别
- 流动性收紧表现
- 自我修正记录

### Framework Value Score
看：

- 结构清晰
- 可迁移
- 可操作
- 有证据基础
- 有失效条件

---

## YouTube / X 博主分类

### Structural Macro
高价值，用于 Macro AI / Regime Engine。  
风险：过度看空或过度抽象。

### Market State Trader
高价值，用于 Capital Flow AI / Risk AI。  
风险：过拟合近期价格。

### Price Action Execution
高价值，用于 Technical AI。  
风险：忽略估值和宏观。

### Narrative Sector Specialist
中高价值，用于 Narrative AI / Stock Personality AI。  
风险：变成主题推广者。

### Perma Bull / Perma Bear
条件价值，用作情绪或反向案例。  
风险：意识形态过拟合。

### Viral Hot Take
低价值，只作为注意力信号。

---

## Evidence Pipeline

1. 收集线索或问题
2. 识别来源类型
3. 分离事实、解释、预测、观点
4. 评分证据质量
5. 评分偏见风险
6. 找独立验证
7. 找反证
8. 映射到 AMOS 模块
9. 定义适用市场环境和失效条件
10. 存入 research_source
11. 通过 model_governance 更新系统

---

## 不可违反规则

- 没有任何博主永久可信。
- 没有任何框架永远有效。
- 每个来源都必须有失效模式。
- 一个来源可能只对某个模块有用。
- 用户信任某个博主，只是线索，不是最终证据。
- AMOS 必须能够不同意用户喜欢的来源。
