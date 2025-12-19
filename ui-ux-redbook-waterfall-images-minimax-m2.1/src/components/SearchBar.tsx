import { useState } from 'react'
import { useStore } from '../store/useStore'

// 搜索图标
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

// 发布图标
const PublishIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const SearchBar = () => {
  const [keyword, setKeyword] = useState('')
  const { searchPosts } = useStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchPosts(keyword)
  }

  const handleClear = () => {
    setKeyword('')
    searchPosts('')
  }

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <h1 className="text-redbook font-bold text-xl tracking-tight">小蓝书</h1>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="flex-1 mx-4">
          <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2">
            <SearchIcon />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索你感兴趣的内容"
              className="flex-1 ml-2 bg-transparent outline-none text-sm placeholder-gray-400"
            />
            {keyword && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* 发布按钮 */}
        <button className="flex items-center justify-center w-8 h-8 text-redbook bg-redbook/10 rounded-full press-effect">
          <PublishIcon />
        </button>
      </div>
    </div>
  )
}
