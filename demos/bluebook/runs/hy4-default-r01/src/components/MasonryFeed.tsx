import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import { MOCK_NOTES } from "../data/mockNotes";
import { PAGE_SIZE, useFeedStore } from "../store/useFeedStore";
import type { Note } from "../types";
import { Loading } from "./Loading";
import { NoteCard } from "./NoteCard";

function columnCount(): number {
  const w = typeof window === "undefined" ? 1024 : window.innerWidth;
  if (w >= 1024) return 4;
  if (w >= 640) return 3;
  return 2;
}

function useColumns(): number {
  const [cols, setCols] = useState<number>(columnCount);
  useEffect(() => {
    const onResize = () => setCols(columnCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return cols;
}

/** 最短列优先的真实瀑布流分配，而不是 CSS columns 的纵向填空。 */
function distribute(notes: Note[], cols: number): Note[][] {
  const buckets: Note[][] = Array.from({ length: cols }, () => []);
  const heights = new Array<number>(cols).fill(0);
  for (const note of notes) {
    let target = 0;
    for (let i = 1; i < cols; i++) if (heights[i] < heights[target]) target = i;
    buckets[target].push(note);
    heights[target] += note.height / note.width + 0.34;
  }
  return buckets;
}

export function MasonryFeed() {
  const notes = useFeedStore((s) => s.notes);
  const page = useFeedStore((s) => s.page);
  const loading = useFeedStore((s) => s.loading);
  const refreshing = useFeedStore((s) => s.refreshing);
  const keyword = useFeedStore((s) => s.keyword);
  const version = useFeedStore((s) => s.version);
  const loadMore = useFeedStore((s) => s.loadMore);
  const refresh = useFeedStore((s) => s.refresh);

  const cols = useColumns();
  const sentinel = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [showTop, setShowTop] = useState(false);

  const searching = keyword.trim().length > 0;
  const filtered: Note[] = searching
    ? MOCK_NOTES.filter((n) =>
        `${n.title}${n.author}${n.tag}`.toLowerCase().includes(keyword.trim().toLowerCase()),
      )
    : notes;
  const buckets = distribute(filtered, cols);
  const hasMore = !searching && page < Math.ceil(MOCK_NOTES.length / PAGE_SIZE);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || searching) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "280px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [loadMore, notes.length, searching]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 620);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const begin = (y: number) => {
    if (window.scrollY <= 2 && !searching) startY.current = y;
  };
  const move = (y: number) => {
    if (startY.current === null) return;
    const delta = y - startY.current;
    if (delta > 0 && window.scrollY <= 2) setPull(Math.min(88, delta * 0.48));
    else setPull(0);
  };
  const end = () => {
    if (pull >= 48) refresh();
    setPull(0);
    startY.current = null;
  };

  return (
    <main className="relative mx-auto max-w-[1400px] px-2 pb-10 pt-3 sm:px-5 sm:pt-5">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center transition-opacity"
        style={{ opacity: pull > 4 ? 1 : 0, transform: `translateY(${Math.min(pull, 70)}px)` }}
      >
        <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] text-slate-500 shadow-card">
          {refreshing ? "正在刷新…" : pull >= 48 ? "松开即可刷新" : "下拉刷新"}
        </span>
      </div>

      <div className="mb-3 flex items-center justify-between px-1 text-[11px] text-slate-400">
        <span>{searching ? `搜索「${keyword.trim()}」· ${filtered.length} 条结果` : `为你推荐 · 已加载 ${filtered.length} 条`}</span>
        <span className="hidden sm:inline">
          {cols} 列布局 · 滚动到底自动加载 · 下拉可刷新
        </span>
      </div>

      <div
        key={version}
        className="page-fade flex items-start gap-2 sm:gap-3"
        style={{ transform: `translateY(${pull * 0.35}px)` }}
        onPointerDown={(e: ReactPointerEvent<HTMLDivElement>) => {
          if (e.pointerType === "mouse") begin(e.clientY);
        }}
        onPointerMove={(e: ReactPointerEvent<HTMLDivElement>) => {
          if (e.pointerType === "mouse") move(e.clientY);
        }}
        onPointerUp={(e: ReactPointerEvent<HTMLDivElement>) => {
          if (e.pointerType === "mouse") end();
        }}
        onPointerCancel={() => {
          setPull(0);
          startY.current = null;
        }}
        onTouchStart={(e: ReactTouchEvent<HTMLDivElement>) => begin(e.touches[0]?.clientY ?? 0)}
        onTouchMove={(e: ReactTouchEvent<HTMLDivElement>) => move(e.touches[0]?.clientY ?? 0)}
        onTouchEnd={end}
      >
        {buckets.map((bucket, col) => (
          <div key={col} className="min-w-0 flex-1">
            {bucket.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i * cols + col} />
            ))}
          </div>
        ))}
      </div>

      {searching && filtered.length === 0 && (
        <div className="py-20 text-center text-sm text-slate-400">
          没有找到相关内容，换个关键词试试吧
        </div>
      )}

      <div ref={sentinel} className="h-2" />
      {loading && !refreshing && <Loading />}
      {!loading && !hasMore && !searching && (
        <div className="py-6 text-center text-[12px] text-slate-400">— 已经到底啦 —</div>
      )}

      {showTop && (
        <button
          type="button"
          aria-label="返回顶部"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand shadow-card-hover transition active:scale-95"
        >
          ↑
        </button>
      )}
    </main>
  );
}
