import DailyBriefView from '../components/dailyBrief/DailyBrief';
import { useLiveData } from '../data/LiveDataContext';
import { useLang } from '../data/LangContext';

export default function DailyBriefPage() {
  const { dailyBrief, loading } = useLiveData();
  const { t } = useLang();
  if (loading) return <div className="card">{t.loading} daily brief…</div>;
  return <DailyBriefView brief={dailyBrief} />;
}
