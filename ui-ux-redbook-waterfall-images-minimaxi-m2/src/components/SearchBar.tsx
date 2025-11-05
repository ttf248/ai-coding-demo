import React from 'react'
import { Search, Plus } from 'lucide-react'
import { useStore } from '../store/useStore'

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useStore()

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
              placeholder="搜索你感兴趣的内容"
              className="w-full pl-10 pr-4 py-2 bg-bg-gray rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-redbook/20 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
