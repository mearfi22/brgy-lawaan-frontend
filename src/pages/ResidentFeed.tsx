import { useEffect, useState } from 'react';
import { getAnnouncements } from '../api/announcements';
import type { Announcement, AnnouncementCategory } from '../types/announcement';
import AnnouncementCard from '../components/AnnouncementCard';
import CategoryFilter from '../components/CategoryFilter';
import PublicHeader from '../components/PublicHeader';

export default function ResidentFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const category = selectedCategory === 'all' ? undefined : selectedCategory;
    getAnnouncements(category)
      .then((res) => setAnnouncements(res.data))
      .catch(() => setError('Unable to load announcements. Please check your connection.'))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  useEffect(() => {
    const handleOnline = () => {
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      getAnnouncements(category).then((res) => setAnnouncements(res.data)).catch(() => {});
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [selectedCategory]);

  return (
    <>
      <PublicHeader />
      <div className="max-w-2xl mx-auto px-5 pt-6 pb-16 bg-bg min-h-[calc(100vh-64px)]">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ink mb-1">Health Updates</h1>
          <p className="text-xs uppercase tracking-wide text-ink-soft">Roxas City, Capiz</p>
        </header>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {loading && <p className="text-center text-ink-soft py-8">Loading...</p>}
        {error && <p className="text-center text-urgent py-8">{error}</p>}
        {!loading && !error && announcements.length === 0 && (
          <p className="text-center text-ink-soft py-8">No announcements in this category yet.</p>
        )}

        {announcements.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} />
        ))}
      </div>
    </>
  );
}