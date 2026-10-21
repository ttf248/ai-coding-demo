import { useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        document.getElementById("feed-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2.5 sm:gap-6 sm:px-6">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-black text-white">
            小
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-brand sm:inline">
            小蓝书
          </span>
        </div>

        <div
          className={`flex flex-1 items-center gap-2 rounded-full border bg-neutral-100/80 px-3 py-2 transition-colors ${
            focused ? "border-brand/40 bg-white" : "border-transparent"
          }`}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-neutral-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <input
            id="feed-search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          {value && (
            <button
              type="button"
              aria-label="清空搜索"
              onClick={() => onChange("")}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m9 9 6 6M15 9l-6 6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => window.alert("发布入口：演示版本不包含上传流程。")}
          className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90 active:scale-95 sm:px-6"
        >
          发布
        </button>
      </div>
    </header>
  );
}
