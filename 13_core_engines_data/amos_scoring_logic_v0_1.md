# AMOS Scoring Logic v0.1

这个模块把 AMOS 的各个引擎从“结构”推进到“可计算”。

注意：评分不是事实，也不是自动交易信号。  
评分的作用是帮助 AI 和用户统一语言，形成可解释、可修正的判断。

---

## 全局规则

- 所有评分 0-100
- 必须有证据
- 必须有反证
- 必须有失效条件
- 不允许单一分数决定操作
- 数据过期时，置信度必须下降

---

## 评分模块

### 1. Macro Regime Score
判断宏观是否允许进攻。

组件：

- Liquidity Support 22%
- Rate Pressure Inverse 18%
- Credit Calm 16%
- Volatility Calm 14%
- Breadth Health 14%
- Dollar Pressure Inverse 8%
- BTC Risk Appetite 8%

解释：

- 80-100：允许进攻Beta
- 60-79：平衡到选择性进攻
- 40-59：中性/过渡
- 20-39：防守
- 0-19：危机

### 2. Narrative Strength Score
判断主题是否真正被市场定价。

组件：

- 龙头相对强度 25%
- 资金流确认 25%
- 财报/政策验证 20%
- 主题广度 15%
- 注意力质量 15%

### 3. Narrative Maturity Score
判断主题是否进入拥挤或尾声。

组件：

- 估值拉伸
- 散户关注
- 尾部股参与
- 期权狂热
- 好消息不涨

### 4. Risk Stack Score
综合风险堆叠。

组件：

- 高位衰竭 25%
- 估值扩张 18%
- 事件压力 17%
- 拥挤 16%
- Gamma不稳定 12%
- 用户行为风险 12%

硬规则：

- 如果使用或计划使用杠杆，直接 Black。
- 如果失败 Swing 被当成 Core，至少 Red。
- 如果 Gann压力/时间窗 + RSI超买 + 事件风险，至少 Orange。

### 5. Panic Maturity Score
判断下跌是否成熟。

组件：

- 回撤幅度
- RSI超卖/背离
- Gann支撑/时间共振
- 成交量衰竭
- AVWAP reclaim
- Narrative健康
- EPS未坏

解释：

- 80-100：反转确认，可Build
- 60-79：恐慌成熟，可Probe
- 40-59：强制卖盘观察
- 20-39：下跌早期，不加
- 0-19：普通回调或无优势

### 6. Gann Event Gamma Resonance Score
执行窗口评分。

公式：

```text
0.25 × Gann Time
+ 0.25 × Gann Price
+ 0.15 × Event Pressure
+ 0.15 × Gamma Structure
+ 0.20 × Price Action Confirmation
```

### 7. Valuation Battle Score
估值战场评分。

组件：

- 内在价值安全边际
- 市场共识修正
- Narrative估值支撑
- 周期阶段
- 股性溢价有效性
- 极端区非对称性

### 8. Decision Confidence Score
最终行动置信度。

组件：

- 证据质量
- 模块一致性
- 反证强度反向
- 数据新鲜度
- Setup清晰度
- Agent分歧反向

硬规则：

- 数据过期，置信度不能超过60。
- Agent强分歧，置信度不能超过65。
- 没找反证，置信度不能超过50。

---

## 行动策略

### Attack
需要：

- Macro >= 70
- Narrative >= 70
- Risk < 60
- Confidence >= 65
- 执行setup确认

### Build
需要：

- Macro >= 55
- Valuation >= 55 或 Narrative >= 70
- Risk < 70
- Confidence >= 55

### Hold
需要：

- thesis intact
- Risk < 75
- 没有失效条件触发

### Trim
触发条件：

- Risk >= 65
- Trim Zone setup
- 高位衰竭
- 事件压力高 + 估值 demanding

### Exit
触发条件：

- 生意逻辑破坏
- EPS/收入下修
- Exit Zone setup
- 失败Swing角色混乱

### Wait
触发条件：

- Setup不完整
- 下跌中 Panic Maturity < 60
- Confidence < 55
- 宏观过渡不清
