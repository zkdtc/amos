import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import PortfolioBattleMap from '../components/portfolio/PortfolioBattleMap';
import { useLiveData } from '../data/LiveDataContext';
import { SAMPLE_PORTFOLIO, buildPortfolioSummaries, computeTotals } from '../data/portfolio';

export default function PortfolioBattleMapPage() {
  const { liveMap, tickers, loading } = useLiveData();
  if (loading) return <div className="card">Loading portfolio…</div>;

  const rows = buildPortfolioSummaries(SAMPLE_PORTFOLIO, liveMap, tickers);
  const totals = computeTotals(rows);

  return (
    <>
      <div className="card">
        <h1>Portfolio Battle Map</h1>
        <div className="badge badge--gold">Core / Swing / Tactical / Runner / Research</div>{' '}
        <div className="badge badge--cyan">Capital Migration Engine</div>
      </div>
      <GuardrailBanner
        title="Portfolio Guardrails"
        items={[
          'Read-only — no orders are placed. AMOS never connects to a brokerage.',
          'Migration suggestions are research heuristics, not trade signals.',
          '仓位不是身份 — rotation discipline overrides emotional attachment.',
          'Single-jianwei: at euphoric tops, trim/exit/sell-call warnings must dominate.'
        ]}
      />
      <PortfolioBattleMap rows={rows} totals={totals} />
    </>
  );
}
