import { useEffect, useMemo, useRef, useState } from "react";
import { forceCheck } from "react-lazyload";
import { useFeed } from "./store";
import { categories, type Post } from "./mock";
import { PostCard } from "./components/PostCard";
import { DetailDialog, PublishDialog } from "./components/Dialogs";
import { Icon } from "./components/Icon";
export default function App() {
  const posts = useFeed((s) => s.posts),
    refresh = useFeed((s) => s.refresh);
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("推荐"),
    [count, setCount] = useState(20),
    [loading, setLoading] = useState(false),
    [detail, setDetail] = useState<Post | null>(null),
    [publishing, setPublishing] = useState(false),
    [toast, setToast] = useState(""),
    [pull, setPull] = useState(0);
  const sentinel = useRef<HTMLDivElement>(null),
    timer = useRef<ReturnType<typeof setTimeout>>(),
    startY = useRef<number | null>(null);
  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          (category === "推荐" || p.category === category) &&
          (!query.trim() ||
            `${p.title} ${p.author} ${p.category}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())),
      ),
    [posts, query, category],
  );
  useEffect(() => {
    setCount(20);
    setLoading(false);
    clearTimeout(timer.current);
    window.scrollTo({ top: 0 });
  }, [query, category]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && count < filtered.length) {
          setLoading(true);
          timer.current = setTimeout(() => {
            setCount((c) => Math.min(c + 20, filtered.length));
            setLoading(false);
          }, 450);
        }
      },
      { rootMargin: "180px" },
    );
    if (sentinel.current) observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [count, loading, filtered.length]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    forceCheck();
  }, [count, category, query]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(id);
  }, [toast]);
  function doRefresh() {
    clearTimeout(timer.current);
    setLoading(false);
    refresh();
    setCount(20);
    setPull(0);
    setToast("已刷新，发现新的生活灵感");
  }
  return (
    <div
      onTouchStart={(e) => {
        startY.current = window.scrollY <= 1 ? e.touches[0].clientY : null;
      }}
      onTouchMove={(e) => {
        if (startY.current !== null)
          setPull(
            Math.min(
              100,
              Math.max(0, (e.touches[0].clientY - startY.current) * 0.55),
            ),
          );
      }}
      onTouchEnd={() => {
        if (pull > 58) doRefresh();
        else setPull(0);
        startY.current = null;
      }}
    >
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-4 px-4 py-4 md:flex-nowrap md:px-8">
          <a
            href="./"
            className="flex flex-none items-center gap-2"
            aria-label="小蓝书首页"
          >
            <span className="rounded-xl bg-brand px-2.5 py-1.5 text-xl font-black tracking-tight text-white">
              小蓝书
            </span>
            <span className="hidden text-xs text-stone-400 lg:block">
              记录，让生活有迹可循
            </span>
          </a>
          <div className="order-3 flex w-full items-center gap-2 rounded-full bg-[#f5f5f5] px-4 md:order-none md:mx-auto md:max-w-lg">
            <Icon name="search" className="h-5 w-5 flex-none text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索你感兴趣的内容"
              aria-label="搜索你感兴趣的内容"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
            />
            {query && (
              <button aria-label="清空搜索" onClick={() => setQuery("")}>
                <Icon name="close" className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setPublishing(true)}
            className="ml-auto flex flex-none items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white"
          >
            <Icon name="plus" className="h-4 w-4" />
            发布
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-[1320px] px-3 pb-12 md:px-8">
        <section className="relative my-6 overflow-hidden rounded-2xl bg-[#e9eee8] px-5 py-7 md:px-9 md:py-9">
          <div className="absolute -right-4 -top-12 h-64 w-64 rounded-full border-[40px] border-white/25" />
          <p className="text-[10px] font-medium uppercase tracking-[.3em] text-emerald-800">
            Everyday, a little extraordinary
          </p>
          <h1 className="relative mt-3 text-2xl font-semibold tracking-tight text-[#2c483a] md:text-4xl">
            把日子过成喜欢的样子<span className="text-brand">。</span>
          </h1>
          <p className="relative mt-3 text-xs leading-6 text-emerald-900/65 md:text-sm">
            那些微小又闪光的瞬间，值得被看见。
          </p>
          <div className="relative mt-5 flex gap-2">
            <button
              onClick={() => setCategory("旅行")}
              className="rounded-full bg-white/70 px-3 py-1.5 text-xs text-emerald-900"
            >
              # 去自然里充个电
            </button>
            <button
              onClick={() => setCategory("家居")}
              className="rounded-full bg-white/70 px-3 py-1.5 text-xs text-emerald-900"
            >
              # 我的理想小家
            </button>
          </div>
        </section>
        <nav
          aria-label="内容分类"
          className="mb-6 flex items-center gap-1 overflow-x-auto"
        >
          <div className="flex flex-1 gap-1">
            {categories.map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={`flex-none rounded-full px-4 py-2 text-sm ${category === c ? "bg-white font-semibold text-brand shadow-sm" : "text-stone-500 hover:bg-white"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            className="hidden flex-none rounded-full p-2 text-stone-400 sm:block"
            aria-label="刷新笔记"
            onClick={doRefresh}
          >
            <Icon name="refresh" />
          </button>
        </nav>
        <div
          className="flex justify-center overflow-hidden text-xs text-stone-500 transition-all"
          style={{ height: pull }}
        >
          {pull > 0 && (
            <span className="pt-3">
              {pull > 58 ? "松开刷新" : "下拉发现新内容"} ↓
            </span>
          )}
        </div>
        <div
          key={`${category}-${query}`}
          className="feed-enter columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4"
          data-testid="feed"
        >
          {filtered.slice(0, count).map((post) => (
            <PostCard key={post.id} post={post} onOpen={setDetail} />
          ))}
        </div>
        {!filtered.length && (
          <div className="py-20 text-center">
            <p className="text-lg font-medium">还没有找到相关笔记</p>
            <p className="mt-2 text-sm text-stone-500">
              换个关键词，或看看推荐内容。
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("推荐");
              }}
              className="mt-5 text-sm text-brand"
            >
              返回推荐
            </button>
          </div>
        )}
        <div
          ref={sentinel}
          className="flex min-h-20 items-center justify-center gap-3 text-sm text-stone-400"
          role="status"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-stone-200 border-t-brand" />
              正在寻找更多灵感
            </>
          ) : count >= filtered.length && filtered.length > 0 ? (
            "已经看到全部笔记，去创造自己的故事吧"
          ) : (
            "向下滚动，发现更多"
          )}
        </div>
        <footer className="text-center text-[10px] tracking-widest text-stone-400">
          小蓝书 · 本地演示社区 · {filtered.length} 条笔记
        </footer>
      </main>
      {detail && <DetailDialog post={detail} onClose={() => setDetail(null)} />}
      {publishing && (
        <PublishDialog
          onClose={() => setPublishing(false)}
          onPublished={() => {
            setQuery("");
            setCategory("推荐");
            setCount(20);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setToast("发布成功，你的笔记已出现在推荐里");
          }}
        />
      )}
      {toast && (
        <div
          role="status"
          className="fixed bottom-8 left-1/2 z-50 w-max max-w-[90vw] -translate-x-1/2 rounded-full bg-stone-900 px-5 py-3 text-sm text-white shadow-xl"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
