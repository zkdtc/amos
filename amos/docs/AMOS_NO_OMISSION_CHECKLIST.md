# AMOS No-Omission Master Checklist v0.1

用于后续所有工程迁移、重构、页面转换、Codex 任务的防遗漏清单。


## Product Identity

- [ ] AMOS is personal AI Market Operating System, not generic dashboard.
- [ ] 整合，不是推翻.
- [ ] v0.3A Manual Data Alpha is current phase.
- [ ] All sample/manual-ready data must be labeled.

## User Risk Profile

- [ ] User prefers high-growth U.S. equities around hard AI, AI infrastructure, compute, optical, defense, space, BTC/fintech, robotics, quantum and selected AI healthcare/biotech.
- [ ] User has historically made large mistakes by adding leverage, holding winners too long, failing to take profits at tops, and capitulating after forced liquidation.
- [ ] User is good at RSI oversold / key-level rebound trades and often takes 10%-20% rebound profits.
- [ ] Primary improvement target: cycle rhythm — when to attack, shrink, hold only core, avoid bottom-fishing, rotate, hedge or go to cash.
- [ ] System must protect the user at euphoric tops with loud, visible, decisive trim/exit/sell-call warnings.
- [ ] System must distinguish Core / Swing / Tactical / Runner / Research positions and must use actual holdings and actions whenever available.
- [ ] System must not become a generic dashboard; it must be personalized to user’s watchlist, mistakes, strengths, family/attention constraints and long-term compounding goal.

## Home Command Center

- [ ] Macro liquidity / mechanical flow layer: CTA, pension rebalance, dealer gamma, prime brokerage/HF exposure, put/call, 0DTE, VIX/VVIX/MOVE, 10Y, DXY, BTC, credit spreads, breadth, Mag7 vs equal weight.
- [ ] Mechanical dates: weekly/monthly/quarterly OPEX, triple/quad witching, ETF/index rebalance, month-end/quarter-end pension flows, FOMC/CPI/PCE/NFP/ISM/JOLTS/jobless claims, Fed minutes/dot plot, Treasury auctions, TGA/debt ceiling/fiscal events.
- [ ] Leadership and sector map: AI Infra, Optical/CPO, AI Software/Agent, Power/Cooling, Robotics, Space, Biotech/AI healthcare, Quantum, Fintech/BTC finance, BTC miners/compute, Gaming/education/consumer AI, Defense, AI Meme high-volatility pool.
- [ ] Political/geopolitical layer: tariffs, export controls, wars/ceasefire, fiscal stimulus, regulation, president/treasury/Fed official comments/posts.
- [ ] Visual layer: macro liquidity chart, mechanical date axis, SPY/QQQ/SMH Gamma Map, sector rotation heatmap, leadership graph, stock correlation network, Gann Time Wheel, Event × Cycle Resonance Chart, Portfolio Battle Map, Prediction→Action→Result chart, Personality Radar.
- [ ] Portfolio layer: real holdings, watchlist, core/swing/tactical/runner structure, risk alerts, trim targets, bottom-fishing candidates, sell-call/put candidates, AI journal and governance entry.

## Stock Page

- [ ] Top-level total judgment with action, confidence cap, data freshness and action cap.
- [ ] Ticker profile: company, industry branch, tags, archetype, leadership/follower/laggard/meme classification.
- [ ] Position structure: Core / Swing / Tactical / Runner / Research, cost/profit/risk where available.
- [ ] Industry liquidity and capital migration path.
- [ ] Valuation / earnings / revisions / guidance / cash flow / SBC / moat / management quality.
- [ ] Gann Research Zone: Square of Nine levels, multi-anchor clusters, time windows, time-price resonance, anchor verification status.
- [ ] Price action execution: TCG 8/12 EMA, HH/HL vs LH/LL, inside bar, equilibrium, 1H/4H/daily/weekly confirmation.
- [ ] AVWAP zones: earnings AVWAP, major low/high AVWAP, reclaim/failure rules.
- [ ] RSI / momentum: oversold, overbought, divergence and mean reversion maturity.
- [ ] Options/Gamma/Event: call wall, put wall, IV, OPEX, earnings, conference, macro event pressure.
- [ ] Dark pool / flow / volume confirmation when available.
- [ ] Sector/liquidity/BTC/macro linkage.
- [ ] Event × Cycle Resonance.
- [ ] Stock Personality Radar: how this stock behaves in panic, breakout, post-earnings, peer rotation, hype phase.
- [ ] Hard evidence panel → AI synthesis score → operation strategy → dynamic tracking/review.
- [ ] Invalidation conditions and exact reasons to reduce, exit, wait, or build.

