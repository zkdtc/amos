# AMOS Gann Cluster & Distance Engine v0.2

这是 Gann Calculator 的第二版：  
在九方图价格位基础上，加入“当前价格距离最近支撑/压力、多锚点密集区、是否进入观察带、Gann Price Score”。

注意：当前 CRDO 价格和锚点仍是 sample-only，不是实时交易数据。

---

## 当前样本

- Ticker: `CRDO`
- Sample current price: `78.4`
- Level tolerance: `±0.5%`
- Cluster band: `1.0%`

---

## 新增能力

### 1. Nearest Support
找出当前价格下方最近的 Gann level。

### 2. Nearest Resistance
找出当前价格上方最近的 Gann level。

### 3. Observation Band
如果当前价格进入某个 Gann level 的 ±0.5% 区间，标记为 active observation band。

### 4. Multi-anchor Cluster
如果多个锚点计算出的价格位在 1% 内聚集，形成 Gann Cluster。

### 5. Gann Price Score

初始公式：

```text
Gann Price Score =
0.45 × Price Proximity Score
+ 0.35 × Cluster Score
+ 0.20 × Observation Band Score
```

当前样本分数：

```text
Gann Price Score = 62
Resonance Zone = watch_zone
```

---

## 当前最近支撑

```json
{
  "ticker": "CRDO",
  "anchor_id": "crdo_sample_major_high_2026_02_14",
  "anchor_type": "sample_major_high",
  "anchor_date": "2026-02-14",
  "anchor_price": 86.7,
  "anchor_quality_score": 68,
  "direction": "down",
  "angle": 90,
  "level": 77.64,
  "band_low": 77.25,
  "band_high": 78.03,
  "distance_pct": -0.97,
  "abs_distance_pct": 0.97,
  "in_observation_band": false
}
```

## 当前最近压力

```json
{
  "ticker": "CRDO",
  "anchor_id": "crdo_sample_earnings_gap_2025_12_02",
  "anchor_type": "sample_earnings_gap",
  "anchor_date": "2025-12-02",
  "anchor_price": 64.25,
  "anchor_quality_score": 64,
  "direction": "up",
  "angle": 180,
  "level": 81.28,
  "band_low": 80.87,
  "band_high": 81.69,
  "distance_pct": 3.67,
  "abs_distance_pct": 3.67,
  "in_observation_band": false
}
```

## 最近密集区

```json
{
  "cluster_center": 90.98,
  "cluster_low": 90.55,
  "cluster_high": 91.42,
  "member_count": 2,
  "avg_anchor_quality": 66.0,
  "distance_pct": 16.05,
  "abs_distance_pct": 16.05,
  "members": [
    {
      "ticker": "CRDO",
      "anchor_id": "crdo_sample_earnings_gap_2025_12_02",
      "anchor_type": "sample_earnings_gap",
      "anchor_date": "2025-12-02",
      "anchor_price": 64.25,
      "anchor_quality_score": 64,
      "direction": "up",
      "angle": 270,
      "level": 90.55,
      "band_low": 90.09,
      "band_high": 91.0,
      "distance_pct": 15.5,
      "abs_distance_pct": 15.5,
      "in_observation_band": false
    },
    {
      "ticker": "CRDO",
      "anchor_id": "crdo_sample_major_high_2026_02_14",
      "anchor_type": "sample_major_high",
      "anchor_date": "2026-02-14",
      "anchor_price": 86.7,
      "anchor_quality_score": 68,
      "direction": "up",
      "angle": 45,
      "level": 91.42,
      "band_low": 90.96,
      "band_high": 91.88,
      "distance_pct": 16.61,
      "abs_distance_pct": 16.61,
      "in_observation_band": false
    }
  ]
}
```

---

## 规则

- 进入 ±0.5% 观察带，只代表要观察，不代表自动买卖。
- 多锚点密集区优先于孤立价格位。
- Gann Price Score 不能单独触发交易。
- 必须叠加 Gann Time、AVWAP、RSI、TCG结构、Gamma、事件窗口。
