# AMOS Generic Stock Page Generator v0.1

这是 AMOS 的通用个股页生成器。

它把 CRDO 个股页中的通用逻辑抽象出来，用同一套模板批量生成：

- NVDA
- CRDO
- LITE
- IREN
- HOOD

## 输入文件

- `amos_sample_data_fixture_v0_1.json`
- `amos_scoring_connected_dashboard_v0_2.json`

## 生成页面

- `nvda_generic_stock_intelligence_page_v0_1.html`
- `crdo_generic_stock_intelligence_page_v0_1.html`
- `lite_generic_stock_intelligence_page_v0_1.html`
- `iren_generic_stock_intelligence_page_v0_1.html`
- `hood_generic_stock_intelligence_page_v0_1.html`

## 通用页面结构

每个页面包含：

- Hero / identity
- Auto action
- Scoring grid
- Decision summary
- Profile / state
- Narrative exposure
- Action logic
- Evidence chain
- Counter evidence
- Invalidation conditions
- Next real data needed

## 意义

这一步证明 AMOS 个股作战页不是 CRDO 单独定制，而是可以复用到整个持仓和观察仓池。

## 下一步

1. 当某个 ticker 有独立 Gann engine 数据时，自动插入 Gann Research Zone。
2. 加入 peer map。
3. 接入 real data adapter。
4. 批量生成所有 watchlist 页面。
