import type { Freshness } from '../../data/schemas';

const color: Record<Freshness, string> = {
  Fresh: 'badge badge--green',
  Stale: 'badge badge--orange',
  Missing: 'badge badge--red'
};

export default function DataFreshnessBadge({ freshness }: { freshness: Freshness }) {
  return <span className={color[freshness]}>FRESHNESS · {freshness}</span>;
}
