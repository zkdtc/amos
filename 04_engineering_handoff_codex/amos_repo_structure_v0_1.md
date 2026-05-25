# AMOS Repo Folder Structure v0.1

Recommended initial repository layout.

```text
amos/
  README.md
  package.json
  vite.config.ts or next.config.js
  tsconfig.json

  docs/
    AMOS_ENGINEERING_HANDOFF.md
    AMOS_CANONICAL_SPEC.md
    AMOS_NO_OMISSION_CHECKLIST.md
    CODEx_TASK_PACK.md

  artifacts/
    html/
      amos_alpha_master_index_v0_5.html
      amos_gann_live_ticker_registry_v0_4.html
      nvda_stock_page_gann_registry_v0_6.html
      crdo_stock_page_gann_registry_v0_6.html
      lite_stock_page_gann_registry_v0_6.html
      iren_stock_page_gann_registry_v0_6.html
      hood_stock_page_gann_registry_v0_6.html
    json/
      amos_canonical_system_integration_spec_v0_1.json
      amos_gann_live_ticker_registry_v0_4.json
      amos_daily_brief_html_exporter_config_v0_2.json
    xlsx/
      amos_manual_data_workbook_v0_2_unified.xlsx
      amos_gann_anchor_verification_checklist_v0_2.xlsx
      amos_csv_import_schema_v0_1.xlsx
      amos_macro_event_calendar_manual_input_v0_1.xlsx
    csv/
      amos_price_technical_import_template_v0_1.csv
      amos_gann_import_template_v0_1.csv
      amos_event_import_template_v0_1.csv
      amos_evidence_import_template_v0_1.csv

  public/
    sample-data/
      gann-registry.json
      daily-brief.json
      tickers.json
      events.json
      evidence.json

  src/
    app/ or pages/
      index
      gann-registry
      stocks/[ticker]
      daily-brief
      events
      evidence

    components/
      shell/
        AppShell.tsx
        Sidebar.tsx
        StatusBar.tsx
      guardrails/
        GuardrailBanner.tsx
        DataFreshnessBadge.tsx
        ActionCapBadge.tsx
        AnchorVerificationGate.tsx
      gann/
        GannResearchZone.tsx
        GannScorePanel.tsx
        GannMissingGates.tsx
      stock/
        StockHeader.tsx
        DecisionSummary.tsx
        PriceActionPanel.tsx
        EvidencePanel.tsx
        RiskProtectionPanel.tsx
      dailyBrief/
        DailyBrief.tsx
      events/
        MacroEventCalendar.tsx

    data/
      loaders.ts
      schemas.ts
      sample.ts

    rules/
      actionCaps.ts
      gannGuards.ts
      evidenceGuards.ts
      eventGuards.ts

    tests/
      actionCaps.test.ts
      gannGuards.test.ts
      evidenceGuards.test.ts
      eventGuards.test.ts

  tools/
    python/
      amos_daily_brief_html_exporter_v0_2.py
```

## Rule

Do not delete source artifacts. Use them as references until components are verified against the no-omission checklist.
