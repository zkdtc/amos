# AMOS Canonical System Integration Spec v0.1

这是 AMOS 当前已经稳定下来的**正本规格**。目标不是新增功能，而是把之前讨论过、已经确认的概念、细节、架构、文件、护栏和工程化要求收敛到一个不可遗漏的版本。

## 0. 当前结论

AMOS 已经从纯理念进入 **v0.3A Manual Data Alpha**：  
手动数据、证据包、日报、Gann Registry、Anchor Verification、CSV 导入标准、宏观事件日历和日报导出脚本已经形成闭环。下一阶段才是 Codex 工程化。


## 1. 项目身份与不可变原则

- **name:** AMOS / AI Market Operating System
- **phase:** v0.3A Manual Data Alpha
- **core_promise:** A personal AI-driven market operating system for observing, researching and trading U.S. equities with real evidence, cycle rhythm, leadership rotation, risk protection and user-specific behavioral guardrails.
- **non_negotiable_principle:** 整合，不是推翻。New material must classify, abstract, integrate and optimize the existing trunk, not restart or randomly expand modules.
- **current_mode:** Manual/static alpha with standardized CSV/import path; not live trading automation yet.


## 2. 用户操作画像与系统必须保护的地方

- User prefers high-growth U.S. equities around hard AI, AI infrastructure, compute, optical, defense, space, BTC/fintech, robotics, quantum and selected AI healthcare/biotech.
- User has historically made large mistakes by adding leverage, holding winners too long, failing to take profits at tops, and capitulating after forced liquidation.
- User is good at RSI oversold / key-level rebound trades and often takes 10%-20% rebound profits.
- Primary improvement target: cycle rhythm — when to attack, shrink, hold only core, avoid bottom-fishing, rotate, hedge or go to cash.
- System must protect the user at euphoric tops with loud, visible, decisive trim/exit/sell-call warnings.
- System must distinguish Core / Swing / Tactical / Runner / Research positions and must use actual holdings and actions whenever available.
- System must not become a generic dashboard; it must be personalized to user’s watchlist, mistakes, strengths, family/attention constraints and long-term compounding goal.


## 3. AMOS 核心投资框架

- Macro sets exposure ceiling.
- Liquidity and mechanical flows shape short-term risk/reward.
- Leadership and narrative lifecycle decide where capital migrates.
- Valuation sets margin of safety and forward return range.
- Earnings / guidance / revisions decide thesis health.
- Gann time-price resonance defines research zones and timing pressure, but cannot trade alone.
- TCG / price action / AVWAP / RSI / volume confirm execution.
- Options / Gamma / OPEX / event pressure cap aggressiveness.
- Evidence Packet and counter-evidence prevent narrative overconfidence.
- Portfolio Battle Map decides migration from weak/overheated names to stronger or safer peers.
- Prediction → Action → Result loop trains the system on user’s real decisions.


## 4. Home Command Center 必须覆盖

- Macro liquidity / mechanical flow layer: CTA, pension rebalance, dealer gamma, prime brokerage/HF exposure, put/call, 0DTE, VIX/VVIX/MOVE, 10Y, DXY, BTC, credit spreads, breadth, Mag7 vs equal weight.
- Mechanical dates: weekly/monthly/quarterly OPEX, triple/quad witching, ETF/index rebalance, month-end/quarter-end pension flows, FOMC/CPI/PCE/NFP/ISM/JOLTS/jobless claims, Fed minutes/dot plot, Treasury auctions, TGA/debt ceiling/fiscal events.
- Leadership and sector map: AI Infra, Optical/CPO, AI Software/Agent, Power/Cooling, Robotics, Space, Biotech/AI healthcare, Quantum, Fintech/BTC finance, BTC miners/compute, Gaming/education/consumer AI, Defense, AI Meme high-volatility pool.
- Political/geopolitical layer: tariffs, export controls, wars/ceasefire, fiscal stimulus, regulation, president/treasury/Fed official comments/posts.
- Visual layer: macro liquidity chart, mechanical date axis, SPY/QQQ/SMH Gamma Map, sector rotation heatmap, leadership graph, stock correlation network, Gann Time Wheel, Event × Cycle Resonance Chart, Portfolio Battle Map, Prediction→Action→Result chart, Personality Radar.
- Portfolio layer: real holdings, watchlist, core/swing/tactical/runner structure, risk alerts, trim targets, bottom-fishing candidates, sell-call/put candidates, AI journal and governance entry.


