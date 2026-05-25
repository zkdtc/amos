# AMOS Macro Regime & Liquidity State Machine v0.1

这个模块把宏观从“观点”变成状态机。

核心原则：

- 宏观是仓位和Beta约束层，不是单个股票的全部逻辑。
- 同一个指标在不同状态下含义不同。
- 市场定价比新闻标题更重要。
- AMOS 必须区分：增长乐观、估值压缩、财政压力、risk-off避险。

---

## 宏观状态机

### 1. Goldilocks Expansion
增长尚可、通胀受控、利率稳定或下降、流动性支持。  
动作：进攻 / 建立高质量Beta。  
风险：过度乐观和拥挤。

### 2. Growth Reacceleration
利率上涨来自增长预期改善。  
动作：可以持有/加仓，但要监控利率速度。  
风险：如果利率上涨过快，会切换成估值压缩。

### 3. Valuation Compression
利率快速上行，压缩长久期成长估值。  
动作：降低高Beta，保留核心龙头或现金。  
风险：二线成长先破。

### 4. Liquidity Expansion
流动性改善，风险偏好扩散。  
动作：攻击龙头，建立优质Beta。  
风险：扩张后期变成尾部追涨。

### 5. Liquidity Compression
流动性收缩，高Beta和投机资产受压。  
动作：降Beta，保护利润，等待恐慌成熟。  
风险：过早抄底。

### 6. Risk-off Shock
战争、信用、通胀、政策等突然冲击。  
动作：防守，不急着买第一跌。  
风险：第一次反弹是假反弹。

### 7. Panic Maturity
强制卖盘接近衰竭，核心逻辑未死。  
动作：试仓高质量候选。  
风险：把早期下跌误认为成熟恐慌。

### 8. Euphoria Melt-up
流动性、Narrative、Gamma、拥挤共同推升。  
动作：持有龙头，但减仓过热股，选择性卖Call。  
风险：高位不止盈。

### 9. Defensive Rotation
资金离开高Beta，转向防守、现金、债、黄金、低Beta质量股。  
动作：降低高Beta，只留最佳核心。  
风险：二线弱股拿太久。

---

## 指标解释规则

### 10Y
上涨不一定坏：

- 如果EPS上修、信用稳定、breadth扩张，是增长乐观。
- 如果MOVE上升、DXY强、高估值股杀跌，是估值压缩。

下降也不一定好：

- 如果通胀降温且风险资产扩散，是好。
- 如果衰退恐慌导致利率下跌，是坏。

### BTC
BTC上涨可以是risk-on，也可能是crypto-specific flow。  
BTC下跌可能是广义risk-off，也可能是局部杠杆清算。

### DXY
DXY上涨 + VIX/MOVE上升 = 全球流动性压力。  
DXY上涨 + 地缘冲击 = 避险。

### VIX / VVIX / MOVE
VIX看股票波动。  
VVIX看波动率的波动。  
MOVE看利率波动，对长久期成长股非常重要。

### Breadth
龙头上涨 + 广度扩张 = 健康。  
指数上涨但广度弱 = 脆弱。  
极弱广度只有在强制卖盘衰竭后才是买点。

---

## Beta政策

### Attack Beta
适用状态：

- Goldilocks Expansion
- Liquidity Expansion
- Growth Reacceleration

组合Beta：1.1 - 1.5

### Balanced Beta
适用状态：中性/过渡。  
组合Beta：0.8 - 1.1

### Defensive Beta
适用状态：

- Valuation Compression
- Liquidity Compression
- Defensive Rotation

组合Beta：0.4 - 0.8

### Crisis Beta
适用状态：

- Risk-off Shock

组合Beta：0.0 - 0.5

---

## 宏观到个股映射

### 高Beta AI二线
CRDO / LITE / COHR / IONQ / RKLB  
适合：流动性扩张、Goldilocks、资金扩散。  
危险：估值压缩、流动性收缩、risk-off shock。

### 大科技AI锚
NVDA / MSFT / GOOG / AVGO  
适合：Goldilocks、增长再加速、流动性扩张。  
危险：估值压缩、EPS下修。

### BTC Finance
HOOD / COIN / IREN / MSTR  
适合：流动性扩张、BTC risk-on。  
危险：流动性压缩、监管冲击、BTC清算。

### Stabilizers
IBM / MSFT / GOOG  
适合：平衡、防守轮动、轻度估值压缩。  
危险：生意逻辑破坏。

---

## Macro AI 输出必须包含

- regime_label
- confidence
- beta_ceiling
- risk_bias
- supporting_evidence
- counter_evidence
- what_would_change_my_mind

禁止：

- 单指标结论
- 只看新闻标题
- 认为10Y上涨一定坏
- 认为BTC下跌一定是全市场risk-off
