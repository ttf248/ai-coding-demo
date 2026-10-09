import React, { useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onPublish?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onPublish }) => {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto flex items-center gap-3">
        {/* Logo */}
        <div className="font-bold text-lg text-xiaohongshu">小蓝书</div>

        {/* 搜索框 */}
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="搜索你感兴趣的内容"
            value={query}
            onChange={handleSearch}
            className="flex-1 bg-transparent outline-none text-sm ml-2"
          />
        </div>

        {/* 发布按钮 */}
        <button
          onClick={onPublish}
          className="bg-xiaohongshu text-white rounded-full px-4 py-1.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          发布
        </button>
      </div>
    </div>
  );
};
