import { useCallback, useEffect, useRef, useState } from "react";
import SearchBar from "./components/SearchBar";
import Waterfall from "./components/Waterfall";
import { useStore } from "./store";

/** 简单的下拉刷新：触屏下拉 + 桌面鼠标下拉 */
function usePullRefresh(onRefresh: () => void) {
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const refreshing = useStore((s) => s.status === "refreshing");
  const threshold = 70;

  const onPointerDown = (e: React.PointerEvent) => {
    if (window.scrollY <= 0) startY.current = e.clientY;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startY.current === null) return;
    const delta = e.clientY - startY.current;
    if (delta > 0 && window.scrollY <= 0) setPull(Math.min(delta * 0.5, 110));
    else setPull(0);
  };
  const onPointerUp = () => {
    if (startY.current === null) return;
    if (pull >= threshold) onRefresh();
    startY.current = null;
    setPull(0);
  };

  return { pull, refreshing, threshold, handlers: { onPointerDown, onPointerMove, onPointerUp } };
}

export default function App() {
  const items = useStore((s) => s.items);
  const status = useStore((s) => s.status);
  const hasMore = useStore((s) => s.hasMore);
  const query = useStore((s) => s.query);
  const bootstrap = useStore((s) => s.bootstrap);
  const loadMore = useStore((s) => s.loadMore);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  // 滚动到底自动加载更多
  const onScroll = useCallback(() => {
    const el = document.documentElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 240) {
      void loadMore();
    }
  }, [loadMore]);
  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const { pull, refreshing, threshold, handlers } = usePullRefresh(() => void bootstrap());

  const filtered = query
    ? items.filter(
        (i) => i.title.includes(query) || i.author.includes(query),
      )
    : items;
  const first = items.length === 0 && status === "refreshing";

  return (
    <div className="min-h-screen bg-page pb-10 text-neutral-800" {...handlers}>
      {/* 下拉刷新指示 */}
      <div
        className="pointer-events-none fixed left-0 right-0 top-14 z-10 flex items-center justify-center overflow-hidden text-xs text-neutral-400 transition-[height]"
        style={{ height: pull }}
      >
        <span className={refreshing || first ? "refresh-dot" : ""}>
          {refreshing || first
            ? "正在刷新…"
            : pull >= threshold
              ? "松开刷新"
              : "下拉刷新"}
        </span>
      </div>

      <SearchBar />

      <main className="page-enter mx-auto max-w-6xl pt-4">
        {query && (
          <p className="mb-3 px-4 text-sm text-neutral-500">
            “{query}” 的结果：{filtered.length} 条
          </p>
        )}

        {first ? (
          <div className="flex flex-col items-center gap-3 py-24 text-neutral-400">
            <div className="spinner" role="status" aria-label="加载中" />
            <span className="text-sm">加载中…</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-24 text-center text-sm text-neutral-400">
            没有找到相关内容，换个关键词试试
          </p>
        ) : (
          <Waterfall items={filtered} />
        )}

        {status === "loading" && (
          <div className="flex justify-center py-6" role="status" aria-label="加载更多中">
            <div className="spinner" />
          </div>
        )}
        {!hasMore && filtered.length > 0 && (
          <p className="py-6 text-center text-xs text-neutral-400">— 已经到底啦 —</p>
        )}
      </main>
    </div>
  );
}
