# AMOS Portfolio Battle Map & Migration Engine v0.1

这个模块解决你当前最现实的问题：

> 旧持仓、观察仓、新战线之间，什么时候保留，什么时候减，什么时候迁移？

---

## 核心原则

- 不能因为某个东西热就换仓。
- 迁移必须基于相对证据，而不是后悔。
- Core / Swing / Tactical / Runner 必须分开管理。
- 正确方向也可能有错误时间。
- 迁移看的是机会成本，不只是单个标的好不好。

---

## 仓位角色

### Core
高信念、处于大周期、有长期逻辑。  
规则：正常波动不卖，但高潮区必须止盈。

### Swing
周期交易。  
规则：按 Gann / AVWAP / TCG / Event Window 进出，不许把失败波段变核心。

### Tactical
事件或错价交易。  
规则：小仓、明确催化、催化失败就走。

### Runner
止盈后剩余赢家。  
规则：结构不坏就让利润奔跑，不要情绪化重新加仓。

### Research
观察仓或研究仓。  
规则：不能满仓，必须证据升级后才能 Build。

---

## 迁移决策五步

### Step 1 — Current Position Health
旧持仓逻辑是否健康？

输出：

- healthy
- watch
- degrading
- broken

### Step 2 — New Battlefield Strength
新战线是真启动还是短炒？

输出：

- research_only
- early_signal
- confirmed
- crowded
- tail_chase

### Step 3 — Opportunity Cost
继续占用资金是否错失更强机会？

输出：

- low
- medium
- high

### Step 4 — Execution Window
迁移时机是否成熟？

输出：

- now
- wait_for_pullback
- wait_for_breakout
- avoid

### Step 5 — Migration Action
具体动作：

- hold
- trim_old
- sell_old
- probe_new
- build_new
- swap_partial
- wait

---

## 当前持仓 v0

### IREN
战场：BTC + AI Compute  
股性：高Beta、流动性敏感  
规则：不要在BTC流动性清算早期加仓；等恐慌成熟。

### LITE
战场：Optical / AI Infra  
股性：二线高Beta、利润保护需求强  
规则：如果光学主线健康但 LITE 跑输 CRDO/COHR，考虑部分迁移到更强者。

### CRDO
战场：AI Infra / Optical  
股性：高Beta、财报/Gamma敏感  
规则：如果相对强度与财报证据保持，可以作为AI Infra核心波段。

### TEM
战场：AI Healthcare  
股性：长久期、事件跳空、估值分歧  
规则：仓位必须反映不确定性。

### IBM
战场：低Beta AI / 现金流  
股性：稳定器  
规则：市场强攻时可作为资金来源，但不是随便卖掉的垃圾仓。

### FIGR
战场：Fintech / Private Credit  
股性：数据不足  
规则：证据升级前不能重仓。

### HOOD
战场：BTC Finance / Retail Trading  
股性：流动性赌场代理  
规则：等成熟重置，不要因为headline dip就急着买。

### FRMI / INFQ
战场：不清晰  
规则：需要澄清 thesis，否则降低注意力权重。

---

## 观察战场 v0

### Big Tech Anchors
NVDA / MSFT / GOOG / AVGO / ORCL

### AI Infra / Optical
CRDO / LITE / COHR / ANET / AAOI

### AI Software / Agent
APP / NET / PLTR / BSY / CDNS

### BTC Finance
HOOD / COIN / MSTR / IREN / SOFI

### Space
RKLB / RDW / ASTS

### Quantum
IONQ / RGTI / QBTS

### AI Healthcare
TEM / NVO / biotech AI basket

### Robotics / Autonomy
TSLA / SERV

### Consumer / Education AI
DUOL / DIS

---

## 迁移动作

### Hold Old, No New
旧持仓健康，新战线未确认。

### Trim Old, Probe New
旧持仓偏拥挤，新主题早期但未确认。

### Swap Partial
旧持仓走弱，新战线由龙头和资金流确认。

### Sell Old, Build New
旧逻辑破坏，新机会确认且时机成熟。

### Wait Cash
旧仓和新机会时机都不好，或宏观不支持。

---

## 风险护栏

- 不因为错过 ASTS 而追下一个。
- 不从健康龙头迁移到低质量尾部股。
- 不把失败 Swing 变成 Core。
- 不卖稳定器去追尾部FOMO。
- 永远比较未来 2-6 周机会成本。
