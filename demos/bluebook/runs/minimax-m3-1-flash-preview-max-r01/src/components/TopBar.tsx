import { CloseIcon, PlusIcon, SearchIcon } from "./Icons";

interface Props {
  keyword: string;
  onChange: (keyword: string) => void;
  onPublish: () => void;
}

export default function TopBar({ keyword, onChange, onPublish }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center gap-3 px-3 sm:px-4">
        <a href="#top" className="shrink-0 select-none text-[19px] font-bold tracking-tight">
          <span className="text-brand">小蓝</span>
          <span className="text-neutral-800">书</span>
        </a>

        <div className="group relative flex min-w-0 flex-1 items-center">
          <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-neutral-400 transition-colors duration-150 group-focus-within:text-brand" />
          <input
            type="search"
            value={keyword}
            onChange={(e) => onChange(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索你感兴趣的内容"
            className="h-9 w-full rounded-full border border-transparent bg-[#f2f2f3] pl-9 pr-9 text-[13px] text-neutral-800 outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-brand/25 focus:bg-white"
          />
          {keyword && (
            <button
              type="button"
              aria-label="清空搜索"
              onClick={() => onChange("")}
              className="absolute right-2.5 grid h-5 w-5 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-600"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onPublish}
          data-publish
          className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-brand px-3.5 text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(254,44,85,0.28)] transition duration-150 ease-spring hover:bg-brand-soft active:scale-95"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">发布</span>
        </button>
      </div>
    </header>
  );
}
