# AMOS Daily Brief HTML Exporter Script v0.2

这个交付建立一个工程阶段可用的导出脚本，用于把：

`amos_manual_data_workbook_v0_2_unified.xlsx`

里的：

`Generated Brief`

导出成独立 HTML 日报。

## 文件

- `amos_daily_brief_html_exporter_v0_2.py`
- `amos_daily_brief_html_exporter_config_v0_2.json`
- `amos_daily_brief_exported_from_unified_v0_2.html`

## 本版功能

- 读取统一工作簿的 Generated Brief 表
- 自动识别 ticker brief 表头
- 输出独立 HTML
- 统计 Action buckets
- 统计 Missing Data
- 统计 Gann Live
- 写入 AMOS Guardrails
- 如果本地找不到 workbook，可使用 config 中 fallback rows 生成示例日报

## 运行方式

```bash
python amos_daily_brief_html_exporter_v0_2.py \
  --workbook amos_manual_data_workbook_v0_2_unified.xlsx \
  --config amos_daily_brief_html_exporter_config_v0_2.json \
  --output amos_daily_brief_exported_from_unified_v0_2.html
```

## 护栏

- Gann 不能单独触发交易
- Missing Data 下不允许 aggressive action
- Critical event 默认 No Attack
- Anchor Verification v0.2 是正式使用 Gann 的前置条件
