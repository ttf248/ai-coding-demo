import { useEffect, useRef } from "react";
import { useFeedStore } from "../store";
import MasonryCard from "./MasonryCard";
import Spinner from "./Spinner";

const SKELETON_HEIGHTS = [340, 420, 300, 380, 460, 320, 360, 430];

export default function Waterfall() {
  const posts = useFeedStore((s) => s.posts);
  const loading = useFeedStore((s) => s.loading);
  const loadMore = useFeedStore((s) => s.loadMore);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 滚动到底部自动加载更多
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <div>
      <div className="waterfall columns-2 md:columns-3 lg:columns-4">
        {posts.map((p) => (
          <MasonryCard key={p.id} post={p} />
        ))}
        {posts.length === 0 &&
          SKELETON_HEIGHTS.map((h, i) => (
            <div key={i} className="mb-3">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="bg-gray-100" style={{ height: h }} />
                <div className="p-2.5 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                  <div className="h-3 bg-gray-100 rounded w-2/5" />
                </div>
              </div>
            </div>
          ))}
      </div>

      <div
        ref={sentinelRef}
        role="status"
        className="py-6 flex items-center justify-center gap-2 text-sm text-gray-400 select-none"
      >
        {loading || posts.length === 0 ? (
          <>
            <Spinner />
            <span>正在加载…</span>
          </>
        ) : (
          <span>继续下滑加载更多</span>
        )}
      </div>
    </div>
  );
}
