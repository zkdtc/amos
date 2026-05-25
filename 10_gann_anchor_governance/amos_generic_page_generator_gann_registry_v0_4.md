# AMOS Generic Page Generator with Gann Registry v0.4

这个交付让通用个股页生成器读取：

`amos_gann_live_ticker_registry_v0_2.json`

## 本版变化

- 从 registry v0.1 升级到 registry v0.2。
- LITE 现在显示 Gann Live。
- IREN / HOOD 仍然显示 Gann Pending。

## 当前状态

```text
CRDO → Gann Live
NVDA → Gann Live
LITE → Gann Live
IREN → Gann Pending
HOOD → Gann Pending
```

## 生成页面

- `nvda_stock_page_gann_registry_v0_4.html`
- `crdo_stock_page_gann_registry_v0_4.html`
- `lite_stock_page_gann_registry_v0_4.html`
- `iren_stock_page_gann_registry_v0_4.html`
- `hood_stock_page_gann_registry_v0_4.html`

## 护栏

- 仍然是 sample/manual-ready。
- Gann 不能单独触发交易。
- hard_missing_data 非空时，行动上限仍然是 Watch / Research Only。
