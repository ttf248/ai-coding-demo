import { useFeedStore } from "../store/useFeedStore";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function Header() {
  const keyword = useFeedStore((s) => s.keyword);
  const setKeyword = useFeedStore((s) => s.setKeyword);
  const publish = useFeedStore((s) => s.publish);

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 sm:gap-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-black text-white shadow-sm">
            蓝
          </span>
          <span className="hidden text-[17px] font-bold tracking-tight text-brand sm:inline">
            小蓝书
          </span>
        </div>

        <label className="relative mx-auto flex min-w-0 max-w-[520px] flex-1 items-center">
          <span className="pointer-events-none absolute left-3 text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索你感兴趣的内容"
            className="h-9 w-full rounded-full border border-transparent bg-canvas pl-9 pr-9 text-[13px] text-slate-700 outline-none transition focus:border-brand/40 focus:bg-white sm:text-sm"
          />
          {keyword && (
            <button
              type="button"
              aria-label="清除搜索"
              onClick={() => setKeyword("")}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </label>

        <button
          type="button"
          onClick={publish}
          className="flex shrink-0 items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition active:scale-95 hover:bg-[#e8254b] sm:px-4 sm:text-sm"
        >
          <span className="text-base leading-none sm:hidden">＋</span>
          <span className="hidden sm:inline">＋ 发布</span>
        </button>
      </div>
    </header>
  );
}
