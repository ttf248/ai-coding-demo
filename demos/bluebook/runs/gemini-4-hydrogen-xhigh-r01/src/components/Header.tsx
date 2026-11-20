import React from "react";
import { CATEGORIES_LIST } from "../data/mockNotes";
import { useBluebookStore } from "../store/useBluebookStore";

export const Header: React.FC = () => {
  const searchQuery = useBluebookStore((s) => s.searchQuery);
  const setSearchQuery = useBluebookStore((s) => s.setSearchQuery);
  const activeCategory = useBluebookStore((s) => s.activeCategory);
  const setActiveCategory = useBluebookStore((s) => s.setActiveCategory);
  const setPublishOpen = useBluebookStore((s) => s.setPublishOpen);
  const refreshFeed = useBluebookStore((s) => s.refreshFeed);
  const isRefreshing = useBluebookStore((s) => s.isRefreshing);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-14 flex items-center gap-2.5 sm:gap-4">
        {/* 左侧 Logo */}
        <button
          type="button"
          onClick={() => {
            setActiveCategory("推荐");
            setSearchQuery("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="shrink-0 flex items-center gap-1.5 text-left focus:outline-none"
        >
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#fe2c55] text-white font-bold text-sm tracking-wide shadow-sm">
            小蓝书
          </span>
        </button>

        {/* 中间搜索框 */}
        <div className="flex-1 min-w-0 relative">
          <svg
            className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索你感兴趣的内容"
            className="w-full h-9 pl-9 pr-3 rounded-full bg-neutral-100 text-sm text-neutral-800 placeholder:text-neutral-400 border border-transparent focus:border-[#fe2c55]/50 focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* 右侧发布与刷新按钮 */}
        <div className="shrink-0 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => void refreshFeed()}
            disabled={isRefreshing}
            title="刷新推荐流"
            className="hidden sm:inline-flex items-center justify-center h-9 px-3 rounded-full border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition disabled:opacity-50"
          >
            {isRefreshing ? "刷新中..." : "刷新"}
          </button>
          <button
            type="button"
            onClick={() => setPublishOpen(true)}
            className="h-9 px-3.5 sm:px-4 rounded-full bg-[#fe2c55] hover:bg-[#e5244a] active:scale-95 text-white text-sm font-semibold shadow-sm transition flex items-center gap-1"
          >
            <span className="text-base leading-none">+</span>
            <span>发布</span>
          </button>
        </div>
      </div>

      {/* 频道标签栏 */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES_LIST.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition ${
                active
                  ? "bg-[#fe2c55]/10 text-[#fe2c55] font-semibold"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </header>
  );
};
