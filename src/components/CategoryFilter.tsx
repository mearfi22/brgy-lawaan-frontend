import type { AnnouncementCategory } from '../types/announcement';
import { categoryLabels } from '../utils/categoryStyles';

interface Props {
  selected: AnnouncementCategory | 'all';
  onSelect: (category: AnnouncementCategory | 'all') => void;
}

const categories: (AnnouncementCategory | 'all')[] = [
  'all', 'vaccines', 'medicines', 'maternal_child', 'senior_citizen', 'general_advisory',
];

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
            selected === cat
              ? 'bg-primary text-white'
              : 'bg-surface border border-line text-ink-soft hover:border-primary hover:text-primary'
          }`}
        >
          {cat === 'all' ? 'All' : categoryLabels[cat]}
        </button>
      ))}
    </div>
  );
}