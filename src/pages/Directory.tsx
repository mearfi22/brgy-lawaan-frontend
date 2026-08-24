import { useEffect, useState } from 'react';
import { Phone, Clock, MapPin, Search, Navigation, Inbox } from 'lucide-react';
import { getDirectory } from '../api/directory';
import type { DirectoryEntry, DirectoryType } from '../types/directory';
import PublicHeader from '../components/PublicHeader';
import MobileTabBar from '../components/MobileTabBar';
import OfflineBanner from '../components/OfflineBanner';

const typeLabels: Record<DirectoryType, string> = {
  abtc: 'Animal Bite Treatment Center',
  health_center: 'Health Center',
  hospital: 'Hospital',
  barangay_outpost: 'Barangay Health Outpost',
};

export default function Directory() {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [filterType, setFilterType] = useState<DirectoryType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const type = filterType === 'all' ? undefined : filterType;
    getDirectory(type).then(setEntries).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterType]);

  useEffect(() => {
    const handleOnline = () => load();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [filterType]);

  const filtered = entries.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PublicHeader />
      <OfflineBanner />
      <div className="max-w-2xl mx-auto px-5 pt-6 pb-24 md:pb-16 bg-bg min-h-[calc(100vh-64px)]">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-ink mb-1">Health Facility Directory</h1>
          <p className="text-xs uppercase tracking-wide text-ink-soft">Roxas City, Capiz</p>
        </header>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search facility or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-line bg-surface rounded-md text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
          {(['all', 'abtc', 'health_center', 'hospital', 'barangay_outpost'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`flex-shrink-0 whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                filterType === t
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-line text-ink-soft hover:border-primary hover:text-primary'
              }`}
            >
              {t === 'all' ? 'All' : typeLabels[t]}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-ink-soft py-8">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <Inbox size={36} className="mx-auto text-ink-soft/40 mb-3" />
            <p className="text-ink-soft">No facilities found.</p>
          </div>
        )}

        {filtered.map((entry) => (
          <article key={entry.id} className="bg-surface border border-line rounded-md shadow-card p-6 mb-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-wide text-primary border border-primary px-2.5 py-1 rounded-md mb-3">
              {typeLabels[entry.type]}
            </span>
            <h3 className="text-lg font-bold text-ink mb-1.5">{entry.name}</h3>
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="flex items-center gap-1.5 text-sm text-ink-soft">
                <MapPin size={14} className="flex-shrink-0" /> {entry.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(entry.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark"
              >
                <Navigation size={12} /> Directions
              </a>
            </div>

            <div className="border-t border-line pt-3 text-sm text-ink-soft space-y-1.5">
              {entry.contact_number && (
                <a href={`tel:${entry.contact_number}`} className="flex items-center gap-1.5 text-primary hover:text-primary-dark w-fit">
                  <Phone size={13} /> {entry.contact_number}
                </a>
              )}
              {entry.operating_hours && (
                <p className="flex items-center gap-1.5"><Clock size={13} /> {entry.operating_hours}</p>
              )}
              {entry.services_offered && <p><strong className="text-ink">Services:</strong> {entry.services_offered}</p>}
              {entry.requirements && <p><strong className="text-ink">Requirements:</strong> {entry.requirements}</p>}
            </div>
          </article>
        ))}
      </div>
      <MobileTabBar />
    </>
  );
}