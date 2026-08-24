import { useEffect, useState } from 'react';
import { RefreshCw, Inbox } from 'lucide-react';
import { getAnnouncements } from '../api/announcements';
import type { Announcement, AnnouncementCategory } from '../types/announcement';
import AnnouncementCard from '../components/AnnouncementCard';
import CategoryFilter from '../components/CategoryFilter';
import PublicHeader from '../components/PublicHeader';
import MobileTabBar from '../components/MobileTabBar';

function SkeletonCard() {
  return (
    <div className="bg-surface border border-line rounded-md shadow-card p-6 mb-4 animate-pulse">
      <div className="h-5 w-24 bg-line rounded-full mb-3" />
      <div className="h-5 w-3/4 bg-line rounded mb-2" />
      <div className="h-4 w-full bg-line rounded mb-1.5" />
      <div className="h-4 w-2/3 bg-line rounded mb-4" />
      <div className="h-4 w-1/2 bg-line rounded" />
    </div>
  );
}

export default function ResidentFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    const category = selectedCategory === 'all' ? undefined : selectedCategory;
    getAnnouncements(category)
      .then((res) => setAnnouncements(res.data))
      .catch(() => setError('Unable to load announcements. Please check your connection.'))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { load(); }, [selectedCategory]);

  useEffect(() => {
    const handleOnline = () => load(true);
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [selectedCategory]);

  return (
    <>
      <PublicHeader />
      <div className="max-w-2xl mx-auto px-5 pt-6 pb-24 md:pb-16 bg-bg min-h-[calc(100vh-64px)]">
        <header className="flex items-start justify-between mb-8">
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-ink mb-1">Health Updates</h1>
            <p className="text-xs uppercase tracking-wide text-ink-soft">Roxas City, Capiz</p>
          </div>
          <button
            onClick={() => load(true)}
            aria-label="Refresh"
            className="text-ink-soft hover:text-primary transition-colors p-1"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </header>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {error && <p className="text-center text-urgent py-8">{error}</p>}

        {!loading && !error && announcements.length === 0 && (
          <div className="text-center py-12">
            <Inbox size={36} className="mx-auto text-ink-soft/40 mb-3" />
            <p className="text-ink-soft">No announcements in this category yet.</p>
          </div>
        )}

        {!loading && announcements.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} />
        ))}
      </div>
      <MobileTabBar />
    </>
  );
}