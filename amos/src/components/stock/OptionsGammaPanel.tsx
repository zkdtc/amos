import { useEffect, useState } from 'react';
import { fetchOptionsChain, type OptionsStructure } from '../../data/liveOptions';

/**
 * Options / Gamma panel. Per single-jianwei doctrine:
 *   - Call wall / put wall are short-term magnet/repel zones.
 *   - Gamma flip determines whether dealer hedging amplifies or absorbs moves.
 *   - High IV → prefer selling premium; low IV → prefer buying.
 *
 * Renders gracefully when Yahoo options proxy is unavailable
 * (degrades to "data unavailable — research only").
 */
export default function OptionsGammaPanel({ symbol }: { symbol: string }) {
  const [data, setData] = useState<OptionsStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchOptionsChain(symbol)
      .then((d) => {
        if (cancelled) return;
        if (!d) {
          setError('Options data not available (Yahoo proxy unavailable or rate-limited). Research-only.');
        }
        setData(d);
      })
      .catch((e) => !cancelled && setError(String(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return (
    <div className="card">
      <h3>Options / Gamma · {symbol}</h3>
      {loading && <div className="badge badge--cyan">⟳ loading…</div>}
      {error && (
        <div className="banner banner--cyan">
          <strong>RESEARCH ONLY</strong> · {error}
        </div>
      )}
      {data && (
        <>
          <div className="score-row" style={{ marginTop: 6 }}>
            <div className="score">Call Wall <b>{fmt(data.callWall)}</b></div>
            <div className="score">Put Wall <b>{fmt(data.putWall)}</b></div>
            <div className="score score--gold">γ Flip <b>{fmt(data.gammaFlip)}</b></div>
            <div className="score score--cyan">ATM IV <b>{data.atmIV != null ? `${(data.atmIV * 100).toFixed(0)}%` : '—'}</b></div>
            <div className="score">P/C OI <b>{data.putCallRatio != null ? data.putCallRatio.toFixed(2) : '—'}</b></div>
          </div>
          <div className={`badge ${regimeClass(data.regime)}`}>REGIME · {data.regime}</div>
          <ul className="bullets" style={{ marginTop: 10 }}>
            {data.alerts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
            {data.nearestExpiration && (
              <li>
                Nearest expiration: <b>{data.nearestExpiration.expirationDate}</b>
                {' '}({data.nearestExpiration.calls.length} calls · {data.nearestExpiration.puts.length} puts)
              </li>
            )}
          </ul>
        </>
      )}
      <div className="disclaimer">
        Options/Gamma is a risk-cap input. It NEVER triggers trade alone.
        Single-jianwei doctrine: 期权定下限 (options set the floor of risk).
      </div>
    </div>
  );
}

function fmt(x: number | null) { return x != null ? `$${x.toFixed(2)}` : '—'; }

function regimeClass(r: OptionsStructure['regime']) {
  switch (r) {
    case 'Negative Gamma': return 'badge--red';
    case 'Near Flip': return 'badge--orange';
    case 'Positive Gamma': return 'badge--green';
    default: return 'badge--mute';
  }
}
