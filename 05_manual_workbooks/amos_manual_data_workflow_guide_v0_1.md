# AMOS Manual Data Workflow Guide v0.1

这是 AMOS v0.3A Manual Data Alpha 的每日操作手册。

核心原则：

> 先让 AMOS 用手动数据跑起来，再接半自动和实时数据。  
> 手动数据可以用，但缺失数据必须降低置信度。

---

## 每日工作流

### 1. 打开总入口

文件：

`amos_alpha_master_index_v0_3.html`

目的：不要在一堆散文件里迷路。

---

### 2. 打开最新手动工作簿

文件：

`amos_real_evidence_packet_template_v0_1.xlsx`

它目前包含：

- Manual Inputs
- Generated Brief
- Priority Checklist v0.1
- Evidence Packet v0.1
- Evidence Packet Guide

---

### 3. 更新 Manual Inputs

优先更新 P0 / P1 标的。

最低字段：

- Last Price
- RSI 14D
- 8 EMA State
- 12 EMA State
- Trend Structure
- RS vs QQQ
- AVWAP Status
- Gann Zone
- Nearest Gann Support
- Nearest Gann Resistance
- Next Event
- Event Pressure
- Action Bias
- Invalidation
- Data Freshness

---

### 4. 检查 Priority Checklist

Action Cap 规则：

| Missing Must-have | Confidence Cap | Action Cap |
|---|---:|---|
| 0 | 80 | No Cap |
| 1-2 | 60 | Build/Hold Only |
| 3-4 | 45 | No Attack |
| 5+ | 30 | Wait Only |

---

### 5. 增加 Evidence Packet

任何观点进入 AMOS 前都要变成证据包，包括：

- 新闻
- 财报结论
- 博主观点
- 用户观察
- 书中框架
- 市场异动

必须写：

- Claim
- Claim Type
- Evidence Quality
- Bias Risk
- Counter Evidence
- What Would Prove It Wrong
- Final Evidence Score
- Action Gate

---

### 6. 阅读 Generated Brief

先读日报，再操作。

日报包含：

- Executive Summary
- Action Buckets
- Risk Alerts
- Ticker Brief Lines
- No-Trade Rules

---

### 7. 使用 Peer Map 做迁移判断

文件：

`amos_crdo_peer_map_v0_1.xlsx`

用于 CRDO / LITE / COHR / NVDA / AVGO / ANET 之间的迁移判断。

迁移前必须回答：

- 触发条件是什么？
- 确认条件是什么？
- 什么情况下不能迁移？
- 迁移后仓位角色是什么？

---

### 8. 打开个股页 / Gann Auto Page

文件：

`amos_generic_page_gann_auto_insertion_v0_2.html`

只有在日报和 Peer Map 看完后，再打开个股页做细节判断。

---

## 行动规则

### Attack

允许条件：

- 数据新鲜
- Action Cap = No Cap
- 宏观不禁止高 Beta
- RS vs QQQ / peers 改善
- 有技术确认
- 有失效条件

禁止条件：

- P0 必填字段缺失
- 无失效条件
- 只有 Gann 信号
- 高事件压力但无确认
- 追已经错过的大涨

---

### Build

允许条件：

- Action Cap 至少是 Build/Hold Only
- Setup 有确认
- Panic maturity 或趋势延续成立
- 分批仓位

禁止条件：

- Risk Stack 高且继续上升
- AVWAP 失守
- RS 走弱
- 无止损/失效条件

---

### Hold

允许条件：

- Thesis intact
- Structure intact
- Invalidation 未触发
- Risk acceptable

禁止条件：

- 基本面 thesis 破坏
- 结构转为 LH/LL
- AVWAP 失守且 reclaim 失败
- Evidence packet 被否定

---

### Trim Watch

进入条件：

- Risk Stack 高
- Narrative maturity 高
- Gann pressure/time window active
- RSI 超买或量能衰竭
- Event pressure elevated

真正 Trim 需要：

- AVWAP / EMA 破位
- Failed new high / LH 出现
- Volume divergence
- Good-news fade
- Gamma / event pressure confirmed

---

### Wait

必须 Wait 的情况：

- 数据缺失
- Action cap = Wait Only
- 没有 setup
- 只有叙事兴奋
- 用户观察没有证据包

---

## No-Trade Rules

- No leverage.
- No action without invalidation.
- No chasing after missed move.
- Gann cannot act alone.
- Headline dip is not panic maturity.
- Do not turn failed swing into core.
- Do not let one blogger/source override data.
- If data freshness is Missing, no aggressive action.

---

## 周末工作流

- Review Prediction → Action → Result.
- Update Evidence Packet status.
- Re-score source quality.
- Review P0/P1/P2 priority.
- Prepare next week's event calendar.
- Clean watchlist to avoid attention dilution.
