import { useEffect, useState } from 'react';
import type { ManualInput } from '../data/schemas';
import { loadManualInputs } from '../data/loaders';
import { useLiveData } from '../data/LiveDataContext';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLang } from '../data/LangContext';

export default function ManualWorkbookPage() {
  const { liveMap, loading } = useLiveData();
  const { t } = useLang();
  const [base, setBase] = useState<ManualInput[]>([]);
  useEffect(() => {
    loadManualInputs().then(setBase).catch(() => setBase([]));
  }, []);

  return (
    <>
      <div className="card">
        <h1>{t.manualWorkbookTitle}</h1>
        <div className="badge badge--gold">{t.manualInputsBadge}</div>
      </div>
      <GuardrailBanner
        title={t.manualWorkbookGuardrailsTitle}
        items={[...t.manualWorkbookGuardrailItems]}
      />
      {loading && <div className="card">{t.loadingLiveInputs}</div>}
      <div className="card">
        <h2>{t.manualSeedInputs}</h2>
        <ManualInputTable inputs={base} t={t} />
      </div>
      <div className="card">
        <h2>{t.liveDerivedInputs}</h2>
        <ManualInputTable inputs={Array.from(liveMap.values()).map((l) => l.manualInput)} t={t} />
      </div>
    </>
  );
}

function ManualInputTable({ inputs, t }: { inputs: ManualInput[]; t: ReturnType<typeof useLang>['t'] }) {
  if (inputs.length === 0) return <div className="badge badge--mute">{t.noInputs}</div>;
  return (
    <table>
      <thead>
        <tr>
          <th>{t.tkr}</th>
          <th>{t.lastPrice}</th>
          <th>{t.rsi14}</th>
          <th>{t.ema8}</th>
          <th>{t.ema12}</th>
          <th>{t.trend}</th>
          <th>{t.rsQqq}</th>
          <th>{t.avwap}</th>
          <th>{t.riskStack}</th>
          <th>{t.bias}</th>
          <th>{t.freshness}</th>
        </tr>
      </thead>
      <tbody>
        {inputs.map((i) => (
          <tr key={i.ticker}>
            <td><b>{i.ticker}</b></td>
            <td>{i.lastPrice ?? '—'}</td>
            <td>{i.rsi14d ?? '—'}</td>
            <td>{i.ema8State}</td>
            <td>{i.ema12State}</td>
            <td>{i.trendStructure}</td>
            <td>{i.rsVsQqq}</td>
            <td>{i.avwapStatus}</td>
            <td>{i.riskStack}</td>
            <td>{i.actionBias}</td>
            <td>
              <span
                className={`badge ${
                  i.freshness === 'Fresh'
                    ? 'badge--green'
                    : i.freshness === 'Stale'
                    ? 'badge--orange'
                    : 'badge--red'
                }`}
              >
                {i.freshness}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
