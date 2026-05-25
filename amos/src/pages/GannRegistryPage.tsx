import { Link } from 'react-router-dom';
import { useLiveData } from '../data/LiveDataContext';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import LiveQuoteBadge from '../components/shell/LiveQuoteBadge';

export default function GannRegistryPage() {
  const { gannRegistry, liveMap, isLive, loading } = useLiveData();

  if (loading) return <div className="card">Loading Gann registry…</div>;

  const data = gannRegistry;

  return (
    <>
      <div className="card">
        <h1>Gann Live Ticker Registry</h1>
        <div className="badge badge--gold">{data.version}</div>{' '}
        <div className="badge badge--mute">computed {data.created}</div>{' '}
        {isLive && <div className="badge badge--green">Prices + Gann: LIVE (Yahoo Finance)</div>}
        <div className="disclaimer">{data.purpose}</div>
      </div>

      <GuardrailBanner title="Registry Guardrails" items={data.guardrails} />

      <div className="card">
        <h2>Gann Live Engines ({data.live_tickers.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Live Quote</th>
              <th>Engine</th>
              <th>Data Quality</th>
              <th>Price Score</th>
              <th>Time Score</th>
              <th>Resonance</th>
              <th>State</th>
              <th>Missing Gates</th>
              <th>Page</th>
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
                      {e.hard_missing_data.length} missing
                    </span>
                  </td>
                  <td><Link to={`/stocks/${e.ticker}`}>open →</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.pending_tickers.length > 0 && (
        <div className="card">
          <h2>Gann Pending ({data.pending_tickers.length})</h2>
          <div className="tag-list">
            {data.pending_tickers.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="disclaimer">
            These tickers have no live price data yet. They will become Gann Live
            when Yahoo Finance data is available.
          </div>
        </div>
      )}
    </>
  );
}
