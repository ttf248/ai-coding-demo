import { useStore } from "../store";

export default function SearchBar() {
  const query = useStore((s) => s.query);
  const setQuery = useStore((s) => s.setQuery);
  const setPublish = useStore((s) => s.setPublish);
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5 sm:px-5">
        <a href="#" className="flex flex-none items-center gap-1.5" aria-label="小蓝书首页">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-primary" aria-hidden>
            <path d="M5 3h11a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3V3z" opacity="0.9" />
            <path d="M5 3v15a3 3 0 0 0 3 3h11v-3H8a1 1 0 0 1 0-2h11V3H5z" fill="#fff" opacity="0.35" />
          </svg>
          <span className="text-lg font-extrabold tracking-tight text-primary">小蓝书</span>
        </a>
        <label className="relative min-w-0 flex-1">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-gray-400 fill-none"
            strokeWidth={2}
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="w-full rounded-full border border-transparent bg-page py-2.5 pl-10 pr-4 text-[13px] outline-none transition focus:border-primary/40 focus:bg-white"
          />
        </label>
        <button
          type="button"
          onClick={() => setPublish(true)}
          className="flex-none rounded-full bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition active:scale-95"
        >
          发布
        </button>
      </div>
    </header>
  );
}
