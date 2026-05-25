/**
 * AMOS Home Command Center — single-jianwei's "Macro War Map / 战略指挥中心".
 *
 * Renders:
 *   - Macro regime bar (live VIX / 10Y / DXY / BTC / NVDA / SPY / QQQ / SMH)
 *   - Composite regime label (Attack / Normal / Reduced / Defensive / Risk-Off)
 *   - Leadership board (RS vs QQQ for tracked tickers)
 *   - Upcoming critical events ribbon
 *   - Global guardrail banner
 */

import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import MacroRegimeBar from '../components/master/MacroRegimeBar';
import LeadershipBoard from '../components/master/LeadershipBoard';
import MacroEventCalendar from '../components/events/MacroEventCalendar';
import { useLiveData } from '../data/LiveDataContext';
import { noAttackInForce } from '../rules/eventGuards';

export default function HomeCommandCenterPage() {
  const { regime, benchmarks, tickers, liveMap, events, loading } = useLiveData();
  if (loading) return <div className="card">Loading Command Center…</div>;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events
    .filter((e) => e.eventDate >= today)
    .slice(0, 6);
  const noAttack = noAttackInForce(upcoming);
  const qqq = benchmarks.get('QQQ');

  return (
    <>
      <div className="card">
        <h1>Home Command Center</h1>
        <div className="badge badge--gold">Strategic Top Bar · v0.3B Live-Read Alpha</div>{' '}
        <div className="badge badge--cyan">Macro · Liquidity · Leadership · Events</div>
      </div>

      {noAttack && (
        <GuardrailBanner
          variant="red"
          title="No-Attack Window Active"
          items={[
            'Critical event ahead → default action cap = No Attack.',
            'This guardrail overrides all per-ticker action biases.'
          ]}
        />
      )}

      <MacroRegimeBar regime={regime} benchmarks={benchmarks} />

      <LeadershipBoard tickers={tickers} liveMap={liveMap} qqq={qqq} />

      <div className="card">
        <h2>Upcoming Critical & High-Importance Events</h2>
        <MacroEventCalendar events={upcoming} />
      </div>

      <div className="card">
        <h2>Doctrine Reminders (Single-Jianwei)</h2>
        <ul className="bullets">
          <li>宏观定仓位 — macro sets the exposure ceiling.</li>
          <li>估值定胜率 — valuation sets the win-rate margin of safety.</li>
          <li>财报定去留 — earnings decide thesis continuation.</li>
          <li>周期定时机 — cycle decides timing.</li>
          <li>期权定下限 — options/gamma set the risk floor.</li>
          <li>"Good news that does not lift price" is the Saturation tell.</li>
        </ul>
      </div>
    </>
  );
}
