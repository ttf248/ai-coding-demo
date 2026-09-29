import { useEffect, useRef } from "react";
import { usePosts } from "../store/usePosts";
import { PostCard } from "./PostCard";
import { Refresh } from "./Icons";

export function Waterfall() {
  const posts = usePosts((s) => s.posts);
  const loading = usePosts((s) => s.loading);
  const hasMore = usePosts((s) => s.hasMore);
  const loadMore = usePosts((s) => s.loadMore);
  const loadInitial = usePosts((s) => s.loadInitial);
  const query = usePosts((s) => s.query);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) loadMore();
        }
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [loadMore]);

  const filtered = query.trim()
    ? posts.filter((p) => p.title.includes(query.trim()))
    : posts;

  return (
    <section className="mx-auto max-w-screen-xl px-3 sm:px-4 pt-3 pb-24" aria-label="瀑布流主体">
      {filtered.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-neutral-400">
          <Refresh className="w-6 h-6" />
          <p className="text-sm">暂无匹配内容，下拉加载更多试试。</p>
        </div>
      )}

      <div
        className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4"
        style={{ columnFill: "balance" }}
      >
        {filtered.map((post) => (
          <div key={post.id} className="mb-3 sm:mb-4 break-inside-avoid">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      <div ref={sentinelRef} className="h-12" aria-hidden="true" />

      <div className="text-center text-xs text-neutral-400 py-4">
        {loading ? "正在加载更多…" : hasMore ? "上拉 / 滚动加载更多" : "已经到底啦"}
      </div>
    </section>
  );
}