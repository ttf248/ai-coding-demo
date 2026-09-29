import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { PublishIcon, SearchIcon } from "./Icons";

export default function SearchBar() {
  const keyword = useAppStore((s) => s.keyword);
  const query = useAppStore((s) => s.query);
  const setKeyword = useAppStore((s) => s.setKeyword);
  const commitSearch = useAppStore((s) => s.commitSearch);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing || keyword === query) return;
    const timer = window.setTimeout(() => commitSearch(keyword), 300);
    return () => window.clearTimeout(timer);
  }, [keyword, query, editing, commitSearch]);

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-3 sm:h-16 sm:gap-5 sm:px-6">
        <div className="shrink-0 text-lg font-black tracking-tight text-brand sm:text-xl">
          小蓝书
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            commitSearch(keyword);
          }}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-transparent bg-canvas px-3.5 py-2 transition-all focus-within:border-brand/30 focus-within:bg-white sm:px-4"
        >
          <SearchIcon className="h-4 w-4 shrink-0 text-[#a0a0a0]" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onFocus={() => setEditing(true)}
            onBlur={() => setEditing(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitSearch(keyword);
            }}
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索你感兴趣的内容"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#b0b0b0]"
          />
        </form>

        <button
          type="button"
          className="flex shrink-0 items-center gap-1 rounded-full bg-brand px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-95 sm:px-4"
        >
          <PublishIcon className="h-4 w-4" />
          <span className="hidden sm:inline">发布</span>
        </button>
      </div>
    </header>
  );
}
