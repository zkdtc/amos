import MasterIndexView from '../components/master/MasterIndex';
import { useLiveData } from '../data/LiveDataContext';
import { useLang } from '../data/LangContext';

export default function MasterIndexPage() {
  const { masterIndex, loading } = useLiveData();
  const { t } = useLang();
  if (loading) return <div className="card">{t.loading} master index…</div>;
  return <MasterIndexView index={masterIndex} />;
}
