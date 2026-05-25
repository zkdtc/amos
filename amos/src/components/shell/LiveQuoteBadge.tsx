import type { YahooQuote } from '../../data/liveAdapter';

export default function LiveQuoteBadge({
  quote,
  marketOpen
}: {
  quote?: YahooQuote;
  marketOpen?: boolean;
}) {
  if (!quote) return null;
  const pct = quote.regularMarketChangePercent;
  const color = pct >= 0 ? 'var(--green)' : 'var(--red)';
  const sign = pct >= 0 ? '+' : '';
  const label = marketOpen === false ? 'Prev Close' : 'Last';
  return (
    <span
      className="badge"
      style={{
        color,
        borderColor: color,
        fontFamily: 'var(--mono)',
        fontSize: 13,
        padding: '3px 10px'
      }}
      title={`${label} from Yahoo Finance`}
    >
      {label}: ${quote.regularMarketPrice.toFixed(2)}&nbsp;
      ({sign}{pct.toFixed(2)}%)
    </span>
  );
}
