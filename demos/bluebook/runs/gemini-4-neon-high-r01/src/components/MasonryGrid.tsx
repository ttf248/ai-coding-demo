import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFeedStore } from "../store/useFeedStore";
import type { NoteItem } from "../types/note";
import { NoteCard } from "./NoteCard";

function useColumnCount(): number {
  const getCols = () => {
    if (typeof window === "undefined") return 2;
    if (window.innerWidth >= 1024) return 4; // Desktop: 4 columns
    if (window.innerWidth >= 640) return 3; // Tablet: 3 columns
    return 2; // Mobile: 2 columns
  };
  const [cols, setCols] = useState(getCols);
  useEffect(() => {
    const onResize = () => setCols(getCols());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return cols;
}

export const MasonryGrid: React.FC<{ notes: NoteItem[] }> = ({ notes }) => {
  const cols = useColumnCount();
  const { loading, hasMore, loadMore } = useFeedStore();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Shortest-column masonry balancing so varied image heights stay visually crisp
  const columns = useMemo(() => {
    const buckets: NoteItem[][] = Array.from({ length: cols }, () => []);
    const heights = new Array<number>(cols).fill(0);
    for (const note of notes) {
      let minIdx = 0;
      for (let i = 1; i < cols; i++) {
        if (heights[i] < heights[minIdx]) minIdx = i;
      }
      buckets[minIdx].push(note);
      heights[minIdx] += note.aspectRatio + 0.38;
    }
    return buckets;
  }, [notes, cols]);

  // Auto load more when scrolling to bottom
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "220px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  if (notes.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 animate-fade-in">
        <p className="text-base font-medium text-slate-500">没有找到相关笔记</p>
        <p className="text-xs mt-1">试试换一个关键词或切换分类吧</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="grid gap-2.5 sm:gap-3.5 items-start"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {columns.map((colItems, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-2.5 sm:gap-3.5 min-w-0">
            {colItems.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Infinite Scroll Sentinel & Loading Indicator */}
      <div ref={sentinelRef} className="py-7 flex items-center justify-center">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-4 h-4 rounded-full border-2 border-[#fe2c55] border-t-transparent animate-spin" />
            <span>正在加载更多灵感...</span>
          </div>
        ) : hasMore ? (
          <button
            type="button"
            onClick={() => loadMore()}
            className="text-xs text-slate-500 hover:text-[#fe2c55] px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200"
          >
            点击加载更多
          </button>
        ) : (
          <span className="text-xs text-slate-400">— 已经滑到底部啦 —</span>
        )}
      </div>
    </div>
  );
};
