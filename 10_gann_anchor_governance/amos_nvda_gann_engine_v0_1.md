# AMOS NVDA Gann Engine v0.1

这是 NVDA 的独立江恩模块。  
当前是 sample/manual-ready，不是实时行情，也不是交易建议。

## 当前样本

- Ticker: NVDA
- Sample current price: 141.0
- Current date: 2026-05-24
- Data quality: sample/manual-ready, not live

## 当前分数

```text
Gann Price Score = 65
Gann Time Score = 64
Unified Gann Resonance Score = 53
Resonance State = incomplete_resonance
```

## 最近支撑

```json
{
  "direction": "up",
  "angle": 90,
  "level": 137.07,
  "band_low": 136.38,
  "band_high": 137.75,
  "ticker": "NVDA",
  "anchor_id": "nvda_sample_earnings_gap_2025_08_28",
  "anchor_type": "sample_earnings_gap",
  "anchor_date": "2025-08-28",
  "anchor_price": 125.61,
  "anchor_quality_score": 68,
  "distance_pct": -2.79,
  "abs_distance_pct": 2.79,
  "in_observation_band": false
}
```

## 最近压力

```json
{
  "direction": "down",
  "angle": 90,
  "level": 141.01,
  "band_low": 140.3,
  "band_high": 141.71,
  "ticker": "NVDA",
  "anchor_id": "nvda_sample_major_high_2026_02_14",
  "anchor_type": "sample_major_high",
  "anchor_date": "2026-02-14",
  "anchor_price": 153.13,
  "anchor_quality_score": 72,
  "distance_pct": 0.01,
  "abs_distance_pct": 0.01,
  "in_observation_band": true
}
```

## 最近价格密集区

```json
null
```

## 最近时间密集区

```json
{
  "cluster_center_date": "2026-04-02",
  "member_count": 2,
  "avg_anchor_quality": 73.5,
  "nearest_abs_days": 52,
  "cluster_score": 0,
  "members": [
    {
      "ticker": "NVDA",
      "anchor_id": "nvda_sample_major_high_2026_02_14",
      "anchor_type": "sample_major_high",
      "anchor_date": "2026-02-14",
      "anchor_quality_score": 72,
      "window_days": 45,
      "target_date": "2026-03-31",
      "days_to_window": -54,
      "abs_days_to_window": 54,
      "in_time_observation_band": false,
      "window_importance": "normal",
      "time_window_score": 0
    },
    {
      "ticker": "NVDA",
      "anchor_id": "nvda_sample_major_low_2025_04_07",
      "anchor_type": "sample_major_low",
      "anchor_date": "2025-04-07",
      "anchor_quality_score": 75,
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

## 缺失确认门

- Live price not connected
- Verified anchors not confirmed
- AVWAP not connected
- RSI not connected
- Gamma/options not connected

## 规则

- NVDA 是 AI 链总锚，NVDA 的 Gann 信号影响 AI Infra 仓位上限。
- Gann 不能单独触发交易。
- Build 需要：支撑/时间共振 + AVWAP reclaim 或 TCG 延续。
- Trim Watch 需要：压力/时间共振 + 超买/事件压力/量价背离。
- 样本锚点必须被真实图表验证后才能正式使用。
