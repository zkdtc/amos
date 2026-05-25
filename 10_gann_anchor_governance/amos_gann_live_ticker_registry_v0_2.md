# AMOS Gann Live Ticker Registry v0.2

这是 AMOS 的 Gann Live 标的登记表 v0.2。

## 本版变化

- LITE 加入 Gann Live。
- Gann Live 现在包括 CRDO / NVDA / LITE。
- Gann Pending 现在只剩 IREN / HOOD。

## 当前 Gann Live

- **CRDO** — amos_unified_gann_resonance_engine_v0_4.json — Unified Score 32 — no_actionable_resonance
- **NVDA** — amos_nvda_gann_engine_v0_1.json — Unified Score 53 — incomplete_resonance
- **LITE** — amos_lite_gann_engine_v0_1.json — Unified Score 33 — no_actionable_resonance

## 当前 Gann Pending

- **IREN** — Gann Pending
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

1. 重新生成通用个股页，让 CRDO / NVDA / LITE 都显示 Gann Live。
2. 建立 Gann anchor verification checklist。
3. 建立 IREN Gann Engine v0.1。
4. 建立 HOOD Gann Engine v0.1。
