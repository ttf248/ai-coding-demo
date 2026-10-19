import { useState } from "react";
import { BookIcon, PlusIcon, SearchIcon, CloseIcon } from "./Icons";

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onPublish: () => void;
}

export default function Header({ query, onQueryChange, onPublish }: HeaderProps) {
  const [focused, setFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.04] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-2 px-3 sm:gap-4 sm:px-6 md:h-16">
        <a href="./" className="flex shrink-0 items-center gap-2" aria-label="小蓝书首页">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-xhs text-white shadow-sm md:h-9 md:w-9">
            <BookIcon className="h-[18px] w-[18px]" />
          </span>
          <span className="hidden text-[17px] font-bold tracking-tight text-gray-900 sm:block">小蓝书</span>
        </a>

        <div
          className={`flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border bg-[#f5f5f5] px-3 transition-all md:mx-auto md:max-w-[540px] md:h-10 ${
            focused ? "border-xhs/30 bg-white ring-2 ring-xhs/10" : "border-transparent"
          }`}
        >
          <SearchIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索你感兴趣的内容"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-gray-400 hover:bg-black/5 hover:text-gray-600"
              aria-label="清除搜索"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onPublish}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-xhs px-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-xhs-dark active:scale-95 md:h-10 md:px-4"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="hidden sm:inline">发布</span>
        </button>
      </div>
    </header>
  );
}
