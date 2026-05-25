# AMOS HOOD Gann Engine v0.1

这是 HOOD 的独立江恩模块。  
当前是 sample/manual-ready，不是实时行情，也不是交易建议。

## 当前样本

- Ticker: HOOD
- Sample current price: 72.0
- Current date: 2026-05-24
- Data quality: sample/manual-ready, not live

## 当前分数

```text
Gann Price Score = 31
Gann Time Score = 48
Unified Gann Resonance Score = 37
Resonance State = no_actionable_resonance
```

## 最近支撑

```json
{
  "direction": "down",
  "angle": 180,
  "level": 69.12,
  "band_low": 68.78,
  "band_high": 69.47,
  "ticker": "HOOD",
  "anchor_id": "hood_sample_swing_high_2026_02_18",
  "anchor_type": "sample_swing_high",
  "anchor_date": "2026-02-18",
  "anchor_price": 86.75,
  "anchor_quality_score": 70,
  "distance_pct": -4.0,
  "abs_distance_pct": 4.0,
  "in_observation_band": false
}
```

## 最近压力

```json
{
  "direction": "up",
  "angle": 180,
  "level": 74.68,
  "band_low": 74.31,
  "band_high": 75.06,
  "ticker": "HOOD",
  "anchor_id": "hood_sample_btc_fintech_reprice_2025_11_12",
  "anchor_type": "sample_btc_fintech_reprice",
  "anchor_date": "2025-11-12",
  "anchor_price": 58.4,
  "anchor_quality_score": 65,
  "distance_pct": 3.72,
  "abs_distance_pct": 3.72,
  "in_observation_band": false
}
```

## 最近价格密集区

```json
{
  "cluster_center": 95.78,
  "cluster_low": 95.26,
  "cluster_high": 96.31,
  "member_count": 2,
  "avg_anchor_quality": 69.0,
  "distance_pct": 33.03,
  "abs_distance_pct": 33.03,
  "members": [
    {
      "direction": "up",
      "angle": 720,
      "level": 95.26,
      "band_low": 94.79,
      "band_high": 95.74,
      "ticker": "HOOD",
      "anchor_id": "hood_sample_major_low_2025_04_07",
      "anchor_type": "sample_major_low",
      "anchor_date": "2025-04-07",
      "anchor_price": 33.18,
      "anchor_quality_score": 68,
      "distance_pct": 32.31,
      "abs_distance_pct": 32.31,
      "in_observation_band": false
    },
    {
      "direction": "up",
      "angle": 90,
      "level": 96.31,
      "band_low": 95.83,
      "band_high": 96.8,
      "ticker": "HOOD",
      "anchor_id": "hood_sample_swing_high_2026_02_18",
      "anchor_type": "sample_swing_high",
      "anchor_date": "2026-02-18",
      "anchor_price": 86.75,
      "anchor_quality_score": 70,
      "distance_pct": 33.76,
      "abs_distance_pct": 33.76,
      "in_observation_band": false
    }
  ]
}
```

## 最近时间密集区

```json
{
  "cluster_center_date": "2026-04-04",
  "member_count": 3,
  "avg_anchor_quality": 67.7,
  "nearest_abs_days": 49,
  "cluster_score": 0,
  "members": [
    {
      "ticker": "HOOD",
      "anchor_id": "hood_sample_major_low_2025_04_07",
      "anchor_type": "sample_major_low",
      "anchor_date": "2025-04-07",
      "anchor_quality_score": 68,
      "window_days": 360,
      "target_date": "2026-04-02",
      "days_to_window": -52,
      "abs_days_to_window": 52,
      "in_time_observation_band": false,
      "window_importance": "high",
      "time_window_score": 0
    },
    {
      "ticker": "HOOD",
      "anchor_id": "hood_sample_swing_high_2026_02_18",
      "anchor_type": "sample_swing_high",
      "anchor_date": "2026-02-18",
      "anchor_quality_score": 70,
      "window_days": 45,
      "target_date": "2026-04-04",
      "days_to_window": -50,
      "abs_days_to_window": 50,
      "in_time_observation_band": false,
      "window_importance": "normal",
      "time_window_score": 0
    },
    {
      "ticker": "HOOD",
      "anchor_id": "hood_sample_btc_fintech_reprice_2025_11_12",
      "anchor_type": "sample_btc_fintech_reprice",
      "anchor_date": "2025-11-12",
      "anchor_quality_score": 65,
      "window_days": 144,
      "target_date": "2026-04-05",
      "days_to_window": -49,
      "abs_days_to_window": 49,
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
- BTC/crypto activity data not connected
- Regulatory/news risk feed not connected

## HOOD 专属规则

- HOOD 是 BTC/fintech/trading activity proxy，不是纯软件股。
- Gann 不能单独触发交易。
- Build 需要：Gann支撑/时间 + BTC结构 + 交易活跃度 + 监管平静 + AVWAP/TCG确认。
- Trim Watch 需要：Gann压力/时间 + BTC走弱、监管压力、交易活跃度下滑或 good-news fade。
- 样本锚点必须被真实图表验证后才能正式使用。
