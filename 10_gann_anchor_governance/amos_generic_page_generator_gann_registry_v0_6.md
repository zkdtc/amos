# AMOS Generic Page Generator with Gann Registry v0.6

这个交付让通用个股页生成器读取：

`amos_gann_live_ticker_registry_v0_4.json`

## 本版变化

- HOOD 现在显示 Gann Live。
- 五个样板标的全部显示 Gann Live。
- Gann Zone 内加入 Anchor Verification Checklist 链接。

## 当前状态

```text
CRDO → Gann Live
NVDA → Gann Live
LITE → Gann Live
IREN → Gann Live
HOOD → Gann Live
```

## 生成页面

- `nvda_stock_page_gann_registry_v0_6.html`
- `crdo_stock_page_gann_registry_v0_6.html`
- `lite_stock_page_gann_registry_v0_6.html`
- `iren_stock_page_gann_registry_v0_6.html`
- `hood_stock_page_gann_registry_v0_6.html`

## 护栏

- 仍然是 sample/manual-ready。
- Gann 不能单独触发交易。
- hard_missing_data 非空时，行动上限仍然是 Watch / Research Only。
- 所有 Gann 页面必须回链 Anchor Verification。
