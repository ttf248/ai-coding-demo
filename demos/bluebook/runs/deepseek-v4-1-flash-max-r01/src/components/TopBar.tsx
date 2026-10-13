export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-3 py-2.5">
        <span className="text-xhs font-extrabold text-xl tracking-tight shrink-0 select-none">
          小蓝书
        </span>
        <div className="flex-1 relative">
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            aria-label="搜索"
            placeholder="搜索你感兴趣的内容"
            className="w-full h-9 rounded-full bg-page pl-9 pr-4 text-sm outline-none
                       focus:ring-2 focus:ring-xhs/35 placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          className="h-9 px-4 rounded-full bg-xhs text-white text-sm font-medium shrink-0
                     active:scale-95 transition-transform shadow-sm shadow-xhs/30"
        >
          ＋ 发布
        </button>
      </div>
    </header>
  );
}
