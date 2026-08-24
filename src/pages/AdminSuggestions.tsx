import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { getSuggestions, updateSuggestion } from '../api/suggestions';
import type { Suggestion, SuggestionStatus } from '../types/suggestion';

const statusLabels: Record<SuggestionStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

const statusBorderColor: Record<SuggestionStatus, string> = {
  new: 'border-l-urgent',
  in_progress: 'border-l-accent',
  resolved: 'border-l-primary',
};

export default function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SuggestionStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const load = () => {
    setLoading(true);
    const status = statusFilter === 'all' ? undefined : statusFilter;
    getSuggestions(status).then((res) => setSuggestions(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleStatusChange = async (id: number, status: SuggestionStatus) => {
    await updateSuggestion(id, { status });
    load();
  };

  const handleSaveNotes = async (id: number) => {
    await updateSuggestion(id, { admin_notes: notesDraft });
    setExpandedId(null);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-ink mb-6">Suggestions & Reports</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'new', 'in_progress', 'resolved'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-semibold uppercase tracking-wide px-3.5 py-2 rounded-full transition-colors ${
              statusFilter === s
                ? 'bg-primary text-white'
                : 'bg-surface border border-line text-ink-soft hover:border-primary hover:text-primary'
            }`}
          >
            {s === 'all' ? 'All' : statusLabels[s]}
          </button>
        ))}
      </div>

      {loading && <p className="text-ink-soft">Loading...</p>}
      {!loading && suggestions.length === 0 && <p className="text-ink-soft">No reports found.</p>}

      <div className="flex flex-col gap-4">
        {suggestions.map((s) => (
          <article
            key={s.id}
            className={`bg-surface border border-line border-l-4 ${statusBorderColor[s.status]} rounded-md shadow-card p-5`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-medium text-ink-soft">
                {new Date(s.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>

              <div className="relative">
                <select
                  value={s.status}
                  onChange={(e) => handleStatusChange(s.id, e.target.value as SuggestionStatus)}
                  className="appearance-none text-xs font-semibold uppercase tracking-wide bg-bg border border-line rounded-md pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none focus:border-primary"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-soft" />
              </div>
            </div>

            <p className="text-sm text-ink leading-relaxed mb-4">{s.message}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft border-t border-dashed border-line pt-3 mb-3">
              <span>{s.submitter_name}</span>
              <span>{s.submitter_phone}</span>
            </div>

            {expandedId === s.id ? (
              <div>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={3}
                  placeholder="Internal notes on how this was handled..."
                  className="w-full px-3 py-2.5 border border-line rounded-md text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setExpandedId(null)}
                    className="border border-line text-ink-soft px-4 py-2 rounded-md text-xs font-medium hover:border-ink-soft transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveNotes(s.id)}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setExpandedId(s.id); setNotesDraft(s.admin_notes ?? ''); }}
                className="text-xs font-medium text-primary underline underline-offset-2 hover:text-primary-dark"
              >
                {s.admin_notes ? 'Edit notes' : '+ Add internal notes'}
              </button>
            )}

            {s.admin_notes && expandedId !== s.id && (
              <p className="text-xs text-ink-soft bg-bg rounded-md p-3 mt-2">
                <strong className="text-ink">Notes:</strong> {s.admin_notes}
              </p>
            )}
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}