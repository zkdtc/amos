import { useParams } from 'react-router-dom';
import { useLiveData } from '../data/LiveDataContext';
import StockHeader from '../components/stock/StockHeader';
import DecisionSummary from '../components/stock/DecisionSummary';
import PriceActionPanel from '../components/stock/PriceActionPanel';
import EvidencePanel from '../components/stock/EvidencePanel';
import CounterEvidencePanel from '../components/stock/CounterEvidencePanel';
import RiskProtectionPanel from '../components/stock/RiskProtectionPanel';
import RSIMomentumPanel from '../components/stock/RSIMomentumPanel';
import AVWAPPanel from '../components/stock/AVWAPPanel';
import OptionsGammaPanel from '../components/stock/OptionsGammaPanel';
import NarrativeLifecyclePanel from '../components/stock/NarrativeLifecyclePanel';
import ValuationBattleMap from '../components/stock/ValuationBattleMap';
import StockPersonalityRadar from '../components/stock/StockPersonalityRadar';
import PeerMapPanel from '../components/stock/PeerMapPanel';
import GannResearchZone from '../components/gann/GannResearchZone';
import GannScorePanel from '../components/gann/GannScorePanel';
import GannMissingGates from '../components/gann/GannMissingGates';
import GannMultiAnchorPanel from '../components/gann/GannMultiAnchorPanel';
import AnchorVerificationGate from '../components/guardrails/AnchorVerificationGate';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import LiveQuoteBadge from '../components/shell/LiveQuoteBadge';
import { freshnessCap, gannMissingDataCap, strictestCap } from '../rules/actionCaps';
import { aggregateEventCap } from '../rules/eventGuards';
import type { ActionCap } from '../data/schemas';
import { buildMultiAnchorView } from '../data/gannLive';
import { useLang } from '../data/LangContext';

