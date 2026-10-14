import { useEffect, useRef } from "react";
import { useStore } from "../store";
import Card from "./Card";

export default function Waterfall() {
  const pool = useStore((s) => s.pool);
  const extra = useStore((s) => s.extra);
  const loaded = useStore((s) => s.loaded);
  const query = useStore((s) => s.query);
  const loading = useStore((s) => s.loading);
  const ended = useStore((s) => s.ended);
  const feedKey = useStore((s) => s.feedKey);
  const loadMore = useStore((s) => s.loadMore);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, feedKey]);

  const all = [...extra, ...pool];
  const q = query.trim();
  const visible = all.slice(0, loaded).filter((i) => !q || i.title.includes(q) || i.author.includes(q));

  return (
    <main key={feedKey} className="mx-auto max-w-6xl animate-fadein px-3 pb-16 pt-3 sm:px-5">
      {q && (
        <p className="pb-3 text-[12px] text-gray-500">
          搜索「{q}」· 命中 {visible.length} 篇
        </p>
      )}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-gray-400">
          <svg viewBox="0 0 24 24" className="h-12 w-12 stroke-gray-300 fill-none" strokeWidth={1.5} aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <p className="text-[13px]">没有找到相关笔记，换个关键词试试？</p>
        </div>
      ) : (
        <div className="columns-2 gap-3 md:columns-3 xl:columns-4">
          {visible.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      )}
      <div ref={sentinel} aria-hidden />
      {loading && (
        <div className="flex items-center justify-center gap-2 py-5 text-[12px] text-gray-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          加载中…
        </div>
      )}
      {ended && !q && <p className="py-6 text-center text-[12px] text-gray-400">— 到底啦，去发布一篇自己的笔记吧 —</p>}
    </main>
  );
}
