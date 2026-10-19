import { useFeedStore } from "../store/useFeedStore";
import { CloseIcon, PlusIcon, SearchIcon } from "./Icons";

interface HeaderProps {
  onPublish: () => void;
}

export function Header({ onPublish }: HeaderProps) {
  const query = useFeedStore((state) => state.query);
  const setQuery = useFeedStore((state) => state.setQuery);

  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.045] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[58px] w-full max-w-[1440px] items-center gap-2.5 px-3 sm:gap-5 sm:px-6">
        <a
          href="./"
          className="flex shrink-0 items-center gap-1.5 text-[21px] font-black tracking-tight text-brand sm:text-[23px]"
          aria-label="小蓝书首页"
          onClick={(event) => {
            event.preventDefault();
            setQuery("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-brand text-[13px] font-black text-white shadow-sm shadow-brand/30">
            书
          </span>
          小蓝书
        </a>

        <div className="relative min-w-0 flex-1 sm:mx-auto sm:max-w-[520px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            enterKeyHint="search"
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索笔记"
            className="h-9 w-full rounded-full border border-transparent bg-[#f4f4f4] pl-9 pr-9 text-[13px] text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-brand/25 focus:bg-white focus:ring-2 focus:ring-brand/10 sm:h-10"
          />
          {query && (
            <button
              type="button"
              aria-label="清空搜索"
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-200/70 hover:text-neutral-600"
              onClick={() => setQuery("")}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onPublish}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-brand px-3 text-[13px] font-semibold text-white shadow-sm shadow-brand/25 transition hover:bg-[#e6244b] active:scale-95 sm:h-10 sm:px-4"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="hidden xs:inline sm:inline">发布</span>
        </button>
      </div>
    </header>
  );
}
