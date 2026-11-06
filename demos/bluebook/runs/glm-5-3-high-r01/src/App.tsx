import { useEffect, useRef } from "react";
import SearchBar from "./components/SearchBar";
import Waterfall from "./components/Waterfall";
import PullToRefresh from "./components/PullToRefresh";
import { useFeed } from "./store";

function Loading() {
  return (
    <div className="flex items-center justify-center gap-1.5 py-5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-brand/80"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const loading = useFeed((s) => s.loading);
  const finished = useFeed((s) => s.finished);
  const page = useFeed((s) => s.page);
  const loadMore = useFeed((s) => s.loadMore);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page === 0) loadMore();
  }, [page, loadMore]);

  // 滚动到底部自动加载更多
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <PullToRefresh>
      <div className="mx-auto min-h-screen max-w-6xl bg-page">
        <SearchBar />
        <Waterfall />
        <div ref={sentinel} className="h-2" />
        {loading && <Loading />}
        {finished && !loading && (
          <p className="py-6 text-center text-xs text-slate-400">
            已经到底啦，下拉可以刷新推荐 ✦
          </p>
        )}
      </div>
    </PullToRefresh>
  );
}
