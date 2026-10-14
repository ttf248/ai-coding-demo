import { useEffect, useRef } from "react";
import type { Note } from "../types";
import { useFeedStore } from "../store/useFeedStore";
import NoteCard from "./NoteCard";

/** 瀑布流：移动端两列、平板三列、桌面四列；滚动到底自动加载 */
export default function Waterfall({ items }: { items: Note[] }) {
  const notes = items;
  const status = useFeedStore((s) => s.status);
  const hasMore = useFeedStore((s) => s.hasMore);
  const error = useFeedStore((s) => s.error);
  const loadMore = useFeedStore((s) => s.loadMore);
  const retry = useFeedStore((s) => s.retry);
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    /* 第 10 轮：把观察根明确指向滚动容器，并加去抖。
       原来没写 root，IntersectionObserver 默认以视口为根，
       而真正的滚动容器是 main[data-scroll-root]——rootMargin 会作用在
       视口上而不是列表底部，提前量算不准。 */
    const root = document.querySelector("[data-scroll-root]") as HTMLElement | null;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        // 去抖：一次交叉可能连续触发多次（列宽变化、图片加载后重排）
        window.clearTimeout((el as HTMLDivElement & { _t?: number })._t);
        (el as HTMLDivElement & { _t?: number })._t = window.setTimeout(loadMore, 180);
      },
      { root: root ?? null, rootMargin: "320px 0px" },
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
        {/* 第 9 轮：失败态给出原因与重试入口，不再静默停在「加载中…」 */}
        {status === "error" ? (
          <span className="inline-flex items-center gap-2 text-[#d63b5c]">
            加载失败{error ? `：${error}` : ""}
            <button type="button" onClick={retry} className="px-2.5 py-1 rounded-full bg-white text-brand">重试</button>
          </span>
        ) : status === "loading" ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin360" />
            加载中…
          </span>
        ) : hasMore ? (
          <span>继续下滑加载更多</span>
        ) : (
          <span>— 已经到底啦，共 {notes.length} 条 —</span>
        )}
      </div>
    </>
  );
}
