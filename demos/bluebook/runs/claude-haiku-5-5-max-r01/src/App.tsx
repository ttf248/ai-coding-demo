import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import NoteCard from "./components/NoteCard";
import { useFeed } from "./store";
import type { Note } from "./types";

// 2 columns on phones (iPhone 12 is 390 px wide), 3 on tablets, 4 on desktop.
const colsFor = (width: number) => (width >= 1024 ? 4 : width >= 640 ? 3 : 2);

// Masonry: each card goes to the currently shortest column.
function distribute(items: Note[], cols: number): Note[][] {
  const columns: Note[][] = Array.from({ length: cols }, () => []);
  const heights = Array.from({ length: cols }, () => 0);
  for (const note of items) {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(note);
    heights[shortest] += note.ratio + 0.4;
  }
  return columns;
}

export default function App() {
  const items = useFeed((s) => s.items);
  const loading = useFeed((s) => s.loading);
  const hasMore = useFeed((s) => s.hasMore);
  const query = useFeed((s) => s.query);
  const setQuery = useFeed((s) => s.setQuery);
  const loadMore = useFeed((s) => s.loadMore);
  const refresh = useFeed((s) => s.refresh);

  const [cols, setCols] = useState(() => colsFor(window.innerWidth));
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setCols(colsFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (useFeed.getState().items.length === 0) void loadMore();
  }, [loadMore]);

  // Infinite scroll: load the next page when the sentinel nears the viewport.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  const q = query.trim();
  const visible = useMemo(
    () => items.filter((n) => !q || n.title.includes(q) || n.author.includes(q)),
    [items, q],
  );
  const columns = useMemo(() => distribute(visible, cols), [visible, cols]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (window.scrollY === 0) startY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    setPull(Math.min(80, Math.max(0, (e.touches[0].clientY - startY.current) * 0.5)));
  };
  const onTouchEnd = () => {
    if (pull >= 56) void refresh();
    setPull(0);
    startY.current = null;
  };

  return (
    <div className="fade-in flex min-h-full flex-col pb-[env(safe-area-inset-bottom)]" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <header className="sticky top-0 z-20 bg-[#f5f5f5]/95 px-3 pb-2 pt-[max(env(safe-area-inset-top),8px)] backdrop-blur">
        <div className="flex items-center gap-2">
          <h1 className="flex-none text-[18px] font-extrabold text-brand">小蓝书</h1>
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-neutral-400" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索你感兴趣的内容"
              aria-label="搜索"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </label>
          <button type="button" className="flex-none rounded-full bg-brand px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-95">
            发布
          </button>
        </div>
      </header>

      <div className="flex justify-center overflow-hidden text-xs text-neutral-500" style={{ height: pull }} aria-live="polite">
        {pull > 0 && <span className="self-center">{pull >= 56 ? "松开即可刷新" : "下拉刷新"}</span>}
      </div>

      <main className="flex-1">
        {visible.length > 0 ? (
          <div className="flex gap-2.5 px-2.5 pt-1">
            {columns.map((col, i) => (
              <div key={i} className="flex min-w-0 flex-1 flex-col gap-2.5">
                {col.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="py-16 text-center text-sm text-neutral-500">没有找到相关内容，换个关键词试试</p>
        )}
        <div ref={sentinel} className="flex h-16 items-center justify-center text-xs text-neutral-400">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              加载中……
            </span>
          ) : hasMore ? (
            "上拉加载更多"
          ) : (
            "没有更多了"
          )}
        </div>
      </main>
    </div>
  );
}
