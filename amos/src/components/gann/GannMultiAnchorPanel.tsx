import type { GannMultiAnchorView } from '../../data/gannLive';

export default function GannMultiAnchorPanel({ view }: { view: GannMultiAnchorView }) {
  return (
    <div className="card">
      <h3>Gann Multi-Anchor View · {view.ticker}</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
        <span className="badge badge--gold">Current ${view.currentPrice.toFixed(2)}</span>
        {view.nearestSupport && (
          <span className="badge badge--green">
            Nearest Support ${view.nearestSupport.targetPrice.toFixed(2)}
            ({(view.nearestSupport.distancePct * 100).toFixed(1)}%)
          </span>
        )}
        {view.nearestResistance && (
          <span className="badge badge--orange">
            Nearest Resistance ${view.nearestResistance.targetPrice.toFixed(2)}
            ({(view.nearestResistance.distancePct * 100).toFixed(1)}%)
          </span>
        )}
      </div>

      <h4 style={{ marginTop: 10, color: 'var(--fg-mute)' }}>Clusters (≥2 anchors converging)</h4>
      {view.clusters.length === 0 ? (
        <div className="badge badge--mute">No multi-anchor clusters in trading band.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Side</th>
              <th>Center Price</th>
              <th>Distance</th>
              <th>Strength</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {view.clusters.map((c, i) => (
              <tr key={i}>
                <td>
                  <span className={`badge ${c.side === 'support' ? 'badge--green' : 'badge--orange'}`}>
                    {c.side}
                  </span>
                </td>
                <td>${c.centerPrice.toFixed(2)}</td>
                <td style={{ color: c.distancePct >= 0 ? 'var(--orange)' : 'var(--green)' }}>
                  {c.distancePct >= 0 ? '+' : ''}{c.distancePct.toFixed(2)}%
                </td>
                <td>{'★'.repeat(c.strength)}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>
                  {c.members.map((m) => `${m.anchorType.split(' ')[0]}@${m.angle}°`).join(' · ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 style={{ marginTop: 16, color: 'var(--fg-mute)' }}>All Per-Anchor Levels (within ±20% band)</h4>
      <table>
        <thead>
          <tr>
            <th>Anchor</th>
            <th>Angle</th>
            <th>Direction</th>
            <th>Target</th>
            <th>Dist %</th>
            <th>In Band ±0.5%</th>
          </tr>
        </thead>
        <tbody>
          {view.perAnchorLevels.slice(0, 24).map((l, i) => (
            <tr key={i}>
              <td style={{ fontSize: 11 }}>{l.anchorType} (${l.anchorPrice.toFixed(2)})</td>
              <td>{l.angle}°</td>
              <td>{l.direction}</td>
              <td>${l.targetPrice.toFixed(2)}</td>
              <td>{(l.distancePct * 100).toFixed(2)}%</td>
              <td>{l.inBand ? <span className="badge badge--green">✓ in band</span> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="disclaimer">
        Multi-anchor clusters (≥2 anchors converging within 1%) are HIGH-quality observation zones —
        but still require AVWAP, RSI, volume, options-gamma confirmation. Gann never triggers alone.
      </div>
    </div>
  );
}
