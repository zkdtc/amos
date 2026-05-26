import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import MacroRegimeBar from '../components/master/MacroRegimeBar';
import LeadershipBoard from '../components/master/LeadershipBoard';
import MacroEventCalendar from '../components/events/MacroEventCalendar';
import { useLiveData } from '../data/LiveDataContext';
import { noAttackInForce } from '../rules/eventGuards';
import { useLang } from '../data/LangContext';

export default function HomeCommandCenterPage() {
  const { regime, benchmarks, tickers, liveMap, events, loading } = useLiveData();
  const { t } = useLang();
  if (loading) return <div className="card">{t.loading}…</div>;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.eventDate >= today).slice(0, 6);
  const noAttack = noAttackInForce(upcoming);
  const qqq = benchmarks.get('QQQ');

  return (
    <>
      <div className="card">
        <h1>{t.homeCommandCenter}</h1>
        <div className="badge badge--gold">{t.strategicTopBar}</div>{' '}
        <div className="badge badge--cyan">{t.macroLiquidityBadge}</div>
      </div>

      {noAttack && (
        <GuardrailBanner
          variant="red"
          title={t.noAttackWindowActive}
          items={[...t.noAttackItems]}
        />
      )}

      <MacroRegimeBar regime={regime} benchmarks={benchmarks} />

      <LeadershipBoard tickers={tickers} liveMap={liveMap} qqq={qqq} />

      <div className="card">
        <h2>{t.upcomingEvents}</h2>
        <MacroEventCalendar events={upcoming} />
      </div>

      <div className="card">
        <h2>{t.doctrineReminders}</h2>
        <ul className="bullets">
          {t.doctrineItems.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </>
  );
}
