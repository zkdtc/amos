import type { ActionCap } from '../../data/schemas';
import { useLang } from '../../data/LangContext';

const color: Record<ActionCap, string> = {
  Attack: 'badge badge--green',
  Normal: 'badge badge--cyan',
  'Reduced Size': 'badge badge--orange',
  Watch: 'badge badge--orange',
  'Research Only': 'badge badge--orange',
  'No Attack': 'badge badge--red'
};

export default function ActionCapBadge({ cap }: { cap: ActionCap }) {
  const { t } = useLang();
  return <span className={color[cap]}>{t.actionCap} {cap}</span>;
}
