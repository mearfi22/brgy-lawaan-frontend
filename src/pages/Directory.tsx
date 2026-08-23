import { useEffect, useState } from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';
import { getDirectory } from '../api/directory';
import type { DirectoryEntry, DirectoryType } from '../types/directory';
import PublicHeader from '../components/PublicHeader';

const typeLabels: Record<DirectoryType, string> = {
  abtc: 'Animal Bite Treatment Center',
  health_center: 'Health Center',
  hospital: 'Hospital',
  barangay_outpost: 'Barangay Health Outpost',
};

export default function Directory() {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [filterType, setFilterType] = useState<DirectoryType | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const type = filterType === 'all' ? undefined : filterType;
    getDirectory(type).then(setEntries).finally(() => setLoading(false));
  }, [filterType]);

  return (
    <>
      <PublicHeader />
      <div className="max-w-2xl mx-auto px-5 pt-6 pb-16 bg-bg min-h-[calc(100vh-64px)]">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-ink mb-1">Health Facility Directory</h1>
          <p className="text-xs uppercase tracking-wide text-ink-soft">Roxas City, Capiz</p>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'abtc', 'health_center', 'hospital', 'barangay_outpost'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
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
        {!loading && entries.length === 0 && <p className="text-center text-ink-soft py-8">No facilities listed yet.</p>}

        {entries.map((entry) => (
          <article key={entry.id} className="bg-surface border border-line rounded-md shadow-card p-6 mb-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-wide text-primary border border-primary px-2.5 py-1 rounded-md mb-3">
              {typeLabels[entry.type]}
            </span>
            <h3 className="text-lg font-bold text-ink mb-1.5">{entry.name}</h3>
            <p className="flex items-center gap-1.5 text-sm text-ink-soft mb-3">
              <MapPin size={14} /> {entry.address}
            </p>

            <div className="border-t border-line pt-3 text-sm text-ink-soft space-y-1.5">
              {entry.contact_number && (
                <p className="flex items-center gap-1.5"><Phone size={13} /> {entry.contact_number}</p>
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
    </>
  );
}