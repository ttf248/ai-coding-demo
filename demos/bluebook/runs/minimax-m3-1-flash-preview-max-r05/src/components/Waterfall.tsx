import { useEffect, useRef } from "react";
import type { Note } from "../types";
import { useFeedStore } from "../store/useFeedStore";
import NoteCard from "./NoteCard";

/** 瀑布流：移动端两列、平板三列、桌面四列；滚动到底自动加载 */
export default function Waterfall({ items }: { items: Note[] }) {
  const notes = items;
  const status = useFeedStore((s) => s.status);
  const hasMore = useFeedStore((s) => s.hasMore);
  const loadMore = useFeedStore((s) => s.loadMore);
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "320px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, notes.length]);

  if (!notes.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 px-2.5 py-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg animate-pulse" style={{ height: 150 + ((i * 57) % 130) }} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 px-2.5 pt-1">
        {notes.map((n) => (
          <NoteCard key={n.id} note={n} />
        ))}
      </div>
      <div ref={sentinel} className="h-16 grid place-items-center text-[12px] text-[#9a9a9a]">
        {status === "loading" ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin360" />
            加载中…
          </span>
        ) : hasMore ? (
          <span>继续下滑加载更多</span>
        ) : (
          <span>— 已经到底啦 —</span>
        )}
      </div>
    </>
  );
}
