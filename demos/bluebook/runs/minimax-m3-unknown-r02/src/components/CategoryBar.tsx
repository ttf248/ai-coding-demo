import React from 'react';
import { useFeedStore } from '../store/feedStore';
import { CATEGORIES } from '../data/posts';
import type { CategoryId } from '../types';

const CategoryBar: React.FC = () => {
  const { activeCategory, setActiveCategory, refreshPosts } = useFeedStore();

  const handleSelect = (id: CategoryId) => {
    setActiveCategory(id);
    void refreshPosts();
  };

  return (
    <div className="sticky top-14 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="hide-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-all duration-200 ${
                active
                  ? 'bg-primary font-medium text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;
