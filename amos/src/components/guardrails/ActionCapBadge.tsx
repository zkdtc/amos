import type { ActionCap } from '../../data/schemas';

const color: Record<ActionCap, string> = {
  Attack: 'badge badge--green',
  Normal: 'badge badge--cyan',
  'Reduced Size': 'badge badge--orange',
  Watch: 'badge badge--orange',
  'Research Only': 'badge badge--orange',
  'No Attack': 'badge badge--red'
};

export default function ActionCapBadge({ cap }: { cap: ActionCap }) {
  return <span className={color[cap]}>ACTION CAP · {cap}</span>;
}
