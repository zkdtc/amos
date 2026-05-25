import { useMemo } from 'react';
import type { LiveTickerData } from '../../data/liveAdapter';
import type { AnchorVerification } from '../../data/schemas';
import { buildAVWAPSeries, type AVWAPSeries } from '../../data/liveAVWAP';

/**
 * AVWAP Panel — anchored VWAP from each anchor's date forward.
 * Renders one row per anchor.
 */
export default function AVWAPPanel({
  liveData,
  anchors
}: {
  liveData?: LiveTickerData;
  anchors: AnchorVerification[];
}) {
  const series = useMemo<AVWAPSeries[]>(() => {
    if (!liveData?.bars?.length) return [];
    return anchors.map((a) =>
      buildAVWAPSeries(liveData.bars, a.anchorDate, a.anchorPrice, a.anchorType)
    );
  }, [liveData, anchors]);

  return (
    <div className="card">
      <h3>Anchored VWAP (AVWAP) Zones</h3>
      {series.length === 0 ? (
        <div className="badge badge--mute">No anchors or no live bars → AVWAP unavailable.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Anchor</th>
              <th>Anchor Date</th>
              <th>Current AVWAP</th>
              <th>Status</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s, i) => (
              <tr key={i}>
                <td>{s.anchorType}</td>
                <td>{s.anchorDate}</td>
                <td>{s.current != null ? `$${s.current.toFixed(2)}` : '—'}</td>
                <td>
                  <span className={`badge ${statusClass(s.status)}`}>{s.status}</span>
                </td>
                <td style={{ color: (s.distancePct ?? 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {s.distancePct != null ? `${s.distancePct >= 0 ? '+' : ''}${s.distancePct.toFixed(2)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="disclaimer">
        Rules: reclaim of major-event AVWAP = bullish bias; loss of earnings-low AVWAP = thesis damage. AVWAP confirms execution; it never triggers action alone.
      </div>
    </div>
  );
}

function statusClass(s: AVWAPSeries['status']) {
  switch (s) {
    case 'Extended': return 'badge--orange';
    case 'Reclaimed': return 'badge--green';
    case 'At AVWAP': return 'badge--cyan';
    case 'Lost': return 'badge--red';
    default: return 'badge--mute';
  }
}
