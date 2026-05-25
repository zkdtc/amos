# AMOS Priority Ticker Checklist v0.1

这个交付在手动数据日报工作簿中新增：

`Priority Checklist v0.1`

## 作用

为每个优先标的固定每日检查要求：

- 哪些字段 Must
- 哪些字段 Should
- 哪些字段 Optional
- 哪些字段可 Skip
- 缺失多少 Must-have 会降低置信度
- 置信度上限如何影响行动上限

## 当前优先级

### P0
- NVDA
- CRDO
- LITE

每日必须更新。

### P1
- IREN
- HOOD
- GOOG
- MSFT
- AVGO

有仓位、有事件或进入观察窗口时必须更新。

### P2
- RKLB
- IONQ

主题高弹性，重点防止追尾部。

## Action Cap Logic

- Missing Must-have = 0 → Confidence Cap 80 → No Cap
- Missing Must-have = 1-2 → Confidence Cap 60 → Build/Hold Only
- Missing Must-have = 3-4 → Confidence Cap 45 → No Attack
- Missing Must-have = 5+ → Confidence Cap 30 → Wait Only
