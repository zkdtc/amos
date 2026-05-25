import { valuationFor } from '../../data/valuationStack';

/**
 * Multi-layer valuation visual ("battle map" of conservative/base/bull/euphoria
 * zones). Per single-jianwei MULTI-LAYER VALUATION ENGINE doctrine.
 */
export default function ValuationBattleMap({
  symbol,
  currentPrice
}: {
  symbol: string;
  currentPrice: number | null;
}) {
  if (!currentPrice) {
    return (
      <div className="card">
        <h3>Valuation Battle Map</h3>
        <div className="badge badge--mute">No live price → valuation map skipped.</div>
      </div>
    );
  }
  const zones = valuationFor(symbol, currentPrice);
  if (!zones) {
    return (
      <div className="card">
        <h3>Valuation Battle Map</h3>
        <div className="badge badge--mute">
          No valuation research configured for {symbol}. Edit{' '}
          <code>src/data/valuationStack.ts</code>.
        </div>
      </div>
    );
  }

  // Build bar
  const min = Math.min(zones.conservative, zones.currentPrice) * 0.9;
  const max = Math.max(zones.euphoria, zones.currentPrice) * 1.05;
  const range = max - min;
  const pct = (v: number) => ((v - min) / range) * 100;

  return (
    <div className="card">
      <h3>Valuation Battle Map · {symbol}</h3>
      <div className={`badge ${zoneClass(zones.zone)}`}>ZONE · {zones.zone}</div>
      <div className="valuation-bar">
        <div className="valuation-bar__track" />
        <div className="valuation-bar__zone valuation-bar__zone--conservative" style={{ left: `${pct(zones.conservative)}%`, width: `${pct(zones.base) - pct(zones.conservative)}%` }} title="Conservative → Base" />
        <div className="valuation-bar__zone valuation-bar__zone--base"         style={{ left: `${pct(zones.base)}%`,        width: `${pct(zones.bull) - pct(zones.base)}%` }}         title="Base → Bull" />
        <div className="valuation-bar__zone valuation-bar__zone--bull"         style={{ left: `${pct(zones.bull)}%`,        width: `${pct(zones.euphoria) - pct(zones.bull)}%` }}     title="Bull → Euphoria" />
        <div className="valuation-bar__marker" style={{ left: `${pct(zones.currentPrice)}%` }} title={`Current $${zones.currentPrice}`} />
      </div>

      <div className="grid-3" style={{ marginTop: 10 }}>
        <Zone label="💎 Conservative" price={zones.conservative} color="var(--green)" sub="Duan-Yongping floor" />
        <Zone label="🟢 Base"         price={zones.base}         color="var(--cyan)"  sub="market consensus" />
        <Zone label="🟠 Bull"         price={zones.bull}         color="var(--orange)" sub="narrative expansion" />
        <Zone label="🔴 Euphoria"     price={zones.euphoria}     color="var(--red)"   sub="late-cycle overshoot" />
        <Zone label="Current"         price={zones.currentPrice} color="var(--fg)"    sub={`Δ floor ${zones.distanceToConservativePct >= 0 ? '+' : ''}${zones.distanceToConservativePct}%`} />
        <Zone label="Δ Base"          price={zones.distanceToBasePct} color="var(--fg-dim)" sub="% from base"  unit="%" />
      </div>

      <div className="disclaimer" style={{ marginTop: 12 }}>
        <strong>Discount horizon:</strong> {zones.discountNarrative}
      </div>
      <ul className="bullets" style={{ marginTop: 6 }}>
        {zones.notes.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </div>
  );
}

function zoneClass(z: string) {
  if (z === 'Below Conservative' || z === 'Conservative Zone') return 'badge--green';
  if (z === 'Below Base') return 'badge--cyan';
  if (z === 'Base→Bull') return 'badge--gold';
  if (z === 'Bull Zone') return 'badge--orange';
  return 'badge--red';
}

function Zone({ label, price, color, sub, unit = '$' }: { label: string; price: number; color: string; sub: string; unit?: string }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}`, padding: '4px 10px' }}>
      <div style={{ color: 'var(--fg-mute)', fontSize: 11 }}>{label}</div>
      <div style={{ color, fontFamily: 'var(--mono)', fontSize: 16 }}>
        {unit === '$' ? `$${price.toFixed(2)}` : `${price.toFixed(1)}%`}
      </div>
      <div style={{ color: 'var(--fg-mute)', fontSize: 11 }}>{sub}</div>
    </div>
  );
}
