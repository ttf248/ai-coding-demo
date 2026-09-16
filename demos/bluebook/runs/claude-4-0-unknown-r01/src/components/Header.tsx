import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { usePostStore } from '../store/postStore';

const Header: React.FC = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { searchKeyword, setSearchKeyword, refreshPosts } = usePostStore();

  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    if (keyword.trim() !== searchKeyword) {
      await refreshPosts();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchKeyword('');
    refreshPosts();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-xl font-bold text-primary">小蓝书</h1>
        </div>

        {/* 搜索框 */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div
              className={`relative flex items-center bg-gray-100 rounded-full transition-all duration-200 ${
                isSearchFocused ? 'bg-white border-2 border-primary/20 shadow-md' : ''
              }`}
            >
              <Search 
                className={`absolute left-3 h-4 w-4 transition-colors duration-200 ${
                  isSearchFocused ? 'text-primary' : 'text-gray-400'
                }`} 
              />
              <input
                type="text"
                placeholder="搜索你感兴趣的内容"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-10 py-2 bg-transparent text-sm text-gray-700 placeholder-gray-500 border-none outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 发布按钮 */}
        <div className="flex-shrink-0">
          <button className="flex items-center space-x-1 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">发布</span>
          </button>
        </div>
      </div>

      {/* 搜索结果提示 */}
      {searchKeyword && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm text-gray-600">
              搜索结果: <span className="font-medium text-primary">"{searchKeyword}"</span>
            </span>
            <button
              onClick={clearSearch}
              className="text-xs text-gray-500 hover:text-primary transition-colors"
            >
              清除搜索
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
