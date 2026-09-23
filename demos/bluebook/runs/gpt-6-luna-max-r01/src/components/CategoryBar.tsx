import { CATEGORIES, type Category } from '../types';

interface CategoryBarProps {
  active: Category;
  onChange: (category: Category) => void;
}

export default function CategoryBar({ active, onChange }: CategoryBarProps) {
  return (
    <nav aria-label="内容分类" className="category-scroll -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mb-7 sm:justify-center sm:gap-3 sm:px-0">
      {CATEGORIES.map((category) => (
        <button
          aria-pressed={active === category}
          className={`category-chip shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition sm:px-[19px] sm:py-2.5 sm:text-sm ${active === category ? 'category-chip-active' : 'text-[#716f77] hover:bg-white hover:text-ink'}`}
          key={category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}
