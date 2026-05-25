# AMOS Stock Personality Radar v0.1

这个模块把“个股股性”从主观印象变成可学习结构。

## 核心原则

- 股票不是只有行业属性，还有行为 DNA。
- 同样的宏观环境，不同股票反应完全不同。
- 股性标签不能永久写死，必须通过事件和历史行为持续学习。
- 目标不是给股票贴标签，而是判断：适合核心、波段、事件交易、恐慌反转，还是不能追。

---

## 股性维度

1. **Beta Profile**：低Beta / 市场Beta / 高Beta / 极端Beta  
2. **Narrative Sensitivity**：叙事敏感度  
3. **Earnings Sensitivity**：财报敏感度  
4. **Gamma Sensitivity**：期权敏感度  
5. **Liquidity Sensitivity**：流动性敏感度  
6. **Retail Participation**：散户参与度  
7. **Institutional Sponsorship**：机构持有质量  
8. **Trend Behavior**：趋势行为  
9. **Drawdown Behavior**：回撤行为  
10. **Best Strategy Fit**：最适合策略  

---

## 主要股性原型

### Core Sovereign Leader
代表：NVDA / MSFT / GOOG  
特点：大周期核心资产，机构核心仓，产业锚。  
策略：核心持有，但高潮区必须止盈。

### Second-line High Beta
代表：CRDO / LITE / COHR  
特点：主题二线高弹性，容易大涨大跌。  
策略：波段/核心混合，用 Gann / AVWAP / TCG 控制买卖点。

### Liquidity Casino Proxy
代表：HOOD / COIN  
特点：零售风险偏好、BTC、交易量、Gamma高度敏感。  
策略：等流动性重置和恐慌成熟，不要太早。

### Dual Narrative Transformer
代表：IREN / IBM  
特点：旧业务+新叙事转型，估值分歧大。  
策略：拆分旧业务风险和新叙事溢价。

### Long Duration Future Story
代表：TEM / IONQ / RKLB / ASTS  
特点：超长久期、高不确定、高事件敏感。  
策略：中小仓、事件窗口、不盲目摊平。

### Slow Compounder Stabilizer
代表：IBM / MSFT / GOOG  
特点：低Beta、现金流、机构基础。  
策略：组合稳定器，不适合用高Beta方式操作。

---

## 当前样板分类

| Ticker | Archetype | Best Fit |
|---|---|---|
| NVDA | Core Sovereign Leader | Core + Trim |
| CRDO | Second-line High Beta | Swing Cycle |
| LITE | Second-line High Beta | Swing Cycle |
| IREN | Dual Narrative Transformer | Panic Reversal / Swing |
| HOOD | Liquidity Casino Proxy | Wait for Maturity |
| TEM | Long Duration Future Story | Small Core / Tactical |
| IBM | Slow Compounder Stabilizer | Stabilizer Hold |
| RKLB | Long Duration Future Story | Event Cycle Swing |
| IONQ | Long Duration Future Story | Small Tactical |

---

## 系统要学习的事件

### Earnings Reaction
财报前拉升、隐含波动、实际反应、指引质量、跳空后是否守住、财报AVWAP、分析师修正。

### Macro Reaction
10Y上行/下行、DXY上行、VIX冲击、BTC下跌、risk-on日反应。

### Gamma Reaction
Call wall、put wall、OPEX周、squeeze延续、pin失败。

### Narrative Reaction
板块新闻、龙头新闻、政策标题、社交热度、龙头 vs 尾部行为。

### Panic / Euphoria Reaction
恐慌成熟、第一次反弹质量、反抽失败、高潮衰竭、止盈后走势。

---

## 评分模型

### Personality Confidence
- 历史事件数量 25%
- 跨周期观察 25%
- 财报样本 20%
- 宏观反应样本 15%
- Gamma样本 15%

### Misclassification Risk
- 新公司/IPO 25%
- 商业模式转型 25%
- 历史太短 20%
- 单一事件扭曲 15%
- Narrative切换 15%
