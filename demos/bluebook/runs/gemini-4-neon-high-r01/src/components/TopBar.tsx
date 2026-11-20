import React from "react";
import { useFeedStore } from "../store/useFeedStore";

export const TopBar: React.FC = () => {
  const { searchQuery, setSearchQuery, setPublishOpen, refreshFeed, refreshing } =
    useFeedStore();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left Logo */}
        <button
          type="button"
          onClick={() => refreshFeed()}
          className="shrink-0 flex items-center gap-1.5 group focus:outline-none"
          title="点击刷新小蓝书推荐流"
        >
          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#fe2c55] text-white font-extrabold text-sm sm:text-base tracking-tight shadow-sm group-active:scale-95 transition-transform">
            小蓝书
          </span>
        </button>

        {/* Center Search Box */}
        <div className="flex-1 max-w-xl relative">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索你感兴趣的内容"
            className="w-full h-9 pl-9 pr-8 rounded-full bg-[#f5f5f5] border border-transparent focus:border-[#fe2c55]/40 focus:bg-white focus:outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
              aria-label="清空搜索"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Publish & Quick Refresh Button */}
        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => refreshFeed()}
            disabled={refreshing}
            className="hidden sm:inline-flex items-center gap-1 h-9 px-3 rounded-full bg-[#f5f5f5] hover:bg-slate-200/70 text-slate-600 text-xs font-medium transition-colors"
            title="下拉或点击刷新"
          >
            <span className={refreshing ? "inline-block animate-spin" : ""}>↻</span>
            <span>刷新</span>
          </button>
          <button
            type="button"
            onClick={() => setPublishOpen(true)}
            className="h-9 px-3.5 sm:px-4 rounded-full bg-[#fe2c55] hover:bg-[#e5234a] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-[#fe2c55]/25 transition-all flex items-center gap-1"
          >
            <span className="text-base leading-none">+</span>
            <span>发布</span>
          </button>
        </div>
      </div>
    </header>
  );
};
