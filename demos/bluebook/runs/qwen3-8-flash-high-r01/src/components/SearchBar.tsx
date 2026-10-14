import { useFeedStore } from "../store/feed";

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function SearchBar({ onPublish }: { onPublish: () => void }) {
  const keyword = useFeedStore((s) => s.keyword);
  const setKeyword = useFeedStore((s) => s.setKeyword);
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5">
        <h1 className="shrink-0 text-xl font-bold tracking-tight text-brand">
          小蓝书
        </h1>
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-card bg-[#f3f4f6] px-3 py-1.5">
          <SearchIcon />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            type="search"
            enterKeyHint="search"
          />
        </label>
        <button
          onClick={onPublish}
          className="shrink-0 rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white shadow-sm transition active:scale-95 hover:brightness-105"
        >
          发布
        </button>
      </div>
    </header>
  );
}
