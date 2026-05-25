# AMOS Sample Data Fixture v0.1

这是 AMOS 从静态原型转向数据驱动的第一份样本数据。

注意：这不是实时市场数据，也不是投资建议。  
所有数字是结构占位和逻辑样本，后续要接真实数据源。

## 包含对象

- `market_state`
- `narratives`
- `stocks`
  - NVDA
  - CRDO
  - LITE
  - IREN
  - HOOD
- `portfolio`

## 用途

1. 让页面不再只写死文案，而能读取统一字段。
2. 测试 Action Bias、Risk Stack、Narrative Exposure、Decision 输出。
3. 为 CRDO Data-driven Page v0.2 做准备。
4. 为每日 AI Market Brief 做准备。

## 样板判断

### Market State
当前样本状态设为：

`liquidity_expansion_with_rising_crowding`

意思是：

- 风险偏好仍在扩张
- 流动性暂时支持
- AI Infra仍是主线
- 但高Beta二线和事件窗口拥挤度上升

### NVDA
核心AI锚，动作偏向 Hold。  
事件压力高，高潮区需要Trim纪律。

### CRDO
AI Infra / Optical 二线高Beta。  
动作偏向 Hold / No Chase / Trim if Exhaustion。  
需要实时价格、期权、Gann和财报数据确认。

### LITE
Optical recovery。  
如果光学主线健康但 LITE 跑输 CRDO/COHR，机会成本上升。

### IREN
BTC + AI Compute 双叙事。  
等待 BTC/AI算力验证或恐慌成熟。

### HOOD
BTC Finance / Retail Trading。  
等待成熟重置，不追第一根headline dip。

## 下一步

- 用这份 fixture 生成数据驱动 CRDO 页面 v0.2
- 编写评分逻辑 v0.1
- 接入真实数据时替换 placeholder 字段
