# AMOS Gann Live Ticker Registry v0.3

这是 AMOS 的 Gann Live 标的登记表 v0.3。

## 本版变化

- IREN 加入 Gann Live。
- Gann Live 现在包括 CRDO / NVDA / LITE / IREN。
- Gann Pending 现在只剩 HOOD。

## 当前 Gann Live

- **CRDO** — amos_unified_gann_resonance_engine_v0_4.json — Unified Score 32 — no_actionable_resonance
- **NVDA** — amos_nvda_gann_engine_v0_1.json — Unified Score 53 — incomplete_resonance
- **LITE** — amos_lite_gann_engine_v0_1.json — Unified Score 33 — no_actionable_resonance
- **IREN** — amos_iren_gann_engine_v0_1.json — Unified Score 37 — no_actionable_resonance

## 当前 Gann Pending

- **HOOD** — Gann Pending

## Lookup Rule

```text
For each ticker:
  if ticker in registry.live_tickers:
      insert Gann Research Zone
  else:
      show Gann Pending block
```

## Guardrails

- 不把 sample/manual-ready Gann 数据当实时行情。
- Gann 不能单独触发买卖。
- 如果 hard_missing_data 非空，行动上限是 Watch / Research Only，除非其他模块确认。
- 样本锚点必须被真实图表验证后才能进入正式交易使用。

## 下一步

1. 建立 HOOD Gann Engine v0.1。
2. 重新生成通用个股页，让 HOOD 也显示 Gann Live。
3. 更新 Anchor Verification Checklist，把 IREN 锚点纳入验证。
4. 建立 Manual Data Workbook v0.2 unified workbook。
