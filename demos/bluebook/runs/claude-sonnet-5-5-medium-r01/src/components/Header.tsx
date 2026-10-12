import { useFeedStore } from '../store/useFeedStore'
import { PlusIcon, SearchIcon } from './Icons'

interface HeaderProps {
  onPublish: () => void
}

export default function Header({ onPublish }: HeaderProps) {
  const query = useFeedStore((s) => s.query)
  const setQuery = useFeedStore((s) => s.setQuery)

  return (
    <header
      className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-3 tablet:px-5">
        <h1 className="shrink-0 text-xl font-extrabold tracking-wide text-brand">小蓝书</h1>
        <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-page px-3 text-gray-400 focus-within:ring-2 focus-within:ring-brand/30">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            aria-label="搜索"
          />
        </label>
        <button
          type="button"
          onClick={onPublish}
          className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-brand px-4 text-sm font-semibold text-white transition active:scale-95"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          发布
        </button>
      </div>
    </header>
  )
}
