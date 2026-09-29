import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { PlusIcon, SearchIcon } from "./Icons";

export default function SearchBar() {
  const keyword = useAppStore((s) => s.keyword);
  const setKeyword = useAppStore((s) => s.setKeyword);
  const submitSearch = useAppStore((s) => s.submitSearch);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused) return;
    const timer = window.setTimeout(() => {
      if (keyword !== useAppStore.getState().query) submitSearch(keyword);
    }, 320);
    return () => window.clearTimeout(timer);
  }, [keyword, focused, submitSearch]);

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-3 sm:h-16 sm:gap-4 sm:px-6">
        <div className="shrink-0 select-none text-[17px] font-bold tracking-tight text-brand sm:text-xl">
          小蓝书
        </div>

        <form
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-canvas px-3 py-2 transition-colors focus-within:bg-white focus-within:ring-1 focus-within:ring-brand/40 sm:px-4"
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch(keyword);
          }}
        >
          <SearchIcon className="h-4 w-4 shrink-0 text-[#999]" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="搜索你感兴趣的内容"
            className="w-full min-w-0 bg-transparent text-sm text-[#222] outline-none placeholder:text-[#aaa]"
            aria-label="搜索你感兴趣的内容"
          />
        </form>

        <button
          type="button"
          className="flex shrink-0 items-center gap-1 rounded-full bg-brand px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark active:scale-95 sm:px-4"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="hidden sm:inline">发布</span>
        </button>
      </div>
    </header>
  );
}
