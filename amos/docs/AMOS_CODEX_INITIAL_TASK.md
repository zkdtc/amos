# AMOS Codex Initial Task Prompt v0.1

You are Codex working inside the AMOS repository.

## Goal

Create a local JSON/CSV-driven web app prototype for AMOS / AI Market Operating System using the provided artifacts.

## Non-negotiable constraints

- Do not simplify AMOS into a generic stock dashboard.
- Preserve all guardrails:
  - sample/manual-ready data warning
  - Anchor Verification gate
  - no Gann-only trade trigger
  - data freshness action caps
  - critical event No Attack gating
  - evidence packet counter-evidence requirement
- Do not connect live APIs yet.
- Do not connect brokerage/trading.
- Do not present sample data as live market data.

## First tasks

1. Create a Next.js or Vite React + TypeScript project.
2. Add `/docs` and `/artifacts` folders.
3. Copy these source files into `/artifacts`:
   - amos_canonical_system_integration_spec_v0_1.md/json
   - amos_no_omission_master_checklist_v0_1.md
   - amos_gann_live_ticker_registry_v0_4.json
   - amos_daily_brief_html_exporter_config_v0_2.json
   - all five ticker stock page HTML references
4. Implement routes:
   - `/`
   - `/gann-registry`
   - `/stocks/:ticker`
   - `/daily-brief`
   - `/events`
   - `/evidence`
5. Implement components:
   - AppShell
   - GuardrailBanner
   - DataFreshnessBadge
   - ActionCapBadge
   - GannResearchZone
   - AnchorVerificationGate
   - DailyBrief
   - EvidencePanel
6. Add guardrail tests:
   - Missing freshness blocks aggressive action.
   - Gann cannot trigger action alone.
   - Unverified anchors render research-only.
   - Critical event defaults to No Attack.
   - Evidence without counter-evidence cannot influence action.
7. Document what was implemented and what remains.

## Acceptance criteria

- `npm install` and `npm run dev` work.
- Five sample ticker pages render.
- All pages show sample-data guardrails where needed.
- Gann Registry reads local JSON.
- No live APIs are used.
- Tests pass.
