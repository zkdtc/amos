# AMOS Gann Time Distance Engine v0.3

这是 Gann 模块的第三版：  
在价格距离之外，加入“当前日期距离关键江恩时间窗口还有多久、是否进入时间观察带、是否形成多锚点时间密集区”。

注意：当前日期和 CRDO 锚点仍是 sample-only，不是实时交易建议。

---

## 当前样本

- Ticker: `CRDO`
- Current date: `2026-05-24`
- Observation band: `±3 calendar days`
- Calendar mode: `calendar_days_sample`
- Trading-day mode: `not yet implemented`

---

## 默认时间窗口

```text
7 / 14 / 21 / 34 / 45 / 55 / 60 / 90 / 144 / 180 / 270 / 360 days
```

高权重窗口：

```text
34 / 55 / 90 / 144 / 180 / 360 days
```

---

## 新增能力

### 1. Active Time Observation Band
如果当前日期进入某个锚点的 ±3 天时间窗，标记为 active。

### 2. Nearest Absolute Window
找出离当前日期最近的所有江恩时间窗口。

### 3. Upcoming Window
列出未来最近的时间窗口。

### 4. Time Cluster
如果多个锚点的时间窗口集中在 ±3 天内，形成 time cluster。

### 5. Gann Time Score

初始公式：

```text
Gann Time Score =
0.40 × Best Time Window Score
+ 0.30 × Cluster Score
+ 0.20 × Active Band Score
+ 0.10 × Anchor Quality Near
```

当前样本分数：

```text
Gann Time Score = -7
Resonance Zone = no_nearby_gann_time_edge
```

---

## 当前最近时间窗口

```json
[
  {
    "ticker": "CRDO",
    "anchor_id": "crdo_sample_earnings_gap_2025_12_02",
    "anchor_type": "sample_earnings_gap",
    "anchor_date": "2025-12-02",
    "anchor_quality_score": 64,
    "window_days": 180,
    "target_date": "2026-05-31",
    "days_to_window": 7,
    "abs_days_to_window": 7,
    "in_time_observation_band": false,
    "window_importance": "high",
    "time_window_score": 51
  },
  {
    "ticker": "CRDO",
    "anchor_id": "crdo_sample_major_high_2026_02_14",
    "anchor_type": "sample_major_high",
    "anchor_date": "2026-02-14",
    "anchor_quality_score": 68,
    "window_days": 90,
    "target_date": "2026-05-15",
    "days_to_window": -9,
    "abs_days_to_window": 9,
    "in_time_observation_band": false,
    "window_importance": "high",
    "time_window_score": 32
  },
  {
    "ticker": "CRDO",
    "anchor_id": "crdo_sample_earnings_gap_2025_12_02",
    "anchor_type": "sample_earnings_gap",
    "anchor_date": "2025-12-02",
    "anchor_quality_score": 64,
    "window_days": 144,
    "target_date": "2026-04-25",
    "days_to_window": -29,
    "abs_days_to_window": 29,
    "in_time_observation_band": false,
    "window_importance": "high",
    "time_window_score": 0
  },
  {
    "ticker": "CRDO",
    "anchor_id": "crdo_sample_major_high_2026_02_14",
    "anchor_type": "sample_major_high",
    "anchor_date": "2026-02-14",
    "anchor_quality_score": 68,
    "window_days": 60,
    "target_date": "2026-04-15",
    "days_to_window": -39,
    "abs_days_to_window": 39,
    "in_time_observation_band": false,
    "window_importance": "normal",
    "time_window_score": 0
  },
  {
    "ticker": "CRDO",
    "anchor_id": "crdo_sample_major_high_2026_02_14",
    "anchor_type": "sample_major_high",
    "anchor_date": "2026-02-14",
    "anchor_quality_score": 68,
    "window_days": 55,
    "target_date": "2026-04-10",
    "days_to_window": -44,
    "abs_days_to_window": 44,
    "in_time_observation_band": false,
    "window_importance": "high",
    "time_window_score": 0
  }
]
```

## 当前最近时间密集区

```json
{
  "cluster_center_date": "2026-04-02",
  "member_count": 2,
  "avg_anchor_quality": 70.0,
  "nearest_abs_days": 52,
  "cluster_score": -147,
  "members": [
    {
      "ticker": "CRDO",
      "anchor_id": "crdo_sample_major_high_2026_02_14",
      "anchor_type": "sample_major_high",
      "anchor_date": "2026-02-14",
      "anchor_quality_score": 68,
      "window_days": 45,
      "target_date": "2026-03-31",
      "days_to_window": -54,
      "abs_days_to_window": 54,
      "in_time_observation_band": false,
      "window_importance": "normal",
      "time_window_score": 0
    },
    {
      "ticker": "CRDO",
      "anchor_id": "crdo_sample_major_low_2025_04_07",
      "anchor_type": "sample_major_low",
      "anchor_date": "2025-04-07",
      "anchor_quality_score": 72,
      "window_days": 360,
      "target_date": "2026-04-02",
      "days_to_window": -52,
      "abs_days_to_window": 52,
      "in_time_observation_band": false,
      "window_importance": "high",
      "time_window_score": 0
    }
  ]
}
```

---

## 规则

- 进入时间观察带，不代表自动买卖。
- 时间窗口必须与价格位、AVWAP、RSI、TCG结构、Gamma、事件窗口共同验证。
- 后续必须加入 trading-day mode，因为交易日与自然日会影响短周期判断。
