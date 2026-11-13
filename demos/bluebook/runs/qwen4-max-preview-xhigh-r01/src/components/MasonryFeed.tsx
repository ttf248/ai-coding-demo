import { useEffect, useRef, useState } from "react";
import { selectHasMore, selectVisibleNotes, useFeedStore } from "../store/useFeedStore";
import NoteCard from "./NoteCard";
import LoadingSpinner from "./LoadingSpinner";

const PULL_THRESHOLD = 70;

export default function MasonryFeed() {
  const notes = useFeedStore(selectVisibleNotes);
  const hasMore = useFeedStore(selectHasMore);
  const loading = useFeedStore((s) => s.loading);
  const refreshing = useFeedStore((s) => s.refreshing);
  const loadMore = useFeedStore((s) => s.loadMore);
  const refresh = useFeedStore((s) => s.refresh);
  const liked = useFeedStore((s) => s.liked);
  const likeDelta = useFeedStore((s) => s.likeDelta);
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const refreshSeed = useFeedStore((s) => s.refreshSeed);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [pull, setPull] = useState(0);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (window.scrollY <= 0) touchStartY.current = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (touchStartY.current === null || window.scrollY > 0) return;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (dy > 0) {
        setPull(Math.min(110, dy * 0.5));
        if (dy > 10 && e.cancelable) e.preventDefault();
      }
    };
    const onEnd = () => {
      if (pull >= PULL_THRESHOLD) void refresh();
      setPull(0);
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [pull, refresh]);

  return (
    <main className="mx-auto max-w-6xl px-2.5 pb-10 sm:px-4">
      <div
        className="pull-indicator flex items-center justify-center text-xs text-neutral-400"
        style={{ height: refreshing ? 44 : pull }}
      >
        {refreshing ? (
          <LoadingSpinner label="正在刷新…" />
        ) : pull >= PULL_THRESHOLD ? (
          "松开刷新"
        ) : pull > 0 ? (
          "下拉刷新"
        ) : null}
      </div>

      {notes.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-400">
          没有找到相关笔记，换个关键词试试。
        </p>
      ) : (
        <div key={refreshSeed} className="masonry columns-2 md:columns-3 lg:columns-4">
          {notes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              liked={!!liked[n.id]}
              likeDelta={likeDelta[n.id] ?? 0}
              onToggleLike={() => toggleLike(n.id)}
            />
          ))}
        </div>
      )}

      <div ref={sentinelRef} />
      {loading && <LoadingSpinner />}
      {!hasMore && notes.length > 0 && (
        <p className="py-6 text-center text-xs text-neutral-300">— 已经到底啦 —</p>
      )}
    </main>
  );
}