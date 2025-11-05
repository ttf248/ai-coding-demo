import React, { useState } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useStore()
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    setSearchQuery('')
  }

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-redbook">
            小蓝书
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="搜索标题、作者或类型（如：tall/short）"
              className={`w-full pl-10 pr-10 py-2 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-redbook/20 text-sm transition-all ${
                isFocused ? 'bg-white shadow-md' : ''
              }`}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <button className="p-2 bg-redbook text-white rounded-full hover:bg-redbook/90 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
