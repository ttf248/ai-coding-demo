import { useEffect, useRef } from "react";
import FeedCard from "./FeedCard";
import { filterItems, useFeedStore } from "../store";

export default function MasonryGrid() {
  const items = useFeedStore((state) => state.items);
  const loading = useFeedStore((state) => state.loading);
  const hasMore = useFeedStore((state) => state.hasMore);
  const loadMore = useFeedStore((state) => state.loadMore);
  const keyword = useFeedStore((state) => state.keyword);
  const category = useFeedStore((state) => state.category);
  const sentinel = useRef<HTMLDivElement | null>(null);

  // 滚动到底部自动加载更多
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) void loadMore();
      },
      { rootMargin: "320px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  const visible = filterItems(items, keyword, category);

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-3 sm:px-6">
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
        {visible.map((item, index) => (
          <FeedCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {!visible.length && (
        <p className="py-16 text-center text-sm text-slate-400">
          没有找到相关内容，换个关键词试试
        </p>
      )}

      <div ref={sentinel} className="h-6" />

      <div className="flex h-16 items-center justify-center">
        {loading && (
          <span className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-brand border-t-transparent" />
            加载中…
          </span>
        )}
        {!loading && !hasMore && visible.length > 0 && (
          <span className="text-xs text-slate-400">— 已经到底啦 —</span>
        )}
      </div>
    </div>
  );
}
