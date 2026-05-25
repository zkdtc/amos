# AMOS Data-driven Multi-stock Dashboard v0.1

这是第一版多标的数据驱动看板。

## 数据来源

读取：

`amos_sample_data_fixture_v0_1.json`

## 覆盖标的

- NVDA
- CRDO
- LITE
- IREN
- HOOD

## 页面展示

- Market State
- Primary Risks
- Migration Candidates
- Narrative Strength / Maturity / Failure Risk
- 每只股票：
  - profile
  - tags
  - action bias
  - confidence
  - risk stack
  - evidence
  - counter evidence
- Comparison Table

## 当前用途

这不是实时数据版，而是产品逻辑验证版。  
它证明 AMOS 可以从统一数据对象生成多股票战场视图。

## 下一步

1. 接入 Scoring Logic，自动计算 risk level 和 action。
2. 把 CRDO v0.2 页面与这个 dashboard 互相链接。
3. 生成 real-data-ready schema。
4. 开始真实市场数据填充。
