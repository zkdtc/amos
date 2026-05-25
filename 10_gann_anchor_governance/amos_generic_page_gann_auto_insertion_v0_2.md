# AMOS Generic Page + Gann Zone Auto-Insertion v0.2

这个交付升级了通用个股页生成器。

## 新能力

如果 ticker 有独立 Gann engine 数据：

- 自动插入 Gann Research Zone
- 显示 Unified Gann Score
- 显示 Gann Price / Time Score
- 显示最近 Support / Resistance
- 显示 Price Cluster / Time Cluster
- 显示 Missing Confirmation Gates

如果 ticker 没有 Gann engine 数据：

- 不假装有江恩数据
- 明确显示 Gann Pending
- 列出需要补充的锚点、九方图、时间窗和确认门

## 当前状态

只有 CRDO 有 Gann Engine 数据，所以：

- CRDO = Gann Live
- NVDA / LITE / IREN / HOOD = Gann Pending

## 生成页面

- `nvda_stock_page_gann_auto_v0_2.html`
- `crdo_stock_page_gann_auto_v0_2.html`
- `lite_stock_page_gann_auto_v0_2.html`
- `iren_stock_page_gann_auto_v0_2.html`
- `hood_stock_page_gann_auto_v0_2.html`
