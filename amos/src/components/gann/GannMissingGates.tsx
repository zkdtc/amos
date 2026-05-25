import type { GannEngine } from '../../data/schemas';

export default function GannMissingGates({ engine }: { engine: GannEngine }) {
  return (
    <div className="card">
      <h3>Missing Gates</h3>
      {engine.hard_missing_data.length === 0 ? (
        <div className="badge badge--green">All required gates connected</div>
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
