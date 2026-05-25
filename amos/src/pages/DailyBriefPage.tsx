import DailyBriefView from '../components/dailyBrief/DailyBrief';
import { useLiveData } from '../data/LiveDataContext';

export default function DailyBriefPage() {
  const { dailyBrief, loading } = useLiveData();
  if (loading) return <div className="card">Loading daily brief…</div>;
  return <DailyBriefView brief={dailyBrief} />;
}
