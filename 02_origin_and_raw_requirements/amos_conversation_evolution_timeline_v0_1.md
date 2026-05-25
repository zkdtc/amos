# AMOS Conversation Evolution Timeline v0.1

这是一条高层推进时间线，用于让工程师理解 AMOS 的演化，而不是重复 1-65 交付清单。

## Stage 1: 投资问题不是缺信息，而是缺一个能保护真实决策的系统

最初的核心不是做一个普通股票页面，而是用户在高波动成长股、AI周期、光模块、BTC/fintech、硬科技龙头中，需要一个能帮助判断周期、资金迁移、估值、风险、买卖节奏和心理纪律的个人化系统。

**Engineering implication:** 工程师必须明白 AMOS 不是资讯聚合器，也不是股票价格看板。它是用户的认知与操作系统，要围绕真实持仓、真实风险、真实错误和真实行动建议设计。

## Stage 2: 用户反复强调：需要 B，不是陪伴聊天，而是工程化搭建和验证

对话中用户明确指出，她要的是主动搭建、结构化、验证和交付，而不是不断问她要资料、让她确认所有证据，或把 AI 定位为陪伴者。AMOS 因此转向持续交付 artifacts、系统主干和工程化文件。

**Engineering implication:** 工程师接手时不能把需求理解成‘写一些投资笔记’。需要把每个概念落实到页面、数据字段、规则、导入表、护栏和测试。

## Stage 3: 核心设计原则锁定：整合，不是推翻

用户明确要求所有新资料用于归类、抽象、收敛和优化已有主干，不允许听到新想法就推翻结构，也不允许为了简化而删除已经确认的模块。

**Engineering implication:** 任何重构或工程迁移都必须用 No-Omission Checklist 对照。缺失不是简化，而是回退。

## Stage 4: AMOS 从理念变成 Home Command Center + Stock Intelligence Page

系统主干逐渐稳定为：主页战情室负责宏观、流动性、机械资金、行业轮动、事件日历、组合风险；个股页负责标签、龙头定位、Gann、价格行为、AVWAP、RSI、Gamma、估值、证据、风险和操作策略。

**Engineering implication:** 工程师要先实现这些结构与信息层级，而不是先做漂亮图表或实时价格。

## Stage 5: Gann / 江恩成为不可简化的核心研究区

用户强调江恩是最依赖的工具之一，不能简化成几条支撑压力线。系统必须有独立 Gann Research Zone，包含 Square of Nine、多锚点、价格区间、时间窗、价格×时间共振、确认门和锚点验证。

**Engineering implication:** Gann 页面必须深，不允许只显示 support/resistance。并且所有 sample anchors 必须通过 Anchor Verification 才能正式使用。

## Stage 6: TCG / Price Action 与 AVWAP 成为执行确认层

The Chart Guys 的 8/12 EMA、HH/HL、LH/LL、Inside Bar、Equilibrium、RSI背离/超卖，用于确认趋势、突破、回调、出场和防接飞刀。AVWAP 用于判断机构成本和事件后 reclaim/failure。

**Engineering implication:** 工程师应把这些做成执行层组件和字段，而不是把它们混成普通技术指标。

## Stage 7: 风险系统必须围绕用户的真实弱点：高位不止盈、底部爆仓、杠杆、周期误判

AMOS 要在高位狂热时强提醒减仓/卖出/卖 Call，在恐慌成熟时帮助分批试仓，在周期不明或数据缺失时限制攻击。风险不是泛泛提醒，而是具体作用在行动上限。

**Engineering implication:** 工程里要有 Action Cap、Data Freshness Cap、Event No Attack、Anchor Verification Gate、Evidence Gate。不能只用 UI 文案提醒。

## Stage 8: 系统转为 v0.3A Manual Data Alpha，而不是直接接实时 API

为了避免过早工程化和假实时，AMOS 先建立手动工作流：Manual Data Workbook、CSV Import Schema、Evidence Packet、Generated Brief、Macro Event Calendar、Daily Brief Exporter。

**Engineering implication:** 工程第一版必须 local JSON/CSV driven。不能一上来接 API、券商或交易。先保证结构、字段、护栏、流程和测试正确。

## Stage 9: 进入工程交接：正本规格、工程交接包、Codex 任务包

在第 62-65 交付后，AMOS 已形成 Canonical Spec、No-Omission Checklist、Engineering Handoff、Codex Task Pack、Master Index v0.6，可以交给工程师/Codex 开始本地 Web App 原型。

**Engineering implication:** 工程师应从第 65 和第 66 文件开始读，必要时再进入具体 artifacts。
