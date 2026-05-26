import type { GannEngine } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

export default function GannMissingGates({ engine }: { engine: GannEngine }) {
  const { t } = useLang();
  return (
    <div className="card">
      <h3>{t.missingGatesTitle}</h3>
      {engine.hard_missing_data.length === 0 ? (
        <div className="badge badge--green">{t.allGatesConnected}</div>
      ) : (
        <ul className="bullets">
          {engine.hard_missing_data.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
