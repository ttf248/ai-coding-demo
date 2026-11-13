import { useFeedStore } from "../store/useFeedStore";

export default function SearchBar() {
  const query = useFeedStore((s) => s.query);
  const setQuery = useFeedStore((s) => s.setQuery);
  const refresh = useFeedStore((s) => s.refresh);

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={() => void refresh()}
          className="shrink-0 text-lg font-extrabold tracking-tight text-primary"
          aria-label="小蓝书，点击刷新"
        >
          小蓝书
        </button>
        <label className="relative min-w-0 flex-1">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-neutral-400"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="h-9 w-full rounded-full bg-surface pl-9 pr-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
          />
        </label>
        <button
          type="button"
          onClick={() => alert("发布功能演示：这里会打开笔记编辑器。")}
          className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
        >
          发布
        </button>
      </div>
    </header>
  );
}