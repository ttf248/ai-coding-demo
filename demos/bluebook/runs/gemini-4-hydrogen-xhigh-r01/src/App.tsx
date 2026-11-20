import React, { useEffect, useMemo, useRef } from "react";
import { Header } from "./components/Header";
import { MasonryGrid } from "./components/MasonryGrid";
import { NoteDetailModal } from "./components/NoteDetailModal";
import { PublishModal } from "./components/PublishModal";
import { PullToRefresh } from "./components/PullToRefresh";
import { useBluebookStore } from "./store/useBluebookStore";

export const App: React.FC = () => {
  const notes = useBluebookStore((s) => s.notes);
  const searchQuery = useBluebookStore((s) => s.searchQuery);
  const activeCategory = useBluebookStore((s) => s.activeCategory);
  const isLoadingMore = useBluebookStore((s) => s.isLoadingMore);
  const hasMore = useBluebookStore((s) => s.hasMore);
  const loadMore = useBluebookStore((s) => s.loadMore);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes.filter((n) => {
      const catMatch = activeCategory === "推荐" || n.category === activeCategory;
      const qMatch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q);
      return catMatch && qMatch;
    });
  }, [notes, searchQuery, activeCategory]);

  // 滚动到底部自动加载更多
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "180px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-5 py-3 sm:py-5 animate-fadeIn">
        <PullToRefresh>
          {filteredNotes.length > 0 ? (
            <MasonryGrid notes={filteredNotes} />
          ) : (
            <div className="py-20 text-center text-neutral-400 text-sm">
              没有找到匹配的笔记，换个关键词或点击左上角“小蓝书”重置试试。
            </div>
          )}
        </PullToRefresh>

        <div ref={sentinelRef} className="py-6 flex items-center justify-center">
          {isLoadingMore ? (
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-500">
              <span className="w-4 h-4 border-2 border-[#fe2c55] border-t-transparent rounded-full animate-spin" />
              <span>正在加载更多灵感...</span>
            </div>
          ) : hasMore ? (
            <button
              type="button"
              onClick={() => void loadMore()}
              className="text-xs text-neutral-400 hover:text-[#fe2c55] transition"
            >
              下滑自动加载更多，或点击立即加载
            </button>
          ) : (
            <span className="text-xs text-neutral-400">已经到底啦，下拉顶部可刷新</span>
          )}
        </div>
      </main>

      <NoteDetailModal />
      <PublishModal />
    </div>
  );
};

export default App;
