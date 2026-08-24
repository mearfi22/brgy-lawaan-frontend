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
    <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
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