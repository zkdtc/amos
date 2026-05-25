# AMOS Engineer Reading Guide v0.1

## 给工程师的阅读顺序

- 1. amos_alpha_master_index_v0_6.html
- 2. amos_origin_process_and_design_manual_v0_1.md
- 3. amos_canonical_system_integration_spec_v0_1.md
- 4. amos_no_omission_master_checklist_v0_1.md
- 5. amos_engineering_handoff_spec_v0_1.md
- 6. amos_codex_task_pack_v0_1.md
- 7. amos_repo_structure_v0_1.md
- 8. Specific artifacts only when implementing a module

## 第一轮不要做什么

- Do not turn AMOS into a generic portfolio tracker.
- Do not reduce Gann to support/resistance.
- Do not hide missing data.
- Do not let sample data look live.
- Do not remove user-specific risk guardrails.
- Do not ask the user to re-provide the same conceptual system; the AI/system must retain and integrate.

## 第一轮工程目标

- 本地 React/TypeScript app.
- Local JSON/CSV data only.
- Master Index, Gann Registry, Stock Page, Daily Brief, Events, Evidence pages.
- Guardrail tests.
- No live APIs.
- No brokerage/trading.

## 验收重点

- AMOS is not a trading bot.
- AMOS is not a generic dashboard.
- AMOS is a personal operating system for market cognition and disciplined execution.
- The first app version must be local JSON/CSV-driven.
- Every page using sample/manual data must show a warning.
- Gann Live means the module exists, not that the levels are tradable.
- Anchor Verification is mandatory before formal Gann use.
- Data Freshness and Event Risk must cap action.
- Evidence must include counter-evidence before it can influence action.
- User wants speed, but not at the cost of losing the confirmed architecture.