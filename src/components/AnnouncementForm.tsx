import { useState, type FormEvent } from 'react';
import type { Announcement, AnnouncementCategory } from '../types/announcement';
import { categoryLabels } from '../utils/categoryStyles';

interface Props {
  initial?: Partial<Announcement>;
  onSubmit: (data: Partial<Announcement>) => Promise<void>;
  onCancel: () => void;
}

const categories: AnnouncementCategory[] = [
  'vaccines', 'medicines', 'maternal_child', 'senior_citizen', 'general_advisory',
];

function toDateInputValue(value?: string | null): string {
  if (!value) return '';
  return value.split('T')[0];
}

function toTimeInputValue(value?: string | null): string {
  if (!value) return '';
  return value.slice(0, 5);
}

const inputClass =
  'block w-full mt-2 px-3 py-2.5 border border-line rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';
const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-primary mb-4';

export default function AnnouncementForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [category, setCategory] = useState<AnnouncementCategory>(initial?.category ?? 'general_advisory');
  const [eventDate, setEventDate] = useState(toDateInputValue(initial?.event_date));
  const [timeStart, setTimeStart] = useState(toTimeInputValue(initial?.event_time_start));
  const [timeEnd, setTimeEnd] = useState(toTimeInputValue(initial?.event_time_end));
  const [location, setLocation] = useState(initial?.location ?? '');
  const [isUrgent, setIsUrgent] = useState(initial?.is_urgent ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({
        title, content, category,
        event_date: eventDate || null,
        event_time_start: timeStart || null,
        event_time_end: timeEnd || null,
        location: location || null,
        is_urgent: isUrgent,
      });
    } catch {
      setError('Failed to save. Please check the fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-md shadow-card p-6 max-w-2xl mb-8">
      <label className={labelClass}>
        Title
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label className={labelClass}>
        Content
        <textarea className={inputClass} value={content} onChange={(e) => setContent(e.target.value)} required rows={4} />
      </label>

      <label className={labelClass}>
        Category
        <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}>
          {categories.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
        </select>
      </label>

      <div className="grid grid-cols-3 gap-4">
        <label className={labelClass}>
          Event Date <span className="normal-case font-normal text-ink-soft/60">(optional)</span>
          <input type="date" className={inputClass} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        </label>
        <label className={labelClass}>
          Start Time
          <input type="time" className={inputClass} value={timeStart} onChange={(e) => setTimeStart(e.target.value)} />
        </label>
        <label className={labelClass}>
          End Time
          <input type="time" className={inputClass} value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} />
        </label>
      </div>

      <label className={labelClass}>
        Location <span className="normal-case font-normal text-ink-soft/60">(optional)</span>
        <input className={inputClass} value={location ?? ''} onChange={(e) => setLocation(e.target.value)} placeholder="Brgy Lawa-an Hall" />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink mb-4">
        <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="w-4 h-4" />
        Mark as urgent (will trigger SMS blast)
      </label>

      {error && <p className="text-urgent text-sm mb-3">{error}</p>}

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onCancel} className="border border-line text-ink-soft px-5 py-2.5 rounded-md text-sm hover:border-ink-soft transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-md text-sm transition-colors disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Announcement'}
        </button>
      </div>
    </form>
  );
}