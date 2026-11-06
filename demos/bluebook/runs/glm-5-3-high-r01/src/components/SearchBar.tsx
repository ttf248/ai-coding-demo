import { useFeed } from "../store";

export default function SearchBar() {
  const search = useFeed((s) => s.search);
  const setSearch = useFeed((s) => s.setSearch);
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 bg-page/95 px-4 py-3 backdrop-blur">
      <span className="shrink-0 text-lg font-black italic tracking-tight text-brand">
        小蓝书
      </span>
      <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 fill-none stroke-slate-400"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索你感兴趣的内容"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
      <button className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition active:scale-95">
        发布
      </button>
    </header>
  );
}
