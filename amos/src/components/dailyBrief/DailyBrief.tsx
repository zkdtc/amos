import type { DailyBrief } from '../../data/schemas';
import GuardrailBanner from '../guardrails/GuardrailBanner';

export default function DailyBriefView({ brief }: { brief: DailyBrief }) {
  return (
    <>
      <div className="card">
        <h1>Daily Brief · {brief.date}</h1>
        <div className="badge badge--gold">{brief.phase}</div>{' '}
        <div className="badge badge--orange">DATA · {brief.data_quality}</div>{' '}
        <div className="badge badge--mute">MODE · {brief.mode}</div>
      </div>

      <GuardrailBanner title="Daily Brief Guardrails" items={brief.guardrails} />

      <div className="card">
        <h2>Brief Rows</h2>
        <table>
          <thead>
            <tr>
              {brief.expected_columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brief.rows.map((r) => (
              <tr key={r.ticker}>
                <td><b>{r.ticker}</b></td>
                <td>{r.role}</td>
                <td>{r.action}</td>
                <td>
                  <span className={`badge ${r.freshness === 'Missing' ? 'badge--red' : r.freshness === 'Stale' ? 'badge--orange' : 'badge--green'}`}>
                    {r.freshness}
                  </span>
                </td>
                <td>
                  <span className={`badge ${r.gann === 'Gann Live' ? 'badge--cyan' : 'badge--mute'}`}>
                    {r.gann}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: 'var(--fg-dim)' }}>{r.invalidation}</td>
                <td style={{ color: 'var(--orange)' }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid-3">
        <div className="card">
          <h3>Action Counts</h3>
          <dl className="kvs">
            {Object.entries(brief.actionCounts).map(([k, v]) => (
              <span key={k} style={{ display: 'contents' }}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </span>
            ))}
          </dl>
        </div>
        <div className="card">
          <h3>Freshness Counts</h3>
          <dl className="kvs">
            {Object.entries(brief.freshnessCounts).map(([k, v]) => (
              <span key={k} style={{ display: 'contents' }}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </span>
            ))}
          </dl>
        </div>
        <div className="card">
          <h3>Gann Counts</h3>
          <dl className="kvs">
            {Object.entries(brief.gannCounts).map(([k, v]) => (
              <span key={k} style={{ display: 'contents' }}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </span>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
