import { useEffect, useState } from 'react';
import { fetchOptionsChain, type OptionsStructure } from '../../data/liveOptions';
import { useLang } from '../../data/LangContext';

export default function OptionsGammaPanel({ symbol }: { symbol: string }) {
  const { t } = useLang();
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
    return () => { cancelled = true; };
  }, [symbol]);

  return (
    <div className="card">
      <h3>{t.optionsGammaTitle} {symbol}</h3>
      {loading && <div className="badge badge--cyan">{t.loadingOptions}</div>}
      {error && (
        <div className="banner banner--cyan">
          <strong>{t.optionsResearchOnly}</strong> · {error}
        </div>
      )}
      {data && (
        <>
          <div className="score-row" style={{ marginTop: 6 }}>
            <div className="score">{t.callWall} <b>{fmt(data.callWall)}</b></div>
            <div className="score">{t.putWall} <b>{fmt(data.putWall)}</b></div>
            <div className="score score--gold">{t.gammaFlip} <b>{fmt(data.gammaFlip)}</b></div>
            <div className="score score--cyan">{t.atmIv} <b>{data.atmIV != null ? `${(data.atmIV * 100).toFixed(0)}%` : '—'}</b></div>
            <div className="score">{t.pcOi} <b>{data.putCallRatio != null ? data.putCallRatio.toFixed(2) : '—'}</b></div>
          </div>
          <div className={`badge ${regimeClass(data.regime)}`}>{t.optionsRegime} {data.regime}</div>
          <ul className="bullets" style={{ marginTop: 10 }}>
            {data.alerts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
            {data.nearestExpiration && (
              <li>
                {t.nearestExpiration} <b>{data.nearestExpiration.expirationDate}</b>
                {' '}({data.nearestExpiration.calls.length} {t.callsLabel} {data.nearestExpiration.puts.length} {t.putsLabel})
              </li>
            )}
          </ul>
        </>
      )}
      <div className="disclaimer">{t.optionsDisclaimer}</div>
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
