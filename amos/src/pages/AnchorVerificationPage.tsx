import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLiveData } from '../data/LiveDataContext';
import { useLang } from '../data/LangContext';

export default function AnchorVerificationPage() {
  const { anchors, liveMap, loading } = useLiveData();
  const { t } = useLang();

  if (loading) return <div className="card">{t.loading} anchors…</div>;

  return (
    <>
      <div className="card">
        <h1>{t.anchorVerificationChecklist}</h1>
        <span className="badge badge--cyan">{t.userDefinedGannAnchors}</span>
        <div className="disclaimer" style={{ marginTop: 8 }}>
          {t.anchorVerificationDisclaimer}
        </div>
      </div>
      <GuardrailBanner
        title={t.anchorGuardrailsTitle}
        items={[...t.anchorGuardrailItems]}
      />
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t.ticker}</th>
              <th>{t.anchorId}</th>
              <th>{t.type}</th>
              <th>{t.date}</th>
              <th>{t.anchorPrice}</th>
              <th>{t.currentPrice}</th>
              <th>{t.distance}</th>
              <th>{t.status}</th>
              <th>{t.score}</th>
              <th>{t.permission}</th>
              <th>{t.contextChecked}</th>
            </tr>
          </thead>
          <tbody>
            {anchors.map((a) => {
              const live = liveMap.get(a.ticker);
              const currentPrice = live?.quote.regularMarketPrice;
              const distPct = currentPrice
                ? (((currentPrice - a.anchorPrice) / a.anchorPrice) * 100)
                : null;
              return (
                <tr key={a.anchorId}>
                  <td><b>{a.ticker}</b></td>
                  <td>{a.anchorId}</td>
                  <td>{a.anchorType}</td>
                  <td>{a.anchorDate}</td>
                  <td>${a.anchorPrice.toFixed(2)}</td>
                  <td>
                    {currentPrice ? (
                      <span style={{ color: 'var(--green)' }}>${currentPrice.toFixed(2)}</span>
                    ) : (
                      <span className="badge badge--mute">—</span>
                    )}
                  </td>
                  <td>
                    {distPct != null ? (
                      <span style={{ color: distPct >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {distPct >= 0 ? '+' : ''}{distPct.toFixed(1)}%
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <span className={`badge ${a.verificationStatus === 'Verified' ? 'badge--green' : 'badge--orange'}`}>
                      {a.verificationStatus}
                    </span>
                  </td>
                  <td>{a.verificationScore.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        a.usePermission === 'Verified'
                          ? 'badge--green'
                          : a.usePermission === 'Do Not Use'
                          ? 'badge--red'
                          : 'badge--orange'
                      }`}
                    >
                      {a.usePermission}
                    </span>
                  </td>
                  <td>{a.tickerSpecificContextChecked ? '✓' : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
