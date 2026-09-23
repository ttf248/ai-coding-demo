import { SearchIcon, PlusIcon } from './Icons';

interface SiteHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export default function SiteHeader({ query, onQueryChange }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.045] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-3 px-4 sm:h-[76px] sm:gap-7 sm:px-7 lg:px-10">
        <a className="brand-lockup shrink-0" href="#top" aria-label="小蓝书首页">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none">
              <rect x="3" y="4" width="30" height="28" rx="10" fill="url(#brand-gradient)" />
              <path d="M11 11.2c2.5-.8 4.8-.6 7 1v12c-2.2-1.6-4.5-1.8-7-1V11.2Zm14 0c-2.5-.8-4.8-.6-7 1v12c2.2-1.6 4.5-1.8 7-1V11.2Z" fill="white" fillOpacity=".96" />
              <path d="M18 12.3v12" stroke="#FE2C55" strokeWidth="1.1" strokeLinecap="round" />
              <defs>
                <linearGradient id="brand-gradient" x1="4" y1="5" x2="31" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF6B7F" />
                  <stop offset="1" stopColor="#FE2C55" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="brand-name">小蓝书</span>
        </a>

        <form
          className="search-box group mx-auto flex h-10 min-w-0 max-w-[560px] flex-1 items-center rounded-full bg-[#f5f5f6] px-3.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#fe2c55]/15 sm:h-11 sm:px-4"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <SearchIcon className="mr-2 h-[17px] w-[17px] shrink-0 text-[#aaa8b0] transition group-focus-within:text-brand" />
          <input
            aria-label="搜索内容"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#aaa8b0] sm:text-sm"
            placeholder="搜索你感兴趣的内容"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {query && (
            <button
              className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-lg leading-none text-[#aaa8b0] transition hover:bg-black/5 hover:text-ink"
              type="button"
              aria-label="清除搜索"
              onClick={() => onQueryChange('')}
            >
              ×
            </button>
          )}
        </form>

        <button className="publish-button flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition hover:brightness-[.97] active:scale-[.97] sm:h-11 sm:px-5">
          <PlusIcon className="h-[17px] w-[17px]" />
          <span className="hidden sm:inline">发布</span>
        </button>
      </div>
    </header>
  );
}
