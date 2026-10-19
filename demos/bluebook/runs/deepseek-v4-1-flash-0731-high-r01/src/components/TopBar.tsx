import { useState } from "react";

interface Props {
  onSearch: (keyword: string) => void;
  onPublish: () => void;
}

/** 顶部搜索栏：左侧 logo、中间搜索框、右侧发布按钮 */
export function TopBar({ onSearch, onPublish }: Props) {
  const [value, setValue] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3">
        {/* Logo：文字「小蓝书」 */}
        <button
          type="button"
          onClick={() => {
            setValue("");
            onSearch("");
          }}
          className="shrink-0 text-[17px] font-extrabold tracking-tight text-xhs sm:text-[19px]"
          aria-label="返回首页"
        >
          小蓝书
        </button>

        {/* 搜索框 */}
        <form
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-neutral-100 px-3 py-2 focus-within:bg-neutral-50 focus-within:ring-1 focus-within:ring-xhs/40"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(value.trim());
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0 text-neutral-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.6-3.6" strokeLinecap="round" />
          </svg>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
            aria-label="搜索内容"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                onSearch("");
              }}
              className="shrink-0 text-neutral-400 hover:text-neutral-600"
              aria-label="清空搜索"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </form>

        {/* 发布按钮 */}
        <button
          type="button"
          onClick={onPublish}
          className="shrink-0 rounded-full bg-xhs px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-transform active:scale-95 sm:px-4"
        >
          发布
        </button>
      </div>
    </header>
  );
}
