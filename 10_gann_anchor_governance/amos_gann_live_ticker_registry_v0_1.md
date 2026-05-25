# AMOS Gann Live Ticker Registry v0.1

这是 AMOS 的 Gann Live 标的登记表。

## 目的

让通用个股页生成器可以按 ticker 自动识别：

```text
Gann Live → 自动插入 Gann Research Zone
Gann Pending → 显示待接入，不假装有数据
```

## 当前 Gann Live

- **CRDO** — amos_unified_gann_resonance_engine_v0_4.json — Unified Score 32 — no_actionable_resonance
- **NVDA** — amos_nvda_gann_engine_v0_1.json — Unified Score 53 — incomplete_resonance

## 当前 Gann Pending

- **LITE** — Gann Pending
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

1. 升级通用个股页生成器读取 registry。
2. 重新生成页面，让 CRDO 和 NVDA 都成为 Gann Live。
3. 建立 LITE Gann Engine v0.1。
4. 建立 Gann anchor verification checklist。
