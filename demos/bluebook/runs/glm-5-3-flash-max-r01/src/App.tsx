import { useEffect, useRef, useState } from "react";
import LazyLoad from "react-lazyload";
import { useFeed, type Post } from "./store";

function SearchBar() {
  const query = useFeed((s) => s.query);
  const setQuery = useFeed((s) => s.setQuery);
  return (
    <header className="fixed inset-x-0 top-0 z-20 bg-white/95 backdrop-blur border-b border-neutral-100">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2.5">
        <span className="text-xl font-black text-xhs tracking-tight select-none shrink-0">
          小蓝书
        </span>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-neutral-100 px-3.5 py-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-neutral-400" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索你感兴趣的内容"
            className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          />
        </div>
        <button className="shrink-0 rounded-full bg-xhs px-4 py-1.5 text-sm font-semibold text-white active:scale-95 transition-transform">
          发布
        </button>
      </div>
    </header>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${filled ? "fill-xhs" : "fill-neutral-300"}`}>
      <path d="M12 21s-7.5-4.6-10-9.2C.6 8.6 2.5 4.9 6 4.9c2.1 0 3.6 1.2 6 3.6 2.4-2.4 3.9-3.6 6-3.6 3.5 0 5.4 3.7 4 6.9C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

function Avatar({ name }: { name: string }) {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
      style={{ background: `hsl(${hue} 65% 55%)` }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

function PostCard({ post }: { post: Post }) {
  const toggleLike = useFeed((s) => s.toggleLike);
  const [pop, setPop] = useState(false);
  const like = () => {
    setPop(true);
    toggleLike(post.id);
  };
  return (
    <div
      className="card-hover card-press mb-2 break-inside-avoid rounded-lg bg-white shadow-sm cursor-pointer overflow-hidden"
      onClick={like}
    >
      <div style={{ aspectRatio: post.ratio }} className="w-full bg-neutral-100">
        <LazyLoad height="100%" scrollContainer="#feed-scroll" once>
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                `${import.meta.env.BASE_URL}images/img-01.svg`;
            }}
          />
        </LazyLoad>
      </div>
      <div className="px-2.5 pt-1.5 pb-2">
        <h3 className="line-clamp-2 text-[13px] leading-snug text-neutral-800">{post.title}</h3>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="flex min-w-0 items-center gap-1.5">
            <Avatar name={post.author} />
            <span className="truncate text-xs text-neutral-500">{post.author}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <span className={pop ? "like-pop inline-flex" : "inline-flex"} onAnimationEnd={() => setPop(false)}>
              <HeartIcon filled={post.liked} />
            </span>
            {post.likes > 999 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
          </span>
        </div>
      </div>
    </div>
  );
}

function Waterfall() {
  const posts = useFeed((s) => s.posts);
  const query = useFeed((s) => s.query);
  const filtered = query
    ? posts.filter((p) => p.title.includes(query) || p.author.includes(query))
    : posts;
  return (
    <div
      className="columns-2 gap-2 sm:columns-3 lg:columns-4 px-2 pt-2 page-enter"
      key={query ? `q-${query}` : `p-${posts.length}`}
    >
      {filtered.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}

function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [pull, setPull] = useState(0);
  const state = useRef<{ startY: number; pulling: boolean }>({ startY: 0, pulling: false });
  const onTouchStart = (e: React.TouchEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (el.scrollTop <= 0) {
      state.current = { startY: e.touches[0].clientY, pulling: true };
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!state.current.pulling) return;
    const d = e.touches[0].clientY - state.current.startY;
    if (d > 0) setPull(Math.min(90, d * 0.5));
  };
  const onTouchEnd = () => {
    state.current.pulling = false;
    if (pull > 50) {
      onRefresh().finally(() => setPull(0));
    } else {
      setPull(0);
    }
  };
  return { pull, onTouchStart, onTouchMove, onTouchEnd };
}

export default function App() {
  const loading = useFeed((s) => s.loading);
  const refreshing = useFeed((s) => s.refreshing);
  const hasMore = useFeed((s) => s.hasMore);
  const loadMore = useFeed((s) => s.loadMore);
  const refresh = useFeed((s) => s.refresh);
  const sentinel = useRef<HTMLDivElement>(null);

  const { pull, onTouchStart, onTouchMove, onTouchEnd } = usePullToRefresh(refresh);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen">
      <SearchBar />
      <div
        id="feed-scroll"
        className="h-screen overflow-y-auto pt-14"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex items-center justify-center overflow-hidden transition-[height]"
          style={{ height: refreshing ? 44 : pull }}
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 fill-none stroke-xhs ${refreshing || pull > 50 ? "pull-spin" : ""}`}
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M21 12a9 9 0 1 1-2.6-6.4" />
            <path d="M21 3v5h-5" />
          </svg>
        </div>
        <Waterfall />
        <div ref={sentinel} className="h-2" />
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-neutral-400">
          {loading && (
            <svg viewBox="0 0 24 24" className="pull-spin h-4 w-4 fill-none stroke-xhs" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-2.6-6.4" strokeLinecap="round" />
            </svg>
          )}
          {loading ? "正在加载更多…" : hasMore ? "继续下滑查看更多" : "已经到底啦"}
        </div>
      </div>
    </div>
  );
}
