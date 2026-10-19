import { useStore } from "../store/useStore";

interface Props {
  onPublish: () => void;
}

export default function TopBar({ onPublish }: Props) {
  const query = useStore((s) => s.query);
  const setQuery = useStore((s) => s.setQuery);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="h-6 w-1.5 rounded-full bg-primary" />
          <span className="text-lg font-bold tracking-tight text-[#1f2329]">
            小蓝书
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-canvas px-4 py-2">
          <svg
            className="h-4 w-4 shrink-0 text-[#8a8f99]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a8adb8]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="shrink-0 text-[#8a8f99] hover:text-[#1f2329]"
              aria-label="清空搜索"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={onPublish}
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition active:scale-95 hover:bg-primary-deep"
        >
          发布
        </button>
      </div>
    </header>
  );
}
