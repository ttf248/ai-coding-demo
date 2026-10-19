import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import NoteCard from "./components/NoteCard";
import PublishModal from "./components/PublishModal";
import { ArrowDownIcon, Spinner } from "./components/Icons";
import { useNotesStore } from "./store";

const CATEGORIES = ["推荐", "生活记录", "周末去哪儿", "美食", "家居", "穿搭", "旅行", "手作", "阅读", "摄影", "治愈"];

function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  const startY = useRef<number | null>(null);
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;

  useEffect(() => {
    const touchStart = (event: TouchEvent) => {
      if (refreshingRef.current || window.scrollY > 0) {
        startY.current = null;
        return;
      }
      startY.current = event.touches[0].clientY;
    };
    const touchMove = (event: TouchEvent) => {
      if (startY.current === null) return;
      if (window.scrollY > 0) {
        startY.current = null;
        pullRef.current = 0;
        setPull(0);
        return;
      }
      const delta = event.touches[0].clientY - startY.current;
      if (delta <= 0) {
        pullRef.current = 0;
        setPull(0);
        return;
      }
      event.preventDefault();
      const next = Math.min(88, delta * 0.55);
      pullRef.current = next;
      setPull(next);
    };
    const finish = async () => {
      if (startY.current === null) return;
      startY.current = null;
      if (pullRef.current > 54 && !refreshingRef.current) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPull(58);
        pullRef.current = 0;
        try {
          await refreshRef.current();
        } finally {
          refreshingRef.current = false;
          setRefreshing(false);
          setPull(0);
        }
      } else {
        pullRef.current = 0;
        setPull(0);
      }
    };
    const touchEnd = () => {
      void finish();
    };
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("touchend", touchEnd, { passive: true });
    window.addEventListener("touchcancel", touchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
      window.removeEventListener("touchcancel", touchEnd);
    };
  }, []);

  return { pull, refreshing };
}

export default function App() {
  const all = useNotesStore((state) => state.all);
  const visibleCount = useNotesStore((state) => state.visibleCount);
  const loading = useNotesStore((state) => state.loading);
  const query = useNotesStore((state) => state.query);
  const liked = useNotesStore((state) => state.liked);
  const refreshCount = useNotesStore((state) => state.refreshCount);
  const setQuery = useNotesStore((state) => state.setQuery);
  const loadMore = useNotesStore((state) => state.loadMore);
  const refresh = useNotesStore((state) => state.refresh);
  const toggleLike = useNotesStore((state) => state.toggleLike);
  const publish = useNotesStore((state) => state.publish);

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { pull, refreshing } = usePullToRefresh(refresh);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return all;
    return all.filter((note) =>
      `${note.title} ${note.author} ${note.tag}`.toLowerCase().includes(keyword)
    );
  }, [all, query]);

  const items = filtered.slice(0, visibleCount);
  const hasMore = items.length < filtered.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) void loadMore();
      },
      { rootMargin: "520px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, items.length, filtered.length, loading]);

  const showToast = (message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 1800);
  };

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const handlePublish = (title: string, body: string) => {
    publish(title, body);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("发布成功，已出现在瀑布流顶部");
  };

  const changeCategory = (category: string) => {
    setQuery(category === "推荐" ? "" : category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1d2129]">
      <Header query={query} onQueryChange={setQuery} onPublish={() => setModalOpen(true)} />

      <div
        className="pointer-events-none fixed left-1/2 z-20 transition-transform duration-150"
        style={{
          top: "66px",
          transform: `translate(-50%, ${refreshing ? 4 : Math.max(-44, pull - 46)}px)`,
          opacity: pull > 4 || refreshing ? 1 : 0
        }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] text-gray-500 shadow-card">
          <span
            className="inline-flex transition-transform"
            style={{ transform: pull >= 54 && !refreshing ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            {refreshing ? <Spinner className="h-3.5 w-3.5" /> : <ArrowDownIcon className="h-3.5 w-3.5" />}
          </span>
          {refreshing ? "正在刷新…" : pull >= 54 ? "松开刷新" : "下拉刷新"}
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-20 pt-3 sm:px-6 sm:pt-4">
        <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {CATEGORIES.map((category) => {
            const active = category === "推荐" ? query.trim() === "" : query === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => changeCategory(category)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] transition ${
                  active
                    ? "bg-[#1d2129] font-medium text-white"
                    : "bg-white text-gray-600 shadow-card hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {query.trim() && (
          <p className="mb-3 text-[12px] text-gray-500">
            “{query.trim()}” 的搜索结果 · {filtered.length} 篇笔记
          </p>
        )}

        {items.length > 0 ? (
          <div key={refreshCount} className="masonry animate-fadeIn columns-2 md:columns-3 xl:columns-4">
            {items.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                liked={Boolean(liked[note.id])}
                onToggleLike={toggleLike}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-card">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="mt-4 text-[14px] font-medium text-gray-700">没有找到相关笔记</p>
            <p className="mt-1 text-[12px] text-gray-400">换个关键词，或者去发布第一篇吧</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 rounded-full bg-xhs px-4 py-2 text-[12px] font-medium text-white"
            >
              返回推荐
            </button>
          </div>
        )}

        <div ref={sentinelRef} className="flex min-h-[64px] items-center justify-center py-5">
          {loading ? (
            <span className="flex items-center gap-2 text-[12px] text-gray-400">
              <Spinner className="h-4 w-4" /> 正在加载更多…
            </span>
          ) : hasMore ? (
            <button
              type="button"
              onClick={() => void loadMore()}
              className="rounded-full bg-white px-4 py-2 text-[12px] text-gray-500 shadow-card hover:bg-gray-50"
            >
              加载更多
            </button>
          ) : items.length > 0 ? (
            <span className="text-[12px] text-gray-400">到底啦 · 去记录一点生活吧</span>
          ) : null}
        </div>

        <footer className="safe-bottom mt-2 text-center text-[11px] text-gray-400">
          小蓝书 · 瀑布流社区 · Mock 数据 · React 18 + TypeScript + Zustand
        </footer>
      </main>

      <PublishModal open={modalOpen} onClose={() => setModalOpen(false)} onPublish={handlePublish} />

      <div
        className={`pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1d2129]/90 px-4 py-2 text-[12px] text-white shadow-lg transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  );
}
