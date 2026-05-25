# AMOS CSV Import Schema v0.1

这个交付定义了导入 AMOS Manual Data Workbook v0.2 的 CSV 标准。

## CSV 模板

- `amos_price_technical_import_template_v0_1.csv`
- `amos_gann_import_template_v0_1.csv`
- `amos_event_import_template_v0_1.csv`
- `amos_evidence_import_template_v0_1.csv`

## 工作簿包含

- Overview
- price_technical_import
- gann_import
- event_import
- evidence_import
- Mapping to Workbook
- Validation Rules
- Lists

## 目标

以后可以把以下数据按 CSV 粘贴/导入：

- Last Price
- RSI 14D
- 8/12 EMA State
- Trend Structure
- RS vs QQQ
- RS vs Peers
- AVWAP Status
- Event Pressure
- Risk Stack
- Narrative Strength
- Panic Maturity
- Valuation Comfort
- Gann Support / Resistance
- Gann Resonance Score
- Evidence Packet

## 护栏

CSV import 只是减少手填，不绕过：

- Evidence Packet
- Anchor Verification
- Action Cap
- Live price / AVWAP / RSI / TCG confirmation
