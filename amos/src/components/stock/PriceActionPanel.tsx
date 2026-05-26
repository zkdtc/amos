import type { ManualInput } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

export default function PriceActionPanel({ input }: { input?: ManualInput }) {
  const { t } = useLang();
  return (
    <div className="card">
      <h3>{t.priceActionTitle}</h3>
      {!input ? (
        <div className="badge badge--mute">{t.noManualInput}</div>
      ) : (
        <dl className="kvs">
          <dt>{t.lastPrice}</dt>
          <dd>{input.lastPrice ?? '—'}</dd>
          <dt>{t.ema8State}</dt>
          <dd>{input.ema8State}</dd>
          <dt>{t.ema12State}</dt>
          <dd>{input.ema12State}</dd>
          <dt>{t.trendStructure}</dt>
          <dd>{input.trendStructure}</dd>
          <dt>{t.rsVsQqq}</dt>
          <dd>{input.rsVsQqq}</dd>
          <dt>{t.rsVsPeers}</dt>
          <dd>{input.rsVsPeers}</dd>
          <dt>{t.avwapStatus}</dt>
          <dd>{input.avwapStatus}</dd>
          <dt>{t.rsi14d}</dt>
          <dd>{input.rsi14d ?? '—'}</dd>
        </dl>
      )}
      <div className="disclaimer">{t.priceActionDisclaimer}</div>
    </div>
  );
}
