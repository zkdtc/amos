import MasterIndexView from '../components/master/MasterIndex';
import { useLiveData } from '../data/LiveDataContext';

export default function MasterIndexPage() {
  const { masterIndex, loading } = useLiveData();
  if (loading) return <div className="card">Loading master index…</div>;
  return <MasterIndexView index={masterIndex} />;
}
