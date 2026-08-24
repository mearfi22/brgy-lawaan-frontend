import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import DirectoryForm from '../components/DirectoryForm';
import type { DirectoryEntry } from '../types/directory';
import { getDirectory, createDirectoryEntry, updateDirectoryEntry, deleteDirectoryEntry } from '../api/directory';

type ViewMode = 'list' | 'create' | { edit: DirectoryEntry };

const typeLabels: Record<string, string> = {
  abtc: 'ABTC',
  health_center: 'Health Center',
  hospital: 'Hospital',
  barangay_outpost: 'Barangay Outpost',
};

export default function AdminDirectory() {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('list');

  const load = () => {
    setLoading(true);
    getDirectory().then(setEntries).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (data: Partial<DirectoryEntry>) => {
    await createDirectoryEntry(data);
    setView('list');
    load();
  };

  const handleUpdate = async (id: number, data: Partial<DirectoryEntry>) => {
    await updateDirectoryEntry(id, data);
    setView('list');
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this directory entry?')) return;
    await deleteDirectoryEntry(id);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-ink">Directory</h1>
        {view === 'list' && (
          <button
            onClick={() => setView('create')}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
          >
            <Plus size={16} />
            New Entry
          </button>
        )}
      </div>

      {view === 'create' && <DirectoryForm onSubmit={handleCreate} onCancel={() => setView('list')} />}

      {typeof view === 'object' && 'edit' in view && (
        <DirectoryForm
          initial={view.edit}
          onSubmit={(data) => handleUpdate(view.edit.id, data)}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'list' && (
        <>
          {loading && <p className="text-ink-soft">Loading...</p>}
          {!loading && entries.length === 0 && <p className="text-ink-soft">No directory entries yet.</p>}

          {/* Desktop table */}
          {entries.length > 0 && (
            <div className="hidden md:block bg-surface border border-line rounded-md shadow-card overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-bg">
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Name</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Type</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Address</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Active</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-t border-line hover:bg-bg/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-ink font-medium">{e.name}</td>
                      <td className="px-4 py-3 text-sm text-ink-soft">{typeLabels[e.type]}</td>
                      <td className="px-4 py-3 text-sm text-ink-soft">{e.address}</td>
                      <td className="px-4 py-3 text-sm text-ink-soft">{e.is_active ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setView({ edit: e })}
                            className="flex items-center gap-1.5 text-xs font-medium text-ink-soft border border-line px-3 py-1.5 rounded-md hover:border-primary hover:text-primary transition-colors"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="flex items-center gap-1.5 text-xs font-medium text-urgent border border-urgent/30 px-3 py-1.5 rounded-md hover:bg-urgent hover:text-white transition-colors"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile card list */}
          <div className="md:hidden flex flex-col gap-3">
            {entries.map((e) => (
              <div key={e.id} className="bg-surface border border-line rounded-md shadow-card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-ink leading-snug">{e.name}</h3>
                  <span className={`flex-shrink-0 text-[10px] font-bold uppercase px-2 py-1 rounded-full ${e.is_active ? 'text-primary bg-primary/10' : 'text-ink-soft bg-bg'}`}>
                    {e.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-ink-soft mb-1">{typeLabels[e.type]}</p>
                <p className="flex items-center gap-1.5 text-xs text-ink-soft mb-3">
                  <MapPin size={12} /> {e.address}
                </p>
                <div className="flex gap-2 pt-3 border-t border-line">
                  <button
                    onClick={() => setView({ edit: e })}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-ink-soft border border-line py-2 rounded-md"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-urgent border border-urgent/30 py-2 rounded-md"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}