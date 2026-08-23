import { useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { getResidents, deleteResident } from '../api/residents';
import type { Resident } from '../types/resident';

export default function AdminResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadResidents = () => {
    setLoading(true);
    getResidents().then((res) => setResidents(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadResidents(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this resident from SMS updates?')) return;
    await deleteResident(id);
    loadResidents();
  };

  const filtered = residents.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.full_name.toLowerCase().includes(q) ||
      r.phone_number.includes(q) ||
      (r.purok_zone ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-ink">Residents ({residents.length})</h1>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search name, number, or purok..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-line rounded-md text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      {loading && <p className="text-ink-soft">Loading...</p>}
      {!loading && filtered.length === 0 && <p className="text-ink-soft">No residents found.</p>}

      {!loading && filtered.length > 0 && (
        <div className="bg-surface border border-line rounded-md shadow-card overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-bg">
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Full Name</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Mobile Number</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Purok/Zone</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Registered</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-line hover:bg-bg/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-ink font-medium">{r.full_name}</td>
                  <td className="px-4 py-3 text-sm text-ink-soft">{r.phone_number}</td>
                  <td className="px-4 py-3 text-sm text-ink-soft">{r.purok_zone ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-ink-soft">
                    {new Date(r.created_at).toLocaleDateString('en-PH')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-urgent border border-urgent/30 px-3 py-1.5 rounded-md hover:bg-urgent hover:text-white transition-colors ml-auto"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}