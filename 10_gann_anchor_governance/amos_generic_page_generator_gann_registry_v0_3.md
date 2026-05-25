# AMOS Generic Page Generator with Gann Registry v0.3

这个交付让通用个股页生成器读取：

`amos_gann_live_ticker_registry_v0_1.json`

## 新能力

- CRDO = Gann Live
- NVDA = Gann Live
- LITE / IREN / HOOD = Gann Pending

## 规则

```text
Read registry.
If ticker in live_tickers:
    insert Gann Research Zone.
Else:
    show Gann Pending block.
```

## 生成页面

- `nvda_stock_page_gann_registry_v0_3.html`
- `crdo_stock_page_gann_registry_v0_3.html`
- `lite_stock_page_gann_registry_v0_3.html`
- `iren_stock_page_gann_registry_v0_3.html`
- `hood_stock_page_gann_registry_v0_3.html`

## 护栏

- 仍然是 sample/manual-ready。
- Gann 不能单独触发交易。
- hard_missing_data 非空时，行动上限仍然是 Watch / Research Only。
