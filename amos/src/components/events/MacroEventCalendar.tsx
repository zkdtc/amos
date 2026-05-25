import type { MacroEvent } from '../../data/schemas';
import { defaultCapForCriticalEvent } from '../../rules/eventGuards';

export default function MacroEventCalendar({ events }: { events: MacroEvent[] }) {
  return (
    <div className="card">
      <h2>Macro / Mechanical Event Calendar</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Category</th>
            <th>Title</th>
            <th>Importance</th>
            <th>Action Cap (enforced)</th>
            <th>Post-Event Review</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => {
            const cap = defaultCapForCriticalEvent(e);
            const isNoAttack = cap === 'No Attack';
            return (
              <tr key={e.eventId}>
                <td>{e.eventDate}</td>
                <td>{e.eventTime}</td>
                <td>{e.category}</td>
                <td>{e.title}</td>
                <td>
                  <span
                    className={`badge ${
                      e.importance === 'Critical' ? 'badge--red' : 'badge--orange'
                    }`}
                  >
                    {e.importance}
                  </span>
                </td>
                <td>
                  <span className={`badge ${isNoAttack ? 'badge--red' : 'badge--orange'}`}>
                    {cap}
                  </span>
                </td>
                <td>{e.postEventReviewRequired ? '✓ required' : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="disclaimer">
        Rule: Critical events default to No Attack until setup is confirmed and risk accepted.
      </div>
    </div>
  );
}
