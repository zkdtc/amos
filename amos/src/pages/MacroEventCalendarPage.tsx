import MacroEventCalendar from '../components/events/MacroEventCalendar';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLiveData } from '../data/LiveDataContext';
import { noAttackInForce } from '../rules/eventGuards';
import { useLang } from '../data/LangContext';

export default function MacroEventCalendarPage() {
  const { events, isLive, loading } = useLiveData();
  const { t } = useLang();

  if (loading) return <div className="card">{t.loading} events…</div>;

  const noAttack = noAttackInForce(events);
  const liveEarnings = events.filter((e) => e.title.includes('(live)'));
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.eventDate >= today);
  const past = events.filter((e) => e.eventDate < today);

  return (
    <>
      <div className="card">
        <h1>{t.macroEventCalendarTitle}</h1>
        <span className="badge badge--green">{t.realFomcSchedule}</span>{' '}
        <span className="badge badge--cyan">{t.monthlyOpex}</span>{' '}
        {liveEarnings.length > 0 && (
          <span className="badge badge--green">+{liveEarnings.length} {t.liveEarnings}</span>
        )}
        {' '}
        <span className="badge badge--mute">{events.length} {t.totalUpcoming.split('|')[0].trim()} | {upcoming.length} {t.totalUpcoming.split('|')[1].trim()}</span>
      </div>

      {noAttack && (
        <GuardrailBanner
          variant="red"
          title={t.noAttackWindowActive}
          items={[...t.noAttackWindowItems]}
        />
      )}

      {upcoming.length > 0 && (
        <>
          <h2 style={{ margin: '10px 0 6px' }}>{t.upcoming}</h2>
          <MacroEventCalendar events={upcoming} />
        </>
      )}

      {past.length > 0 && (
        <>
          <h2 style={{ margin: '10px 0 6px', color: 'var(--fg-mute)' }}>{t.pastReference}</h2>
          <MacroEventCalendar events={past} />
        </>
      )}
    </>
  );
}
