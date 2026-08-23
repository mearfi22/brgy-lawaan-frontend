import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Announcement } from '../types/announcement';
import { categoryLabels, categoryColors } from '../utils/categoryStyles';

interface Props {
  announcement: Announcement;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':');
  const date = new Date();
  date.setHours(Number(hour), Number(minute));
  return date.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
}

export default function AnnouncementCard({ announcement }: Props) {
  const { title, content, category, event_date, event_time_start, event_time_end, location, is_urgent } = announcement;

  return (
    <article className="relative bg-surface border border-line rounded-md shadow-card p-6 mb-4">
      {is_urgent && (
        <span className="absolute top-5 right-5 bg-urgent text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
          Urgent
        </span>
      )}

      <span
        className="inline-block text-white text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3"
        style={{ backgroundColor: categoryColors[category] }}
      >
        {categoryLabels[category]}
      </span>

      <h3 className="text-lg font-bold text-ink mb-1.5 pr-16">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed mb-4">{content}</p>

      {event_date && (
        <div className="flex flex-wrap gap-4 text-xs text-ink-soft border-t border-line pt-3">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {formatDate(event_date)}
          </span>
          {event_time_start && (
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {formatTime(event_time_start)}
              {event_time_end && ` – ${formatTime(event_time_end)}`}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              {location}
            </span>
          )}
        </div>
      )}
    </article>
  );
}