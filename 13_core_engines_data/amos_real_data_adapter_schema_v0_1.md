# AMOS Real Data Adapter Schema v0.1

这个模块定义 AMOS 接入真实数据需要的工程接口。

核心原则：

> 每个真实字段都必须声明 source、timestamp、freshness、confidence、collection_method 和 fallback。

---

## Adapter Layers

### 1. Market Data Adapter
用途：价格、成交量、相对强弱、均线、RSI、Breadth。

高优先级字段：

- last_price
- volume
- avg_volume_20d
- ema_8
- ema_12
- ema_21
- sma_50
- sma_200
- rsi_14d
- atr_14d
- relative_strength_vs_QQQ
- trend_structure

Fallback：手动看图 / broker导出 / TradingView。

---

### 2. Macro Data Adapter
用途：宏观状态机。

字段：

- US10Y
- US2Y
- DXY
- VIX
- VVIX
- MOVE
- HY credit spread
- IG credit spread
- SPX above 200DMA %
- Nasdaq Forward P/E
- SPX Forward P/E
- BTC price / trend

Fallback：FRED / TradingView / Koyfin / 手动录入。

---

### 3. Event Calendar Adapter
用途：事件压力，不是财经日历垃圾堆。

字段：

- event_type
- event_name
- date/time
- affected_tickers
- affected_narratives
- pressure_score
- direction_bias
- watch_question
- post_event_result

事件类型：

- earnings
- macro
- opex
- fed
- treasury
- sector_conference
- geopolitical
- ipo
- product_event

---

### 4. Earnings Fundamental Adapter
用途：财报、指引、分析师修正和盈利质量。

字段：

- revenue actual / consensus
- revenue growth
- gross margin
- operating margin
- FCF / FCF margin
- SBC / revenue
- EPS actual / consensus
- next quarter guidance
- analyst revision
- guidance quality
- earnings call risk topics

---

### 5. Valuation Adapter
用途：估值战场。

字段：

- market cap
- enterprise value
- forward P/E
- EV/Sales NTM
- EV/Gross Profit
- FCF Yield
- PEG
- historical percentile
- bear/base/bull fair value
- price_to_weighted_fair_value

---

### 6. Gann Adapter
用途：用户高优先级执行层。

字段：

- anchor_points
- Square of Nine levels
- time windows
- time = price windows
- nearest support/resistance
- distance to support/resistance
- gann_time_score
- gann_price_score

Fallback：手动锚点 + calculator。

---

### 7. AVWAP / Technical Adapter
用途：AVWAP、TCG、缠论结构和执行确认。

字段：

- avwap anchors
- price vs AVWAP
- TCG structure
- EMA state
- volume confirmation
- Chan center state
- price action confirmation score

---

### 8. Options / Gamma Adapter
用途：期权结构、Gamma、波动释放。

字段：

- call wall
- put wall
- max pain
- IV rank
- skew
- put/call ratio
- dealer gamma state
- gamma_state
- volatility_release_risk
- gamma_score

---

### 9. Source Evidence Adapter
用途：存储研究来源和证据质量。

字段：

- source_id
- source_type
- source_name
- date
- claim
- claim_type
- linked_tickers
- linked_narratives
- evidence_quality_score
- bias_risk_score
- counter_evidence
- module_targets
- invalidation_condition

---

## Manual-first Strategy

### Phase 1
手动录入优先标的和核心模块。

### Phase 2
半自动 CSV / JSON 导入。

### Phase 3
API 自动化价格、基本面、期权、事件。

### Phase 4
完整 evidence database 和 model governance。

---

## Priority Tickers

- NVDA
- CRDO
- LITE
- IREN
- HOOD
- GOOG
- MSFT
- AVGO
- RKLB
- IONQ

---

## Minimum Viable Live Fields

### Daily Brief 最低字段

- US10Y
- DXY
- VIX
- Breadth
- last_price
- RSI
- 8/12 EMA
- relative strength vs QQQ
- this week events
- portfolio positions

### Stock Page 最低字段

- last_price
- RSI
- 8/12 EMA
- earnings AVWAP
- Gann nearest support/resistance
- next event
- valuation state
- latest guidance quality
