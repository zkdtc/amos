import { Link } from 'react-router-dom';
import { useLiveData } from '../data/LiveDataContext';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import LiveQuoteBadge from '../components/shell/LiveQuoteBadge';
import { useLang } from '../data/LangContext';

export default function GannRegistryPage() {
  const { gannRegistry, liveMap, isLive, loading } = useLiveData();
  const { t } = useLang();

  if (loading) return <div className="card">{t.loading} Gann registry…</div>;

  const data = gannRegistry;

  return (
    <>
      <div className="card">
        <h1>{t.gannLiveTickerRegistry}</h1>
        <div className="badge badge--gold">{data.version}</div>{' '}
        <div className="badge badge--mute">{t.computed} {data.created}</div>{' '}
        {isLive && <div className="badge badge--green">{t.liveGannPrices}</div>}
        <div className="disclaimer">{data.purpose}</div>
      </div>

      <GuardrailBanner title={t.registryGuardrails} items={data.guardrails} />

      <div className="card">
        <h2>{t.gannLiveEngines} ({data.live_tickers.length})</h2>
        <table>
          <thead>
            <tr>
              <th>{t.ticker}</th>
              <th>{t.liveQuote}</th>
              <th>{t.engine}</th>
              <th>{t.dataQuality}</th>
              <th>{t.priceScore}</th>
              <th>{t.timeScore}</th>
              <th>{t.resonance}</th>
              <th>{t.state}</th>
              <th>{t.missingGates}</th>
              <th>{t.page}</th>
            </tr>
          </thead>
          <tbody>
            {data.live_tickers.map((e) => {
              const live = liveMap.get(e.ticker);
              return (
                <tr key={e.ticker}>
                  <td><b>{e.ticker}</b></td>
                  <td>
                    {live ? (
                      <LiveQuoteBadge quote={live.quote} />
                    ) : (
                      <span className="badge badge--mute">—</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12 }}>{e.engine_version}</td>
                  <td>
                    <span className={`badge ${e.data_quality === 'live_market_data' ? 'badge--green' : 'badge--orange'}`}>
                      {e.data_quality}
                    </span>
                  </td>
                  <td>{e.gann_price_score}</td>
                  <td>{e.gann_time_score}</td>
                  <td><b>{e.unified_gann_resonance_score}</b></td>
                  <td>{e.resonance_state}</td>
                  <td>
                    <span className={`badge ${e.hard_missing_data.length ? 'badge--red' : 'badge--green'}`}>
                      {e.hard_missing_data.length} {t.missing}
                    </span>
                  </td>
                  <td><Link to={`/stocks/${e.ticker}`}>{t.openArrow}</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.pending_tickers.length > 0 && (
        <div className="card">
          <h2>{t.gannPendingSection} ({data.pending_tickers.length})</h2>
          <div className="tag-list">
            {data.pending_tickers.map((sym) => <span key={sym} className="tag">{sym}</span>)}
          </div>
          <div className="disclaimer">{t.gannPendingDisclaimer}</div>
        </div>
      )}
    </>
  );
}
