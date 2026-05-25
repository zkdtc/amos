# AMOS LITE Gann Engine v0.1

这是 LITE 的独立江恩模块。  
当前是 sample/manual-ready，不是实时行情，也不是交易建议。

## 当前样本

- Ticker: LITE
- Sample current price: 91.0
- Current date: 2026-05-24
- Data quality: sample/manual-ready, not live

## 当前分数

```text
Gann Price Score = 30
Gann Time Score = 33
Unified Gann Resonance Score = 33
Resonance State = no_actionable_resonance
```

## 最近支撑

```json
{
  "direction": "up",
  "angle": 90,
  "level": 87.45,
  "band_low": 87.01,
  "band_high": 87.89,
  "ticker": "LITE",
  "anchor_id": "lite_sample_earnings_gap_2025_11_07",
  "anchor_type": "sample_earnings_gap",
  "anchor_date": "2025-11-07",
  "anchor_price": 78.35,
  "anchor_quality_score": 66,
  "distance_pct": -3.9,
  "abs_distance_pct": 3.9,
  "in_observation_band": false
}
```

## 最近压力

```json
{
  "direction": "down",
  "angle": 90,
  "level": 96.62,
  "band_low": 96.14,
  "band_high": 97.1,
  "ticker": "LITE",
  "anchor_id": "lite_sample_swing_high_2026_03_18",
  "anchor_type": "sample_swing_high",
  "anchor_date": "2026-03-18",
  "anchor_price": 106.7,
  "anchor_quality_score": 70,
  "distance_pct": 6.18,
  "abs_distance_pct": 6.18,
  "in_observation_band": false
}
```

## 最近价格密集区

```json
{
  "cluster_center": 87.25,
  "cluster_low": 87.04,
  "cluster_high": 87.45,
  "member_count": 2,
  "avg_anchor_quality": 68.0,
  "distance_pct": -4.12,
  "abs_distance_pct": 4.12,
  "members": [
    {
      "direction": "down",
      "angle": 180,
      "level": 87.04,
      "band_low": 86.61,
      "band_high": 87.48,
      "ticker": "LITE",
      "anchor_id": "lite_sample_swing_high_2026_03_18",
      "anchor_type": "sample_swing_high",
      "anchor_date": "2026-03-18",
      "anchor_price": 106.7,
      "anchor_quality_score": 70,
      "distance_pct": -4.35,
      "abs_distance_pct": 4.35,
      "in_observation_band": false
    },
    {
      "direction": "up",
      "angle": 90,
      "level": 87.45,
      "band_low": 87.01,
      "band_high": 87.89,
      "ticker": "LITE",
      "anchor_id": "lite_sample_earnings_gap_2025_11_07",
      "anchor_type": "sample_earnings_gap",
      "anchor_date": "2025-11-07",
      "anchor_price": 78.35,
      "anchor_quality_score": 66,
      "distance_pct": -3.9,
      "abs_distance_pct": 3.9,
      "in_observation_band": false
    }
  ]
}
```

## 最近时间密集区

```json
{
  "cluster_center_date": "2026-04-01",
  "member_count": 3,
  "avg_anchor_quality": 69.3,
  "nearest_abs_days": 51,
  "cluster_score": 0,
  "members": [
    {
      "ticker": "LITE",
      "anchor_id": "lite_sample_earnings_gap_2025_11_07",
      "anchor_type": "sample_earnings_gap",
      "anchor_date": "2025-11-07",
      "anchor_quality_score": 66,
      "window_days": 144,
      "target_date": "2026-03-31",
      "days_to_window": -54,
      "abs_days_to_window": 54,
      "in_time_observation_band": false,
      "window_importance": "high",
      "time_window_score": 0
    },
    {
      "ticker": "LITE",
      "anchor_id": "lite_sample_swing_high_2026_03_18",
      "anchor_type": "sample_swing_high",
      "anchor_date": "2026-03-18",
      "anchor_quality_score": 70,
      "window_days": 14,
      "target_date": "2026-04-01",
      "days_to_window": -53,
      "abs_days_to_window": 53,
      "in_time_observation_band": false,
      "window_importance": "normal",
      "time_window_score": 0
    },
    {
      "ticker": "LITE",
      "anchor_id": "lite_sample_major_low_2025_04_08",
      "anchor_type": "sample_major_low",
      "anchor_date": "2025-04-08",
      "anchor_quality_score": 72,
      "window_days": 360,
      "target_date": "2026-04-03",
      "days_to_window": -51,
      "abs_days_to_window": 51,
      "in_time_observation_band": false,
      "window_importance": "high",
      "time_window_score": 0
    }
  ]
}
```

## 缺失确认门

- Live price not connected
- Verified anchors not confirmed
- AVWAP not connected
- RSI not connected
- Gamma/options not connected

## 规则

- LITE 是 Optical Recovery / AI Connectivity peer，必须和 CRDO / COHR / ANET / AVGO 比较。
- Gann 不能单独触发交易。
- Build 需要：Gann支撑/时间 + AVWAP reclaim + 相对 CRDO/COHR 的 RS 改善。
- Trim Watch 需要：Gann压力/时间 + reclaim失败、RS走弱或 guidance 变差。
- 样本锚点必须被真实图表验证后才能正式使用。
