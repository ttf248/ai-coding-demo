import { useFeedStore } from "../store";
import { CATEGORIES } from "../data";

export default function TopBar() {
  const keyword = useFeedStore((state) => state.keyword);
  const setKeyword = useFeedStore((state) => state.setKeyword);
  const category = useFeedStore((state) => state.category);
  const setCategory = useFeedStore((state) => state.setCategory);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-3 py-2.5 sm:gap-5 sm:px-6">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-base font-black text-white shadow-card">
            小
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            小蓝书
          </span>
        </div>

        <label className="relative flex-1">
          <span className="sr-only">搜索你感兴趣的内容</span>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="w-full rounded-full bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-brand/40"
          />
        </label>

        <button
          type="button"
          className="shrink-0 rounded-full bg-brand px-3 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-brand-deep active:scale-95 sm:px-5"
        >
          发布
        </button>
      </div>

      <nav className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-3 pb-2 sm:px-6">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs transition ${
              category === item
                ? "bg-brand/10 font-semibold text-brand"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}