## Gann

- [ ] Square of Nine formula preserved.
- [ ] Multi-anchor design preserved.
- [ ] ±0.5% zone preserved.
- [ ] Time windows preserved.
- [ ] Anchor Verification required.
- [ ] Gann cannot trade alone.

## Execution

- [ ] Use 8 EMA / 12 EMA as short-term momentum life lines.
- [ ] Strong uptrend: price above daily 8 EMA and 8 EMA > 12 EMA; 12 EMA pullback can be held if structure intact.
- [ ] Trend confirmation must use HH/HL and LH/LL.
- [ ] Inside bar / equilibrium compression waits for volume breakout, no random middle-zone action.
- [ ] 4H/daily RSI oversold or bullish divergence helps identify panic-reversal candidates.
- [ ] Right-side breakout = inside bar/equilibrium breakout with volume.
- [ ] Mean reversion = weekly bull structure intact, near weekly 12 EMA/AVWAP/Gann support, RSI oversold/divergent, 1H/4H volume reversal.
- [ ] Exit: far above 8 EMA + 4H 12 EMA tracking; daily break of 8/12 EMA plus LH+LL confirms trend damage.

## Risk

- [ ] Risk system must protect actual holdings and actual P/L, not provide generic fear.
- [ ] System must highlight high-euphoria trim/exit warnings visually and decisively.
- [ ] Bottom-fishing allowed only when panic maturity is high, thesis intact, valuation compressed, Gann support/time window, RSI oversold/divergent, AVWAP/weekly 12 EMA support, volume exhaustion/reversal and sector liquidity not broken.
- [ ] Put is not default hedge for core holdings; user is less familiar with puts and often prefers selling calls in slow climbs or direct selling in extreme heat.
- [ ] Put candidates should be overextended/hottest/most expensive/gamma/IV/retail-extreme names, not reasonably valued core leaders unless thesis truly breaks.
- [ ] Risk engines: Panic Maturity Engine, Narrative Health Engine, Exit/Hedge Engine, Risk Training/Behavior Protection.
- [ ] Training must be based on user’s real positions and real reviews, not abstract horror scenarios.

## Workflow

- [ ] Open Master Index.
- [ ] Open Manual Data Workbook v0.2 unified workbook.
- [ ] Update Manual Inputs or import CSV.
- [ ] Check Priority Checklist and action caps.
- [ ] Add Evidence Packet entries with counter-evidence.
- [ ] Review Macro Event Calendar and No Attack days.
- [ ] Read Generated Brief / exported HTML Daily Brief.
- [ ] Use Peer Map for migration decisions.
- [ ] Open Gann Registry and ticker page.
- [ ] Open Anchor Verification before using any Gann levels.
- [ ] Only decide action after freshness, evidence, event, Gann, AVWAP/RSI/TCG and risk-stack gates are checked.

## Engineering

- [ ] Do not connect live trading or brokerage.
- [ ] Do not imply data is live when using sample/manual-ready values.
- [ ] Do not allow Gann-only buy/sell triggers.
- [ ] Preserve all guardrails and action caps in code, not just UI text.
- [ ] Implement local JSON/CSV-driven app first.
- [ ] Add tests for data freshness caps, Gann anchor verification gates, No Attack event gating and missing-data behavior.
- [ ] Every generated page/component must show data freshness and sample-data warning where applicable.