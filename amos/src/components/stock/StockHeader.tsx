import type { Ticker, ManualInput } from '../../data/schemas';
import DataFreshnessBadge from '../guardrails/DataFreshnessBadge';
import ActionCapBadge from '../guardrails/ActionCapBadge';
import type { ActionCap } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

export default function StockHeader({
  ticker,
  input,
  cap
}: {
  ticker: Ticker;
  input?: ManualInput;
  cap: ActionCap;
}) {
  const { t } = useLang();
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1>{ticker.symbol} · {ticker.companyName}</h1>
          <div className="badge badge--gold">{t.roleLabel} {ticker.role}</div>{' '}
          <div className="badge badge--cyan">{t.priorityLabel} {ticker.priority}</div>{' '}
          <div className="badge badge--mute">{ticker.archetype}</div>
          <div className="tag-list" style={{ marginTop: 8 }}>
            {ticker.tags.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {input && <DataFreshnessBadge freshness={input.freshness} />}
          <ActionCapBadge cap={cap} />
        </div>
      </div>
    </div>
  );
}
