import { useEffect, useState } from "react";
import Masonry from "./components/Masonry";
import PublishModal from "./components/PublishModal";
import SearchBar from "./components/SearchBar";
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import { selectVisiblePosts, useFeedStore } from "./store/feed";

function Spinner() {
  return (
    <span
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand/30 border-t-brand"
      role="status"
      aria-label="加载中"
    />
  );
}

export default function App() {
  const posts = useFeedStore((s) => s.posts);
  const visible = useFeedStore(selectVisiblePosts);
  const loading = useFeedStore((s) => s.loading);
  const refreshing = useFeedStore((s) => s.refreshing);
  const hasMore = useFeedStore((s) => s.hasMore);
  const keyword = useFeedStore((s) => s.keyword);
  const fadeKey = useFeedStore((s) => s.fadeKey);
  const loadMore = useFeedStore((s) => s.loadMore);
  const refresh = useFeedStore((s) => s.refresh);
  const [publishOpen, setPublishOpen] = useState(false);

  const ptr = usePullToRefresh(refresh);

  useEffect(() => {
    if (posts.length === 0 && !loading && !refreshing) void loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 640;
      if (nearBottom) void loadMore();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-8">
      <div
        className="pointer-events-none fixed left-1/2 z-20 -translate-x-1/2 transition-transform"
        style={{
          top: 8,
          transform: `translate(-50%, ${-24 + ptr.pull}px)`,
          opacity: ptr.pull > 8 || refreshing ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-gray-500 shadow">
          <Spinner />
          {refreshing ? "刷新中…" : ptr.pull >= ptr.threshold ? "释放刷新" : "下拉刷新"}
        </div>
      </div>
      <SearchBar onPublish={() => setPublishOpen(true)} />
      {posts.length === 0 && !refreshing ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : visible.length === 0 ? (
        <p className="py-24 text-center text-sm text-gray-400">
          没有找到与“{keyword}”相关的内容
        </p>
      ) : (
        <main
          key={fadeKey}
          className="feed-fade-in mx-auto max-w-6xl px-3 pt-3"
        >
          <Masonry posts={visible} />
          <div className="flex h-16 items-center justify-center text-xs text-gray-400">
            {loading || refreshing ? (
              <span className="flex items-center gap-2">
                <Spinner />
                加载中…
              </span>
            ) : hasMore ? (
              ""
            ) : (
              "已加载全部内容"
            )}
          </div>
        </main>
      )}
      <PublishModal open={publishOpen} onClose={() => setPublishOpen(false)} />
    </div>
  );
}
