import { useState } from "react";
import { useStore } from "../store";

export default function SearchBar() {
  const query = useStore((s) => s.query);
  const setQuery = useStore((s) => s.setQuery);
  const [value, setValue] = useState(query);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <a
          href="#"
          className="shrink-0 text-xl font-bold tracking-wide text-brand"
          aria-label="小蓝书首页"
        >
          小蓝书
        </a>

        <form
          className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-page px-4"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(value.trim());
          }}
        >
          <svg
            className="h-4 w-4 shrink-0 text-neutral-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (!e.target.value) setQuery("");
            }}
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索你感兴趣的内容"
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </form>

        <button
          type="button"
          className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition active:scale-95"
        >
          发布
        </button>
      </div>
    </header>
  );
}
