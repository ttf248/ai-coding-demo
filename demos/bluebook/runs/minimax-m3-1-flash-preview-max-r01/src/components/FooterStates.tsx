export const Spinner = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`animate-spin-slow ${className}`} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const LoadingMore = () => (
  <div className="flex items-center justify-center gap-2 py-6 text-sm text-[#999]">
    <Spinner />
    <span>正在加载更多…</span>
  </div>
);

export const NoMore = () => (
  <p className="py-6 text-center text-xs text-[#bbb]">— 已经到底啦 —</p>
);

export const EmptyState = () => (
  <div className="flex flex-col items-center gap-3 py-20 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-2xl">
      🔍
    </div>
    <p className="text-sm text-[#888]">没有找到相关内容</p>
    <p className="text-xs text-[#bbb]">换个关键词再试试看</p>
  </div>
);
