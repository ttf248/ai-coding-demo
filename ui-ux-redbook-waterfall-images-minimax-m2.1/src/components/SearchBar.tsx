import { useState, useCallback } from 'react'
import { useStore } from '../store/useStore'

// 搜索图标
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

// 发布图标
const PublishIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

// 清除图标
const ClearIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export const SearchBar = () => {
  const [keyword, setKeyword] = useState('')
  const { searchPosts } = useStore()

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    searchPosts(keyword)
  }, [keyword, searchPosts])

  const handleClear = useCallback(() => {
    setKeyword('')
    searchPosts('')
  }, [searchPosts])

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {/* Logo */}
        <h1 className="text-redbook font-bold text-xl shrink-0">小蓝书</h1>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-redbook/20 focus-within:bg-white">
            <SearchIcon />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索你感兴趣的内容"
              className="flex-1 ml-2 bg-transparent outline-none text-sm placeholder-gray-400 text-gray-700"
            />
            {keyword && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <ClearIcon />
              </button>
            )}
          </div>
        </form>

        {/* 发布按钮 */}
        <button className="flex items-center justify-center w-9 h-9 text-redbook bg-red-50 rounded-full hover:bg-red-100 transition-colors press-effect shrink-0">
          <PublishIcon />
        </button>
      </div>
    </div>
  )
}
