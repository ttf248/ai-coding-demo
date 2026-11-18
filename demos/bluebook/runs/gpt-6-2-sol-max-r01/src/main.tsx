import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { categories, type Post } from "./data";
import { matching, useFeed } from "./store";
import { Icon, PostCard, PostDetail, Publisher } from "./components";
import "./styles.css";

function columnCount() {
  if (window.matchMedia("(min-width: 1100px)").matches) return 4;
  if (window.matchMedia("(min-width: 730px)").matches) return 3;
  return 2;
}
function Masonry({
  posts,
  open,
}: {
  posts: Post[];
  open: (post: Post) => void;
}) {
  const [count, setCount] = useState(columnCount);
  useEffect(() => {
    const onResize = () => setCount(columnCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const columns = useMemo(() => {
    const result = Array.from({ length: count }, () => ({
      posts: [] as Post[],
      height: 0,
    }));
    for (const post of posts) {
      const column = result.reduce((shortest, current) =>
        current.height < shortest.height ? current : shortest,
      );
      column.posts.push(post);
      column.height += post.height + 150;
    }
    return result;
  }, [count, posts]);
  return (
    <div className="masonry">
      {columns.map((column, index) => (
        <div className="min-w-0 space-y-3 sm:space-y-4" key={index}>
          {column.posts.map((post) => (
            <PostCard open={() => open(post)} post={post} key={post.id} />
          ))}
        </div>
      ))}
    </div>
  );
}

function usePullToRefresh() {
  useEffect(() => {
    let start: { x: number; y: number } | null = null;
    function onStart(event: TouchEvent) {
      const touch = event.touches[0];
      start =
        window.scrollY < 2 &&
        event.touches.length === 1 &&
        !document.querySelector("dialog[open]")
          ? { x: touch.clientX, y: touch.clientY }
          : null;
    }
    function onEnd(event: TouchEvent) {
      const touch = event.changedTouches[0];
      if (
        start &&
        touch.clientY - start.y > 82 &&
        Math.abs(touch.clientX - start.x) < 64
      )
        useFeed.getState().refresh();
      start = null;
    }
    function cancel() {
      start = null;
    }
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", cancel);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", cancel);
    };
  }, []);
}

function App() {
  const state = useFeed();
  const feed = useMemo(() => matching(state), [state]);
  const [detail, setDetail] = useState<Post | null>(null);
  const [publishing, setPublishing] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const mayLoadMore = feed.length > state.limit;
  usePullToRefresh();
  useEffect(() => {
    if (!sentinel.current || !mayLoadMore || state.loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) state.loadMore();
      },
      { rootMargin: "0px 0px 120px" },
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [mayLoadMore, state.limit, state.loading, state.loadMore]);

  const selected = state.category !== "全部" || state.keyword.trim();
  return (
    <>
      <header className="site-header">
        <div className="shell header-layout">
          <a
            className="brand"
            href="#"
            aria-label="小蓝书首页"
            onClick={() => {
              state.setCategory("全部");
              state.setKeyword("");
            }}
          >
            <span className="brand-icon" aria-hidden="true">
              蓝
            </span>
            <span>小蓝书</span>
          </a>
          <label className="search">
            <Icon name="search" />
            <input
              type="search"
              aria-label="搜索你感兴趣的内容"
              placeholder="搜索你感兴趣的内容"
              value={state.keyword}
              onChange={(event) => state.setKeyword(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="publish"
            onClick={() => setPublishing(true)}
          >
            <Icon name="plus" />
            发布
          </button>
        </div>
      </header>
      <main className="shell pb-10">
        <section className="cover">
          <div className="cover-text">
            <p className="mb-2 text-xs font-bold text-[#a7344b]">周末灵感集</p>
            <h1 className="cover-title">把日常拍下来。</h1>
            <p className="mt-2 text-sm text-[#624b51]">
              散步、读书、在家做饭。收集值得回看的生活片刻。
            </p>
          </div>
          <button
            className="cover-button"
            type="button"
            onClick={() => {
              state.setKeyword("");
              state.setCategory("旅行");
            }}
          >
            逛逛旅行笔记 <span aria-hidden="true">↗</span>
          </button>
        </section>
        <nav className="feed-nav" aria-label="笔记分类">
          <div className="flex min-w-0 flex-wrap gap-1.5 sm:gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="chip"
                aria-pressed={state.category === category}
                onClick={() => state.setCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            className="icon-button shrink-0"
            aria-label="刷新笔记"
            title="刷新笔记"
            type="button"
            onClick={state.refresh}
          >
            <Icon name="refresh" />
          </button>
        </nav>
        {state.loading === "refresh" && (
          <div className="feed-status" role="status">
            <span className="spinner" />
            正在刷新
          </div>
        )}
        {selected && (
          <p className="mb-3 text-xs text-quiet" role="status">
            找到 {feed.length} 篇笔记
          </p>
        )}
        {feed.length === 0 ? (
          <section className="rounded-lg bg-white p-8 text-center text-sm text-quiet">
            没有匹配的笔记，试试别的关键词。
          </section>
        ) : (
          <div className="fade-in" key={state.category + ":" + state.keyword}>
            <Masonry posts={feed.slice(0, state.limit)} open={setDetail} />
          </div>
        )}
        <div ref={sentinel} className="feed-status">
          {state.loading === "more" ? (
            <span role="status" className="inline-flex items-center gap-2">
              <span className="spinner" />
              加载更多笔记
            </span>
          ) : mayLoadMore ? (
            <button className="chip" onClick={state.loadMore}>
              加载更多
            </button>
          ) : feed.length > 0 ? (
            <span>已浏览全部 {feed.length} 篇笔记</span>
          ) : null}
        </div>
      </main>
      {detail && <PostDetail post={detail} close={() => setDetail(null)} />}
      {publishing && <Publisher close={() => setPublishing(false)} />}
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
