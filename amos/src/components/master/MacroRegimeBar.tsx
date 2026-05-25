import type { RegimeSnapshot } from '../../data/marketRegime';
import type { BenchmarkSnapshot } from '../../data/liveBenchmarks';

export default function MacroRegimeBar({
  regime,
  benchmarks
}: {
  regime: RegimeSnapshot | null;
  benchmarks: Map<string, BenchmarkSnapshot>;
}) {
  if (!regime) {
    return (
      <div className="card">
        <h3>Macro War Map</h3>
        <div className="badge badge--mute">Benchmarks unavailable — regime unknown.</div>
      </div>
    );
  }
  return (
    <div className="card">
      <h3>Macro War Map · Top Global Runtime</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <span className={`badge ${regimeLabelClass(regime.label)}`}>REGIME · {regime.label}</span>
        <span className={`badge ${riskClass(regime.riskAppetite)}`}>RISK · {regime.riskAppetite}</span>
        <span className={`badge ${liqClass(regime.liquidity)}`}>LIQ · {regime.liquidity}</span>
        <span className={`badge ${leadClass(regime.leadership)}`}>LEAD · {regime.leadership}</span>
      </div>
      <div className="grid-3">
        {Array.from(benchmarks.values()).map((b) => (
          <div key={b.symbol} style={{ borderLeft: '3px solid var(--border-strong)', padding: '4px 10px' }}>
            <div style={{ color: 'var(--fg-mute)', fontSize: 11 }}>{b.label}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 14 }}>
              {b.price.toFixed(2)}
              <span style={{ color: b.chg1d >= 0 ? 'var(--green)' : 'var(--red)', marginLeft: 6 }}>
                {b.chg1d >= 0 ? '+' : ''}{b.chg1d.toFixed(2)}%
              </span>
            </div>
            <div style={{ color: 'var(--fg-mute)', fontSize: 11 }}>
              20d {b.chg20d >= 0 ? '+' : ''}{b.chg20d.toFixed(1)}% · {b.aboveSma20 ? '↑SMA20' : '↓SMA20'}
            </div>
          </div>
        ))}
      </div>
      <ul className="bullets" style={{ marginTop: 10 }}>
        {regime.notes.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
      <div className="disclaimer">
        Single-jianwei: 宏观定仓位 — macro sets the ceiling on aggression. Liquidity + leadership define the playable regime.
      </div>
    </div>
  );
}

function regimeLabelClass(r: RegimeSnapshot['label']) {
  switch (r) {
    case 'Attack':       return 'badge--green';
    case 'Normal':       return 'badge--cyan';
    case 'Reduced Size': return 'badge--orange';
    case 'Defensive':    return 'badge--orange';
    case 'Risk-Off':     return 'badge--red';
  }
}
function riskClass(r: RegimeSnapshot['riskAppetite']) {
  switch (r) {
    case 'Risk-On':   return 'badge--green';
    case 'Selective': return 'badge--cyan';
    case 'Cautious':  return 'badge--orange';
    case 'Risk-Off':  return 'badge--red';
  }
}
function liqClass(l: RegimeSnapshot['liquidity']) {
  switch (l) {
    case 'Loosening':  return 'badge--green';
    case 'Neutral':    return 'badge--cyan';
    case 'Tightening': return 'badge--orange';
  }
}
function leadClass(l: RegimeSnapshot['leadership']) {
  switch (l) {
    case 'NVDA Strong':   return 'badge--green';
    case 'NVDA Wobbling': return 'badge--orange';
    case 'NVDA Broken':   return 'badge--red';
    case 'Unknown':       return 'badge--mute';
  }
}
