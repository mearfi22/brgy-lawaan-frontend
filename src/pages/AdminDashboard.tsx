import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import AnnouncementForm from '../components/AnnouncementForm';
import type { Announcement } from '../types/announcement';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../api/announcements';
import { categoryLabels } from '../utils/categoryStyles';

type ViewMode = 'list' | 'create' | { edit: Announcement };

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('list');

  const loadAnnouncements = () => {
    setLoading(true);
    getAnnouncements().then((res) => setAnnouncements(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadAnnouncements(); }, []);

  const handleCreate = async (data: Partial<Announcement>) => {
    await createAnnouncement(data);
    setView('list');
    loadAnnouncements();
  };

  const handleUpdate = async (id: number, data: Partial<Announcement>) => {
    await updateAnnouncement(id, data);
    setView('list');
    loadAnnouncements();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this announcement? This cannot be undone.')) return;
    await deleteAnnouncement(id);
    loadAnnouncements();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Announcements</h1>
        {view === 'list' && (
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
          >
            <Plus size={16} />
            New Announcement
          </button>
        )}
      </div>

      {view === 'create' && (
        <AnnouncementForm onSubmit={handleCreate} onCancel={() => setView('list')} />
      )}

      {typeof view === 'object' && 'edit' in view && (
        <AnnouncementForm
          initial={view.edit}
          onSubmit={(data) => handleUpdate(view.edit.id, data)}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'list' && (
        <>
          {loading && <p className="text-ink-soft">Loading...</p>}
          {!loading && announcements.length === 0 && (
            <p className="text-ink-soft">No announcements yet.</p>
          )}

          {announcements.length > 0 && (
            <div className="bg-surface border border-line rounded-md shadow-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-bg">
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Title</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Category</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Event Date</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-primary px-4 py-3">Urgent</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((a) => (
                    <tr key={a.id} className="border-t border-line hover:bg-bg/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-ink font-medium">{a.title}</td>
                      <td className="px-4 py-3 text-sm text-ink-soft">{categoryLabels[a.category]}</td>
                      <td className="px-4 py-3 text-sm text-ink-soft">{formatDate(a.event_date)}</td>
                      <td className="px-4 py-3 text-sm">
                        {a.is_urgent ? (
                          <span className="inline-flex items-center gap-1.5 text-urgent font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-urgent" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-ink-soft">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setView({ edit: a })}
                            className="flex items-center gap-1.5 text-xs font-medium text-ink-soft border border-line px-3 py-1.5 rounded-md hover:border-primary hover:text-primary transition-colors"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
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
        </>
      )}
    </AdminLayout>
  );
}