## 5. Stock Intelligence Page 必须覆盖

- Top-level total judgment with action, confidence cap, data freshness and action cap.
- Ticker profile: company, industry branch, tags, archetype, leadership/follower/laggard/meme classification.
- Position structure: Core / Swing / Tactical / Runner / Research, cost/profit/risk where available.
- Industry liquidity and capital migration path.
- Valuation / earnings / revisions / guidance / cash flow / SBC / moat / management quality.
- Gann Research Zone: Square of Nine levels, multi-anchor clusters, time windows, time-price resonance, anchor verification status.
- Price action execution: TCG 8/12 EMA, HH/HL vs LH/LL, inside bar, equilibrium, 1H/4H/daily/weekly confirmation.
- AVWAP zones: earnings AVWAP, major low/high AVWAP, reclaim/failure rules.
- RSI / momentum: oversold, overbought, divergence and mean reversion maturity.
- Options/Gamma/Event: call wall, put wall, IV, OPEX, earnings, conference, macro event pressure.
- Dark pool / flow / volume confirmation when available.
- Sector/liquidity/BTC/macro linkage.
- Event × Cycle Resonance.
- Stock Personality Radar: how this stock behaves in panic, breakout, post-earnings, peer rotation, hype phase.
- Hard evidence panel → AI synthesis score → operation strategy → dynamic tracking/review.
- Invalidation conditions and exact reasons to reduce, exit, wait, or build.


## 6. Gann / 江恩系统正本

- **Formula:** `target_price = (sqrt(base_price) ± angle/180)^2`
- **Angles:** 45, 90, 180, 270, 360, 720
- **Anchors:**
  - Market-recognized absolute high/low
  - Major earnings gap high/low/close
  - Major event extreme
  - Stage swing high/low confirmed by volume/failed retest
  - Multiple anchors calculated in parallel
- **Price Zone:** Levels are observation zones, not exact lines; default ±0.5% band unless ticker volatility demands otherwise.
- **Time Windows:** 7, 14, 21, 34, 55, 60, 90, 144, 180, 270, 360 days, 60 weeks, 20 months, 60 months
- **Confirmation Rule:** Only high-grade when Square-of-Nine 180°/360° price levels overlap 90/144/180/360 time windows and also confirm with RSI, AVWAP, volume, TCG price action, options/Gamma, event window and liquidity context.
- **Hard Guardrail:** Gann cannot trigger trades alone. Sample anchors cannot be used for formal trading until verified in Anchor Verification Checklist.


## 7. TCG / Price Action 执行层

- Use 8 EMA / 12 EMA as short-term momentum life lines.
- Strong uptrend: price above daily 8 EMA and 8 EMA > 12 EMA; 12 EMA pullback can be held if structure intact.
- Trend confirmation must use HH/HL and LH/LL.
- Inside bar / equilibrium compression waits for volume breakout, no random middle-zone action.
- 4H/daily RSI oversold or bullish divergence helps identify panic-reversal candidates.
- Right-side breakout = inside bar/equilibrium breakout with volume.
- Mean reversion = weekly bull structure intact, near weekly 12 EMA/AVWAP/Gann support, RSI oversold/divergent, 1H/4H volume reversal.
- Exit: far above 8 EMA + 4H 12 EMA tracking; daily break of 8/12 EMA plus LH+LL confirms trend damage.


## 8. 三维估值与基本面系统

- Macro liquidity / beta computer: 10Y, breadth, EPS revisions, liquidity and index risk.
- Duan Yongping style: good business, good price, cash flow, moat, management/culture, downside protection.
- DCF / FCF / EPS / SBC / margin / scenario valuation.
- Market consensus / AI cycle / PEG / industry multiple percentile / AI CapEx validation chain / institutional positioning / TAM end-state valuation.
- Slogan: 宏观定仓位、估值定胜率、财报定去留、周期定时机、期权定下限.


