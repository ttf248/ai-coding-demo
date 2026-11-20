import React from 'react';

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenPublish: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenPublish,
  onRefresh,
  isRefreshing
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200/80">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2.5">
        {/* 左侧 Logo：文字“小蓝书” */}
        <div
          onClick={onRefresh}
          className="flex items-center gap-1.5 cursor-pointer flex-shrink-0 select-none"
          title="点击刷新社区"
        >
          <span className="px-2.5 py-1 rounded-xl bg-[#fe2c55] text-white font-black text-sm tracking-wide shadow-sm">
            小蓝书
          </span>
        </div>

        {/* 中间搜索框：带搜索图标，placeholder“搜索你感兴趣的内容” */}
        <div className="flex-1 max-w-md relative">
          <svg
            className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="w-full h-9 pl-9 pr-8 rounded-full bg-[#f5f5f5] text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#fe2c55]/30 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* 右侧发布按钮 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium transition"
          >
            <span>{isRefreshing ? '刷新中...' : '🔄 下拉刷新'}</span>
          </button>
          <button
            type="button"
            onClick={onOpenPublish}
            className="px-3.5 py-1.5 rounded-full bg-[#fe2c55] hover:bg-[#e02449] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm transition flex items-center gap-1"
          >
            <span>＋ 发布</span>
          </button>
        </div>
      </div>
    </header>
  );
};
