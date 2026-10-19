import { useEffect, useRef } from "react";
import { NoteCard } from "./NoteCard";
import { SkeletonCard } from "./SkeletonCard";
import { useFeedStore } from "../store/useFeedStore";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import { LoadingSpinner } from "./LoadingSpinner";

/** 瀑布流主体：两列（移动端）/ 三列（平板）/ 四列（桌面端） */
export function MasonryGrid() {
  const notes = useFeedStore((s) => s.notes);
  const status = useFeedStore((s) => s.status);
  const hasMore = useFeedStore((s) => s.hasMore);
  const loadMore = useFeedStore((s) => s.loadMore);
  const refresh = useFeedStore((s) => s.refresh);
  const sentinel = useRef<HTMLDivElement>(null);

  const { pull, refreshing, threshold, handlers } = usePullToRefresh(refresh);

  // 首次加载
  useEffect(() => {
    if (useFeedStore.getState().page === 0) void loadMore();
  }, [loadMore]);

  // 滚动到底部自动加载更多
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void loadMore();
      },
      { rootMargin: "320px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  const showSkeleton = status === "loading";

  return (
    <div
      className="mx-auto max-w-[1400px] px-2 pt-2 sm:px-4 sm:pt-3"
      {...handlers}
      style={{ touchAction: "pan-y" }}
    >
      {/* 下拉刷新指示器 */}
      <div
        className="flex items-center justify-center overflow-hidden text-[12px] text-neutral-400 transition-[height] duration-150"
        style={{ height: pull }}
        aria-hidden={pull === 0}
      >
        {refreshing ? (
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 animate-[spin_0.8s_linear_infinite] rounded-full border-2 border-neutral-200 border-t-xhs" />
            正在刷新…
          </span>
        ) : (
          <span>{pull >= threshold ? "松开立即刷新" : "下拉刷新"}</span>
        )}
      </div>

      {/* CSS 多列实现瀑布流，配合 react-lazyload 逐卡懒加载 */}
      <div className="columns-2 gap-2 md:columns-3 md:gap-3 xl:columns-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
        {showSkeleton &&
          Array.from({ length: 8 }, (_, i) => (
            <SkeletonCard key={`sk-${i}`} height={150 + ((i * 47) % 180)} />
          ))}
      </div>

      <div ref={sentinel} className="h-1 w-full" />

      {showSkeleton && <LoadingSpinner label="正在加载更多笔记" />}
      {!hasMore && !showSkeleton && notes.length > 0 && (
        <p className="py-6 text-center text-[12px] text-neutral-400">
          已经到底啦 · 共 {notes.length} 条
        </p>
      )}
      {status === "error" && (
        <div className="py-6 text-center text-[12px] text-neutral-500">
          加载失败，请
          <button
            type="button"
            className="ml-1 text-xhs underline"
            onClick={() => void loadMore()}
          >
            重试
          </button>
        </div>
      )}
    </div>
  );
}
