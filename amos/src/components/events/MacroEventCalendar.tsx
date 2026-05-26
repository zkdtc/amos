import type { MacroEvent } from '../../data/schemas';
import { defaultCapForCriticalEvent } from '../../rules/eventGuards';
import { useLang } from '../../data/LangContext';

export default function MacroEventCalendar({ events }: { events: MacroEvent[] }) {
  const { t } = useLang();
  return (
    <div className="card">
      <h2>{t.macroEventCalendarComponentTitle}</h2>
      <table>
        <thead>
          <tr>
            <th>{t.colDate}</th>
            <th>{t.colTime}</th>
            <th>{t.colCategory}</th>
            <th>{t.colTitle}</th>
            <th>{t.colImportance}</th>
            <th>{t.colActionCap}</th>
            <th>{t.colPostEventReview}</th>
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
                <td>{e.postEventReviewRequired ? t.required : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="disclaimer">{t.eventRuleDisclaimer}</div>
    </div>
  );
}
