import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLiveData } from '../data/LiveDataContext';

export default function AnchorVerificationPage() {
  const { anchors, liveMap, loading } = useLiveData();

  if (loading) return <div className="card">Loading anchors…</div>;

  return (
    <>
      <div className="card">
        <h1>Anchor Verification Checklist v0.2</h1>
        <span className="badge badge--cyan">User-defined Gann anchors</span>
        <div className="disclaimer" style={{ marginTop: 8 }}>
          Anchors are user-defined pivot points for Gann Square-of-Nine computation.
          They represent real historical price levels you've identified as significant.
          Edit <code>public/sample-data/anchors.json</code> to manage your anchors.
        </div>
      </div>
      <GuardrailBanner
        title="Anchor Verification Guardrails"
        items={[
          'Verified anchors must replace pending anchors before any formal trading use.',
          'Research Only / Do Not Use anchors force Gann to render research-only.',
          'Ticker-specific context must be checked before approving an anchor.'
        ]}
      />
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Anchor ID</th>
              <th>Type</th>
              <th>Date</th>
              <th>Anchor Price</th>
              <th>Current Price</th>
              <th>Distance</th>
              <th>Status</th>
              <th>Score</th>
              <th>Permission</th>
              <th>Context?</th>
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