## 9. 风险管理与行为保护

- Risk system must protect actual holdings and actual P/L, not provide generic fear.
- System must highlight high-euphoria trim/exit warnings visually and decisively.
- Bottom-fishing allowed only when panic maturity is high, thesis intact, valuation compressed, Gann support/time window, RSI oversold/divergent, AVWAP/weekly 12 EMA support, volume exhaustion/reversal and sector liquidity not broken.
- Put is not default hedge for core holdings; user is less familiar with puts and often prefers selling calls in slow climbs or direct selling in extreme heat.
- Put candidates should be overextended/hottest/most expensive/gamma/IV/retail-extreme names, not reasonably valued core leaders unless thesis truly breaks.
- Risk engines: Panic Maturity Engine, Narrative Health Engine, Exit/Hedge Engine, Risk Training/Behavior Protection.
- Training must be based on user’s real positions and real reviews, not abstract horror scenarios.


## 10. v0.3A 每日使用工作流

- Open Master Index.
- Open Manual Data Workbook v0.2 unified workbook.
- Update Manual Inputs or import CSV.
- Check Priority Checklist and action caps.
- Add Evidence Packet entries with counter-evidence.
- Review Macro Event Calendar and No Attack days.
- Read Generated Brief / exported HTML Daily Brief.
- Use Peer Map for migration decisions.
- Open Gann Registry and ticker page.
- Open Anchor Verification before using any Gann levels.
- Only decide action after freshness, evidence, event, Gann, AVWAP/RSI/TCG and risk-stack gates are checked.


## 11. 数据与文件架构

- Master Index is the human entry point.
- JSON manifests are machine-readable source of truth for Codex and future app.
- HTML prototypes are visual/UI references.
- Excel workbooks are manual alpha control surfaces.
- CSV templates are semi-auto bridge.
- Python scripts are export/automation utilities.
- Codex handoff should convert these into a repository with React/Next/Vite components, local JSON/CSV loading and no live API until schema is stable.


## 12. 当前稳定 Artifact 状态

- **master_index_latest:** `amos_alpha_master_index_v0_5.html`
- **manual_workbook_latest:** `amos_manual_data_workbook_v0_2_unified.xlsx`
- **gann_registry_latest:** `amos_gann_live_ticker_registry_v0_4.html/json`
- **anchor_verification_latest:** `amos_gann_anchor_verification_checklist_v0_2.xlsx`
- **csv_import_schema:** `amos_csv_import_schema_v0_1.xlsx`
- **data_source_map:** `amos_real_market_data_source_map_v0_1.xlsx`
- **macro_calendar:** `amos_macro_event_calendar_manual_input_v0_1.xlsx`
- **daily_brief_exporter:** `amos_daily_brief_html_exporter_v0_2.py`
- **stock_pages_latest:**
  - nvda_stock_page_gann_registry_v0_6.html
  - crdo_stock_page_gann_registry_v0_6.html
  - lite_stock_page_gann_registry_v0_6.html
  - iren_stock_page_gann_registry_v0_6.html
  - hood_stock_page_gann_registry_v0_6.html


## 13. Codex 工程边界

- Do not connect live trading or brokerage.
- Do not imply data is live when using sample/manual-ready values.
- Do not allow Gann-only buy/sell triggers.
- Preserve all guardrails and action caps in code, not just UI text.
- Implement local JSON/CSV-driven app first.
- Add tests for data freshness caps, Gann anchor verification gates, No Attack event gating and missing-data behavior.
- Every generated page/component must show data freshness and sample-data warning where applicable.


## 14. /mnt/data Artifact Inventory Snapshot

- Total AMOS-related files scanned: **229**
- `csv`: 4 files
- `html`: 92 files
- `json`: 61 files
- `md`: 60 files
- `py`: 1 files
- `xlsx`: 11 files


## 15. No-Omission Rule

后续任何重构、工程迁移、页面重写、数据 schema 调整，都必须先对照 `AMOS No-Omission Master Checklist v0.1`。  
如果新设计没有覆盖这些稳定模块，默认视为回退或遗漏，而不是“简化”。