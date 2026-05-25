# AMOS IREN Gann Engine v0.1

这是 IREN 的独立江恩模块。  
当前是 sample/manual-ready，不是实时行情，也不是交易建议。

## 当前样本

- Ticker: IREN
- Sample current price: 12.5
- Current date: 2026-05-24
- Data quality: sample/manual-ready, not live

## 当前分数

```text
Gann Price Score = 22
Gann Time Score = 62
Unified Gann Resonance Score = 37
Resonance State = no_actionable_resonance
```

## 最近支撑

```json
{
  "direction": "up",
  "angle": 45,
  "level": 11.49,
  "band_low": 11.44,
  "band_high": 11.55,
  "ticker": "IREN",
  "anchor_id": "iren_sample_ai_compute_reprice_2025_11_10",
  "anchor_type": "sample_ai_compute_reprice",
  "anchor_date": "2025-11-10",
  "anchor_price": 9.86,
  "anchor_quality_score": 64,
  "distance_pct": -8.08,
  "abs_distance_pct": 8.08,
  "in_observation_band": false
}
```

## 最近压力

```json
{
  "direction": "down",
  "angle": 90,
  "level": 13.08,
  "band_low": 13.02,
  "band_high": 13.15,
  "ticker": "IREN",
  "anchor_id": "iren_sample_swing_high_2026_02_20",
  "anchor_type": "sample_swing_high",
  "anchor_date": "2026-02-20",
  "anchor_price": 16.95,
  "anchor_quality_score": 70,
  "distance_pct": 4.64,
  "abs_distance_pct": 4.64,
  "in_observation_band": false
}
```

## 最近价格密集区

```json
{
  "cluster_center": 21.43,
  "cluster_low": 21.32,
  "cluster_high": 21.53,
  "member_count": 2,
  "avg_anchor_quality": 67.0,
  "distance_pct": 71.44,
  "abs_distance_pct": 71.44,
  "members": [
    {
      "direction": "up",
      "angle": 90,
      "level": 21.32,
      "band_low": 21.21,
      "band_high": 21.42,
      "ticker": "IREN",
      "anchor_id": "iren_sample_swing_high_2026_02_20",
      "anchor_type": "sample_swing_high",
      "anchor_date": "2026-02-20",
      "anchor_price": 16.95,
      "anchor_quality_score": 70,
      "distance_pct": 70.56,
      "abs_distance_pct": 70.56,
      "in_observation_band": false
    },
    {
      "direction": "up",
      "angle": 270,
      "level": 21.53,
      "band_low": 21.42,
      "band_high": 21.64,
      "ticker": "IREN",
      "anchor_id": "iren_sample_ai_compute_reprice_2025_11_10",
      "anchor_type": "sample_ai_compute_reprice",
      "anchor_date": "2025-11-10",
      "anchor_price": 9.86,
      "anchor_quality_score": 64,
      "distance_pct": 72.24,
      "abs_distance_pct": 72.24,
      "in_observation_band": false
    }
  ]
}
```

## 最近时间密集区

```json
{
  "cluster_center_date": "2026-04-03",
  "member_count": 2,
  "avg_anchor_quality": 66.0,
  "nearest_abs_days": 51,
  "cluster_score": 0,
  "members": [
    {
      "ticker": "IREN",
      "anchor_id": "iren_sample_major_low_2025_04_07",
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
      "ticker": "IREN",
      "anchor_id": "iren_sample_ai_compute_reprice_2025_11_10",
      "anchor_type": "sample_ai_compute_reprice",
      "anchor_date": "2025-11-10",
      "anchor_quality_score": 64,
      "window_days": 144,
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
- BTC/miner correlation data not connected

## IREN 专属规则

- IREN 不是纯 AI 股，必须按 BTC/miner + AI compute transition 来评分。
- Gann 不能单独触发交易。
- Build 需要：Gann支撑/时间 + BTC结构 + miner basket RS + AVWAP/TCG确认。
- Trim Watch 需要：Gann压力/时间 + BTC走弱、稀释风险、AI compute叙事失败或量能衰竭。
- 样本锚点必须被真实图表验证后才能正式使用。
