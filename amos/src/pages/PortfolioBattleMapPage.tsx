import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import PortfolioBattleMap from '../components/portfolio/PortfolioBattleMap';
import { useLiveData } from '../data/LiveDataContext';
import { SAMPLE_PORTFOLIO, buildPortfolioSummaries, computeTotals } from '../data/portfolio';
import { useLang } from '../data/LangContext';

export default function PortfolioBattleMapPage() {
  const { liveMap, tickers, loading } = useLiveData();
  const { t } = useLang();
  if (loading) return <div className="card">{t.loading} portfolio…</div>;

  const rows = buildPortfolioSummaries(SAMPLE_PORTFOLIO, liveMap, tickers);
  const totals = computeTotals(rows);

  return (
    <>
      <div className="card">
        <h1>{t.portfolioBattleMapTitle}</h1>
        <div className="badge badge--gold">{t.portfolioRolesBadge}</div>{' '}
        <div className="badge badge--cyan">{t.capitalMigrationBadge}</div>
      </div>
      <GuardrailBanner
        title={t.portfolioGuardrailsTitle}
        items={[...t.portfolioGuardrailItems]}
      />
      <PortfolioBattleMap rows={rows} totals={totals} />
    </>
  );
}
