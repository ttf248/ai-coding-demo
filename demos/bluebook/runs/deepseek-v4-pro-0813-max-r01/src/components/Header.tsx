import { useStore } from '../store';

export default function Header() {
  const query = useStore((s) => s.query);
  const setQuery = useStore((s) => s.setQuery);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-3xl px-3 py-2.5 flex items-center gap-3">
        <div className="text-brand text-xl font-black tracking-tight whitespace-nowrap select-none">
          小蓝书
        </div>
        <div className="flex-1 flex items-center bg-page rounded-full px-3.5 py-2">
          <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="flex-1 ml-2 bg-transparent outline-none text-sm placeholder:text-gray-400 min-w-0"
            data-testid="search-input"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 text-sm shrink-0" aria-label="清空搜索">
              ✕
            </button>
          )}
        </div>
        <button
          className="bg-brand text-white text-sm font-medium px-4 py-1.5 rounded-full active:scale-95 transition-transform whitespace-nowrap"
          data-testid="publish"
        >
          发布
        </button>
      </div>
    </header>
  );
}
