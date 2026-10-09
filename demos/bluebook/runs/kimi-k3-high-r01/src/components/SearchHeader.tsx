import { useNoteStore } from '../store'

export default function SearchHeader() {
  const keyword = useNoteStore((s) => s.keyword)
  const setKeyword = useNoteStore((s) => s.setKeyword)

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 h-14">
        <div className="text-brand text-xl font-black tracking-wider select-none">小蓝书</div>
        <div className="flex-1 max-w-md mx-auto">
          <div className="flex items-center bg-page rounded-full px-3 h-9">
            <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索你感兴趣的内容"
              className="flex-1 bg-transparent outline-none px-2 text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>
        <button
          onClick={() => alert('发布功能演示：请假装打开了编辑器 ✍️')}
          className="shrink-0 bg-brand text-white text-sm font-semibold px-4 h-9 rounded-full active:scale-95 transition-transform"
        >
          ＋ 发布
        </button>
      </div>
    </header>
  )
}
