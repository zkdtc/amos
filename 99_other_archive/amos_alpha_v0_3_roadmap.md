# AMOS Alpha v0.3 Roadmap

这是从当前 Static Alpha 到真正可用 Alpha 的工程路线。

当前状态：

```text
Static Alpha + sample-data-driven prototype
```

当前瓶颈：

```text
真实数据输入 + 可重复的每日工作流
```

---

## v0.3A · Manual Data Alpha

目标：先让 AMOS 用手动输入数据就能跑起来。

这是最快可用路径，不等 API，不等自动化。

### 交付物

- Manual data input sheet/schema
- Priority ticker field checklist
- Daily Brief generated from manual score packet
- CRDO/NVDA/LITE/HOOD/IREN manually refreshed pages
- Manual evidence packet template

### 最低字段

每个 ticker 先只需要：

- price
- RSI
- 8/12 EMA state
- relative strength vs QQQ
- key AVWAP status
- nearest Gann support/resistance
- next event
- action bias
- invalidation

### 成功标准

- 用户每天能手动更新 5-10 个字段。
- AMOS 能输出 Hold / Wait / Trim Watch / Build Watch。
- 每个行动都有证据、反证、失效条件。

---

## v0.3B · Semi-automated Data Alpha

目标：支持 CSV / JSON 导入。

### 交付物

- CSV import schema
- Broker/export parser
- TradingView-style technical snapshot parser
- Manual + imported data conflict checker
- Data freshness warning system

### 成功标准

- 系统自动标记 stale data。
- 技术数据能更新页面和看板。
- 手动值与导入值冲突时可见，不隐藏。

---

## v0.3C · Real-time / API-ready Alpha

目标：准备接实时市场、基本面、期权、事件 API。

### 交付物

- Market data adapter
- Macro data adapter
- Earnings/fundamental adapter
- Options/gamma adapter
- Event calendar adapter
- Evidence/source adapter

### 成功标准

- Daily Brief 能从 fresh data packet 自动生成。
- 个股页关键评分能自动更新。
- 数据过期/缺失时自动降低置信度。

---

## v0.3D · Review & Learning Alpha

目标：建立 prediction → action → result 的复盘学习闭环。

### 交付物

- Prediction log
- Action log
- Result review
- Signal effectiveness by ticker
- Source quality update
- Behavior guardrail update

### 成功标准

- 每个重大决策能事后复盘。
- 系统学习不同指标对不同股性的有效性。
- 行为风险基于真实操作复盘，不泛泛说教。

---

## 立即下一步

1. AMOS Manual Data Input Sheet v0.1
2. Daily Brief Generator from Manual Packet v0.2
3. Priority Ticker Checklist v0.1
4. Real Evidence Packet Template v0.1
5. CRDO Peer Map v0.1

---

## 工程护栏

- v0.3A 可用前，不继续无限扩展新模块。
- 不把 sample data 装作 live data。
- 没有失效条件，不输出行动。
- Gann 不能单独触发买卖。
- 用户观察是线索，不是市场证据。
