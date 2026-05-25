# AMOS Risk Protection & Behavior Guardrail Engine v0.1

这个模块是 AMOS 的风险保护核心。  
它不是泛泛提醒“投资有风险”，而是围绕用户真实行为弱点设计。

## 核心原则

- 风险保护必须围绕真实持仓和真实市场状态。
- 用户最强优势：在优质成长股恐慌成熟时敢买。
- 用户最大风险：高位兴奋时不愿止盈。
- 高信念 + 杠杆 = 禁止。
- 失败波段不能被改名为核心持仓。
- 高位风险提醒必须比低位提醒更强、更抓眼。

---

## 风险模块

### 1. Euphoria Exhaustion Engine
识别高位衰竭。

输入：

- Gann压力位 / 时间窗
- RSI超买
- 量价背离
- TCG 8/12EMA过度拉伸
- AVWAP距离过远
- 估值溢价
- Call mania
- 尾部股乱飞
- 事件压力
- Narrative成熟度

警报等级：

- Yellow：关注利润保护
- Orange：减仓20-30%
- Red：减仓30-50% / 卖Call / 停止加仓
- Black：退出弱仓，保护核心

### 2. Panic Maturity Engine
区分成熟恐慌和下跌早期。

阶段：

- Stage 0：普通回调
- Stage 1：早期下跌
- Stage 2：强制出清
- Stage 3：恐慌成熟，可试仓
- Stage 4：反转确认，可加仓

硬规则：

> 下跌本身不是买入信号。

### 3. Leverage Prohibition Engine
禁止高Beta成长股杠杆。

规则：

- 不用margin加高Beta成长
- 不用杠杆摊平
- 不用期权重仓回血
- 任何宏大叙事都不能覆盖爆仓风险

### 4. Core / Swing Separation Engine
防止仓位角色混乱。

规则：

- Core需要长期生意与Narrative支撑
- Swing必须尊重技术和事件窗口
- Tactical必须小仓且有催化
- Runner是止盈后的利润尾仓
- 失败Swing不能改名Core

### 5. Narrative Health Engine
判断故事是否健康、拥挤、衰竭或破裂。

状态：

- healthy
- maturing
- crowded
- exhausting
- broken

### 6. Opportunity Cost Engine
识别资金是否被弱逻辑占用。

---

## 用户已知失败模式

### 高信念加杠杆
护栏：硬禁止。

### 高位不止盈
护栏：高位红色/黑色强提醒。

### 抄底太早
护栏：必须经过 Panic Maturity Stack。

### 失败波段变核心
护栏：入场时锁定角色。

### Narrative 吸走注意力
护栏：注意力治理 + 证据要求。

### 后悔追涨
护栏：Regret Guardrail。

---

## 风险警报必须包含

- risk_type
- severity
- affected_positions
- why_now
- evidence
- counter_evidence
- recommended_action
- invalidation_or_relief_condition

---

## 示例警报

### Euphoria Trim
CRDO/LITE 如果出现：

- Gann压力和时间窗口
- RSI超买
- 事件风险
- 拥挤上升

动作：

- 减仓30-50%
- 停止加仓
- 可考虑卖Call

### Panic Not Mature
HOOD/IREN 如果只是 headline 下跌，但没有：

- 成交量衰竭
- AVWAP reclaim
- BTC流动性稳定
- RSI背离

动作：

- 等待
- 不要早买

### Failed Swing
如果 LITE 的 swing thesis 已破，但被心理上改成 core：

动作：

- 回看原始入场理由
- 没有新证据就退出或缩小
