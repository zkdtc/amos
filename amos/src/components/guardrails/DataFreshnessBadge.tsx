import type { Freshness } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

const color: Record<Freshness, string> = {
  Fresh: 'badge badge--green',
  Stale: 'badge badge--orange',
  Missing: 'badge badge--red'
};

export default function DataFreshnessBadge({ freshness }: { freshness: Freshness }) {
  const { t } = useLang();
  return <span className={color[freshness]}>{t.freshnessLabel} {freshness}</span>;
}