export default function StockIntelligencePage() {
  const { ticker = '' } = useParams();
  const T = ticker.toUpperCase();
  const { t } = useLang();

  const {
    tickers, liveMap, gannEngines, events, evidence, anchors, isLive, loading,
    benchmarks, regime, marketClock
  } = useLiveData();

  if (loading) return <div className="card">{t.loading} {T}...</div>;

  const tickerMeta = tickers.find((tk) => tk.symbol === T);
  if (!tickerMeta) {
    return (
      <div className="card">
        <h1>{T}</h1>
        <div className="badge badge--red">{t.tickerNotTracked}</div>
        <div className="disclaimer">
          {t.currentlyTracking} {tickers.map((tk) => tk.symbol).join(', ')}.
        </div>
      </div>
    );
  }

  const liveTickerData = liveMap.get(T);
  const input = liveTickerData?.manualInput;
  const quote = liveTickerData?.quote;
  const engine = gannEngines.find((e) => e.ticker === T);
  const tickerAnchors = anchors.filter((a) => a.ticker === T);
  const tickerEvidence = evidence.filter((p) => p.tickers.includes(T));
  const leader = benchmarks.get('NVDA');

  const caps: ActionCap[] = [];
  const reasons: string[] = [];
  if (input) {
    const fc = freshnessCap(input.freshness);
    caps.push(fc);
    reasons.push(`Freshness=${input.freshness} → cap ${fc}`);
  } else {
    caps.push('Research Only');
    reasons.push('No live price data → Research Only');
  }
  if (engine) {
    const gc = gannMissingDataCap(engine);
    caps.push(gc);
    if (engine.hard_missing_data.length > 0) {
      reasons.push(`Gann hard_missing_data (${engine.hard_missing_data.length}) → cap ${gc}`);
    }
  }
  const ec = aggregateEventCap(events);
  if (events.length > 0) {
    caps.push(ec);
    reasons.push(`Macro events strictest cap → ${ec}`);
  }
  const anchorAllVerified =
    tickerAnchors.length > 0 && tickerAnchors.every((a) => a.usePermission === 'Verified');
  if (!anchorAllVerified) {
    caps.push('Research Only');
    reasons.push('Anchor Verification not complete → Research Only on Gann context');
  }
  if (regime) {
    if (regime.label === 'Risk-Off') {
      caps.push('No Attack');
      reasons.push(`Regime=${regime.label} → cap No Attack`);
    } else if (regime.label === 'Defensive') {
      caps.push('Reduced Size');
      reasons.push(`Regime=${regime.label} → cap Reduced Size`);
    }
  }
  const cap = strictestCap(caps);

  const dataSource = liveTickerData
    ? marketClock.isOpen
      ? `Live (Yahoo Finance) · fetched ${liveTickerData.fetchedAt.slice(11, 19)}`
      : `Last Close (Yahoo Finance) · ${liveTickerData.fetchedAt.slice(11, 19)} — Market ${marketClock.phase}`
    : 'No live data available';

  function dataQualityLabel(q?: string) {
    switch (q) {
      case 'live_market_data':             return t.dataQualityLive;
      case 'cached_fallback_not_live':     return t.dataQualityCached;
      case 'sample_manual_ready_not_live': return t.dataQualitySample;
      default: return t.dataQualityNoData;
    }
  }

  const multiAnchor = quote
    ? buildMultiAnchorView(T, quote.regularMarketPrice, anchors)
    : null;

  return (
    <>
      <StockHeader ticker={tickerMeta} input={input} cap={cap} />

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <LiveQuoteBadge quote={quote} marketOpen={marketClock.isOpen} />
        <span
          className={`badge ${liveTickerData?.dataQuality === 'live_market_data' ? 'badge--green' : liveTickerData?.dataQuality === 'cached_fallback_not_live' ? 'badge--orange' : 'badge--red'}`}
          title={dataSource}
        >
          {dataQualityLabel(liveTickerData?.dataQuality)}
        </span>
        {!marketClock.isOpen && (
          <span className="badge badge--cyan" title={`Next open: ${marketClock.nextSessionOpen.toLocaleString('en-US', { timeZone: 'America/New_York' })} ET`}>
            {t.marketClosed}
          </span>
        )}
        {liveTickerData?.dataQuality === 'cached_fallback_not_live' && (
          <span className="badge badge--orange" title="Yahoo Finance rate-limited; using bundled snapshot from /sample-data/fallback-bars.json so panels keep rendering.">
            {t.yahooRateLimited}
          </span>
        )}
        {quote && (
          <>
            <span className="badge badge--mute">
              {t.weekRange} ${quote.fiftyTwoWeekLow?.toFixed(2)} – ${quote.fiftyTwoWeekHigh?.toFixed(2)}
            </span>
            {quote.fiftyDayAverage && (
              <span className="badge badge--mute">{t.dayMa} ${quote.fiftyDayAverage.toFixed(2)}</span>
            )}
          </>
        )}
        {regime && (
          <span className="badge badge--cyan">{t.regimeBadge} {regime.label}</span>
        )}
        {liveTickerData?.bars && (
          <span className="badge badge--mute">{liveTickerData.bars.length} {t.dailyBars}</span>
        )}
      </div>

      <GuardrailBanner
        title={t.stockGuardrailsTitle}
        items={[
          isLive && liveTickerData ? t.stockGuardrailLive : t.stockGuardrailNoLive,
          t.stockGuardrailGann,
          t.stockGuardrailAnchor,
          `Freshness=${input?.freshness ?? 'Missing'} — cap=${freshnessCap(input?.freshness ?? 'Missing')}.`,
          t.stockGuardrailCounter
        ]}
      />

      <AnchorVerificationGate anchors={tickerAnchors} ticker={T} />

      <div className="grid-2">
        <DecisionSummary input={input} cap={cap} reasons={reasons} />
        <PriceActionPanel input={input} />
      </div>

      <div className="grid-2">
        <RSIMomentumPanel input={input} />
        <NarrativeLifecyclePanel liveData={liveTickerData} />
      </div>

      <ValuationBattleMap symbol={T} currentPrice={quote?.regularMarketPrice ?? null} />

      <AVWAPPanel liveData={liveTickerData} anchors={tickerAnchors} />

      <div className="grid-2">
        <OptionsGammaPanel symbol={T} />
        <StockPersonalityRadar symbol={T} liveData={liveTickerData} leader={leader} />
      </div>

      {engine ? (
        <>
          <GannResearchZone engine={engine} />
          <div className="grid-2">
            <GannScorePanel engine={engine} />
            <GannMissingGates engine={engine} />
          </div>
          {multiAnchor && multiAnchor.perAnchorLevels.length > 0 && (
            <GannMultiAnchorPanel view={multiAnchor} />
          )}
        </>
      ) : (
        <div className="card">
          <h2>{t.gannResearchZoneNoEngine}</h2>
          <div className="badge badge--mute">{t.noEngineMsg} {T}</div>
        </div>
      )}

      <PeerMapPanel symbol={T} />

      <div className="grid-2">
        <EvidencePanel packets={tickerEvidence} />
        <CounterEvidencePanel packets={tickerEvidence} />
      </div>

      <RiskProtectionPanel ticker={tickerMeta} input={input} />
    </>
  );
}
