import React, { useState } from 'react';
import { useFeedStore } from '../store/feedStore';
import { CloseIcon, PlusIcon, SearchIcon } from './Icons';

const SiteHeader: React.FC = () => {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const { searchKeyword, setSearchKeyword, refreshPosts, activeCategory } =
    useFeedStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(input.trim());
    void refreshPosts();
  };

  const clear = () => {
    setInput('');
    setSearchKeyword('');
    void refreshPosts();
  };

  const showClear = input.length > 0 || searchKeyword.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-white shadow-sm">
            蓝
          </span>
          <span className="text-base font-bold tracking-tight text-gray-900">
            小蓝书
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <div
            className={`flex items-center rounded-full bg-gray-100 transition-all duration-200 ${
              focused
                ? 'bg-white ring-2 ring-primary/40 shadow-md'
                : 'ring-1 ring-transparent'
            }`}
          >
            <SearchIcon
              size={16}
              className={`ml-3 flex-shrink-0 transition-colors duration-200 ${
                focused ? 'text-primary' : 'text-gray-400'
              }`}
            />
            <input
              type="search"
              inputMode="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="搜索你感兴趣的内容"
              className="w-full bg-transparent px-2 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {showClear && (
              <button
                type="button"
                onClick={clear}
                aria-label="清除搜索"
                className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300"
              >
                <CloseIcon size={12} />
              </button>
            )}
          </div>
        </form>

        <button
          type="button"
          className="hidden xs:flex flex-shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          <PlusIcon size={14} />
          <span>发布</span>
        </button>
        <button
          type="button"
          aria-label="发布"
          className="xs:hidden flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          <PlusIcon size={14} />
        </button>
      </div>

      {searchKeyword && (
        <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-2 text-xs text-gray-500">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span>
              搜索 “
              <span className="font-medium text-primary">{searchKeyword}</span>
              ”{activeCategory !== 'recommend' && (
                <>
                  {' · '}
                  <span className="font-medium text-primary">
                    {activeCategory}
                  </span>
                </>
              )}
              ”
            </span>
            <button
              onClick={clear}
              className="rounded-full px-2 py-0.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-primary"
            >
              清除搜索
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
