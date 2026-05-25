import type { ManualInput } from '../../data/schemas';

export default function PriceActionPanel({ input }: { input?: ManualInput }) {
  return (
    <div className="card">
      <h3>Price Action · TCG 8/12 EMA</h3>
      {!input ? (
        <div className="badge badge--mute">No manual input</div>
      ) : (
        <dl className="kvs">
          <dt>Last Price</dt>
          <dd>{input.lastPrice ?? '—'}</dd>
          <dt>EMA 8</dt>
          <dd>{input.ema8State}</dd>
          <dt>EMA 12</dt>
          <dd>{input.ema12State}</dd>
          <dt>Trend Structure</dt>
          <dd>{input.trendStructure}</dd>
          <dt>RS vs QQQ</dt>
          <dd>{input.rsVsQqq}</dd>
          <dt>RS vs Peers</dt>
          <dd>{input.rsVsPeers}</dd>
          <dt>AVWAP</dt>
          <dd>{input.avwapStatus}</dd>
          <dt>RSI 14D</dt>
          <dd>{input.rsi14d ?? '—'}</dd>
        </dl>
      )}
      <div className="disclaimer">
        Trend confirmation requires HH/HL or LH/LL. Inside-bar / equilibrium waits for volume
        breakout. No random middle-zone action.
      </div>
    </div>
  );
}
