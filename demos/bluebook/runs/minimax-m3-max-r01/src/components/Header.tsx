import { Search, Plus } from "./Icons";
import { usePosts } from "../store/usePosts";

export function Header() {
  const query = usePosts((s) => s.query);
  const setQuery = usePosts((s) => s.setQuery);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-screen-xl flex items-center gap-3 px-4 py-3">
        <div className="text-brand font-bold text-lg tracking-tight select-none whitespace-nowrap">
          小蓝书
        </div>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="搜索你感兴趣的内容"
            className="w-full rounded-full bg-neutral-100 pl-9 pr-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand/40 transition"
          />
        </div>
        <button
          type="button"
          className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand text-white px-3 py-2 text-sm font-medium shadow-card hover:bg-brand-600 active:scale-[0.97] transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">发布</span>
        </button>
      </div>
    </header>
  );
}