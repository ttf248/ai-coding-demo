export default function SearchBar() {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <span className="text-lg font-bold text-brand">小蓝书</span>
        <div className="flex h-9 flex-1 items-center gap-2 rounded-full bg-gray-100 px-3">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            placeholder="搜索你感兴趣的内容"
          />
        </div>
        <button className="h-9 shrink-0 rounded-full bg-brand px-4 text-sm font-medium text-white active:scale-95 transition-transform">
          发布
        </button>
      </div>
    </header>
  )
}
