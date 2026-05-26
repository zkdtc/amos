import type { GannMultiAnchorView } from '../../data/gannLive';
import { useLang } from '../../data/LangContext';

export default function GannMultiAnchorPanel({ view }: { view: GannMultiAnchorView }) {
  const { t } = useLang();
  return (
    <div className="card">
      <h3>{t.gannMultiAnchorTitle} {view.ticker}</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
        <span className="badge badge--gold">Current ${view.currentPrice.toFixed(2)}</span>
        {view.nearestSupport && (
          <span className="badge badge--green">
            {t.nearestSupport} ${view.nearestSupport.targetPrice.toFixed(2)}
            ({(view.nearestSupport.distancePct * 100).toFixed(1)}%)
          </span>
        )}
        {view.nearestResistance && (
          <span className="badge badge--orange">
            {t.nearestResistance} ${view.nearestResistance.targetPrice.toFixed(2)}
            ({(view.nearestResistance.distancePct * 100).toFixed(1)}%)
          </span>
        )}
      </div>

      <h4 style={{ marginTop: 10, color: 'var(--fg-mute)' }}>{t.clusters}</h4>
      {view.clusters.length === 0 ? (
        <div className="badge badge--mute">{t.noMultiAnchorClusters}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t.colSide}</th>
              <th>{t.colCenterPrice}</th>
              <th>{t.distance}</th>
              <th>{t.colStrength}</th>
              <th>{t.colMembers}</th>
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

      <h4 style={{ marginTop: 16, color: 'var(--fg-mute)' }}>{t.allPerAnchorLevels}</h4>
      <table>
        <thead>
          <tr>
            <th>{t.colAnchor}</th>
            <th>{t.colAngle}</th>
            <th>{t.colDirection}</th>
            <th>{t.colTarget}</th>
            <th>{t.colDistPct}</th>
            <th>{t.colInBand}</th>
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
              <td>{l.inBand ? <span className="badge badge--green">{t.inBand}</span> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="disclaimer">{t.multiAnchorDisclaimer}</div>
    </div>
  );
}
