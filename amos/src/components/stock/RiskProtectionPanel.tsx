import type { ManualInput, Ticker } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

export default function RiskProtectionPanel({ ticker, input }: { ticker: Ticker; input?: ManualInput }) {
  const { t } = useLang();
  const isCore = ticker.role === 'Core';
  return (
    <div className="card">
      <h3>{t.riskProtectionTitle}</h3>
      <ul className="bullets">
        <li>{t.riskBullet1}</li>
        <li>{t.riskBullet2}</li>
        <li>{isCore ? t.riskBulletCore : t.riskBulletNonCore}</li>
        <li>{t.riskBullet4}</li>
        <li>
          {t.riskStackLabel} <b>{input?.riskStack ?? '—'}</b> · {t.actionBiasLabel}{' '}
          <b>{input?.actionBias ?? '—'}</b>
        </li>
      </ul>
    </div>
  );
}
