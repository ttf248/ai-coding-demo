import { useEffect, useState, type FormEvent } from 'react';
import { useFeedStore } from '../store/useFeedStore';
import { CATEGORIES } from '../mock/data';
import { CloseIcon, PlusIcon, SearchIcon } from './icons';

function CategoryTabs() {
  const category = useFeedStore((s) => s.category);
  const setCategory = useFeedStore((s) => s.setCategory);
  const refresh = useFeedStore((s) => s.refresh);
  return (
    <nav aria-label="频道" className="mx-auto max-w-6xl px-1 md:px-4">
      <div className="no-scrollbar flex overflow-x-auto" role="tablist">
        {CATEGORIES.map((c) => {
          const active = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                window.scrollTo({ top: 0 });
                // Tapping the current tab again refreshes it (desktop alternative to pull-to-refresh).
                if (active) void refresh();
                else setCategory(c.id);
              }}
              className={`relative shrink-0 px-3 pb-2.5 pt-1.5 text-[15px] transition-colors ${active ? 'font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {c.label}
              <span className={`absolute bottom-1 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-brand transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function Header({ onPublish }: { onPublish: () => void }) {
  const query = useFeedStore((s) => s.query);
  const setQuery = useFeedStore((s) => s.setQuery);
  const [value, setValue] = useState(query);
  useEffect(() => setValue(query), [query]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setQuery(value);
    (document.activeElement as HTMLElement | null)?.blur();
    window.scrollTo({ top: 0 });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur-md" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 md:h-16 md:gap-6 md:px-6">
        <a
          href="#/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="shrink-0 text-[22px] font-extrabold tracking-tight text-brand md:text-2xl"
          aria-label="小蓝书 首页"
        >
          小蓝书
        </a>
        <form role="search" onSubmit={submit} className="relative min-w-0 flex-1 md:mx-auto md:max-w-xl">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            enterKeyHint="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索"
            className="h-9 w-full rounded-full bg-gray-100 pl-8 pr-8 text-base text-gray-900 outline-none ring-brand/30 transition placeholder:text-gray-400 focus:bg-white focus:ring-2 md:h-10 md:pl-9 md:text-sm"
          />
          {value && (
            <button
              type="button"
              aria-label="清除搜索"
              onClick={() => {
                setValue('');
                setQuery('');
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </form>
        <button
          type="button"
          onClick={onPublish}
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-brand px-3 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark active:scale-95 md:h-10 md:px-5"
        >
          <PlusIcon size={16} strokeWidth={2.6} />
          发布
        </button>
      </div>
      <CategoryTabs />
    </header>
  );
}
