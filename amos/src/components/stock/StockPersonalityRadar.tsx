import { useMemo } from 'react';
import type { LiveTickerData } from '../../data/liveAdapter';
import type { BenchmarkSnapshot } from '../../data/liveBenchmarks';
import { buildPersonalityRadar, type PersonalityAxis } from '../../data/stockPersonality';
import { valuationFor } from '../../data/valuationStack';
import { useLang } from '../../data/LangContext';

export default function StockPersonalityRadar({
  symbol,
  liveData,
  leader
}: {
  symbol: string;
  liveData?: LiveTickerData;
  leader?: BenchmarkSnapshot;
}) {
  const { t } = useLang();
  const radar = useMemo(() => {
    if (!liveData?.bars?.length) return null;
    const zones = valuationFor(symbol, liveData.quote.regularMarketPrice);
    const floorDistance = zones?.distanceToConservativePct ?? undefined;
    return buildPersonalityRadar(symbol, liveData.bars, leader?.bars, floorDistance);
  }, [symbol, liveData, leader]);

  if (!radar) {
    return (
      <div className="card">
        <h3>{t.stockPersonalityTitle}</h3>
        <div className="badge badge--mute">{t.noBarsPersonality}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>{t.stockPersonalityTitle} · {symbol}</h3>
      <div className="badge badge--gold">{radar.summary}</div>
      <div className="radar-svg-wrap">
        <RadarSvg axes={radar.axes} />
      </div>
      <table>
        <thead>
          <tr>
            <th>{t.colAxis}</th>
            <th>{t.colScore}</th>
            <th>{t.colDetail}</th>
          </tr>
        </thead>
        <tbody>
          {radar.axes.map((a) => (
            <tr key={a.key}>
              <td>{a.label}</td>
              <td>
                <b style={{ color: axisColor(a.value) }}>{a.value}</b> / 100
              </td>
              <td style={{ color: 'var(--fg-mute)' }}>{a.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="disclaimer">{t.personalityDisclaimer}</div>
    </div>
  );
}

function axisColor(v: number) {
  if (v >= 70) return 'var(--red)';
  if (v >= 50) return 'var(--orange)';
  if (v >= 30) return 'var(--cyan)';
  return 'var(--green)';
}

function RadarSvg({ axes }: { axes: PersonalityAxis[] }) {
  const n = axes.length;
  const cx = 120;
  const cy = 110;
  const r = 90;
  const ring = (frac: number) =>
    Array.from({ length: n }, (_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + Math.cos(angle) * r * frac;
      const y = cy + Math.sin(angle) * r * frac;
      return `${x},${y}`;
    }).join(' ');

  const dataPolygon = axes
    .map((a, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const v = (a.value / 100) * r;
      const x = cx + Math.cos(angle) * v;
      const y = cy + Math.sin(angle) * v;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={240} height={230} viewBox="0 0 240 230" style={{ display: 'block', margin: '8px auto' }}>
      {[0.2, 0.4, 0.6, 0.8, 1.0].map((f, i) => (
        <polygon key={i} points={ring(f)} fill="none" stroke="#2a3645" strokeWidth={1} />
      ))}
      {axes.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#2a3645" strokeWidth={1} />;
      })}
      <polygon points={dataPolygon} fill="rgba(240,196,25,0.18)" stroke="#f0c419" strokeWidth={2} />
      {axes.map((a, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + Math.cos(angle) * (r + 14);
        const y = cy + Math.sin(angle) * (r + 14) + 4;
        return (
          <text key={i} x={x} y={y} fontSize="10" fill="#9aa6b2" textAnchor="middle" fontFamily="ui-monospace,monospace">
            {a.label.split(' ')[0]}
          </text>
        );
      })}
    </svg>
  );
}
