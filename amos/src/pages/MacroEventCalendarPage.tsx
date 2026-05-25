import MacroEventCalendar from '../components/events/MacroEventCalendar';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLiveData } from '../data/LiveDataContext';
import { noAttackInForce } from '../rules/eventGuards';

export default function MacroEventCalendarPage() {
  const { events, isLive, loading } = useLiveData();

  if (loading) return <div className="card">Loading events…</div>;

  const noAttack = noAttackInForce(events);
  const liveEarnings = events.filter((e) => e.title.includes('(live)'));
  const upcoming = events.filter((e) => e.eventDate >= new Date().toISOString().slice(0, 10));
  const past = events.filter((e) => e.eventDate < new Date().toISOString().slice(0, 10));

  return (
    <>
      <div className="card">
        <h1>Macro / Mechanical Event Calendar</h1>
        <span className="badge badge--green">
          Real 2026 FOMC schedule (federalreserve.gov)
        </span>{' '}
        <span className="badge badge--cyan">Monthly OPEX (3rd Friday)</span>{' '}
        {liveEarnings.length > 0 && (
          <span className="badge badge--green">
            +{liveEarnings.length} live earnings (Yahoo)
          </span>
        )}
        {' '}
        <span className="badge badge--mute">{events.length} total | {upcoming.length} upcoming</span>
      </div>

      {noAttack && (
        <GuardrailBanner
          variant="red"
          title="No-Attack Window Active"
          items={[
            'One or more Critical events in window force No Attack as the default action cap.',
            'This guardrail applies regardless of data source.'
          ]}
        />
      )}

      {upcoming.length > 0 && (
        <>
          <h2 style={{ margin: '10px 0 6px' }}>Upcoming</h2>
          <MacroEventCalendar events={upcoming} />
        </>
      )}

      {past.length > 0 && (
        <>
          <h2 style={{ margin: '10px 0 6px', color: 'var(--fg-mute)' }}>Past (reference)</h2>
          <MacroEventCalendar events={past} />
        </>
      )}
    </>
  );
}
