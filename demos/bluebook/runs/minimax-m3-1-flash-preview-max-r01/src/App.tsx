import { useCallback, useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import PullToRefresh from "./components/PullToRefresh";
import WaterfallGrid from "./components/WaterfallGrid";
import { EmptyState, FeedEnd, LoadingMore } from "./components/FeedStates";
import useInfiniteScroll from "./hooks/useInfiniteScroll";
import { useFeedStore } from "./store/useFeedStore";

export default function App() {
  const notes = useFeedStore((s) => s.notes);
  const status = useFeedStore((s) => s.status);
  const keyword = useFeedStore((s) => s.keyword);
  const epoch = useFeedStore((s) => s.epoch);
  const setKeyword = useFeedStore((s) => s.setKeyword);

  const sentinel = useInfiniteScroll();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const onPublish = useCallback(() => {
    setToast("这是静态原型，发布流程未接入");
  }, []);

  const showLoading = status === "loading";
  const showEnd = status === "done" && notes.length > 0;

  return (
    <div className="min-h-screen bg-canvas font-sans text-neutral-900 antialiased">
      <TopBar keyword={keyword} onChange={setKeyword} onPublish={onPublish} />

      <PullToRefresh>
        <main className="relative mx-auto w-full max-w-[1180px] px-3 pt-4 pb-24 sm:px-4">
          <div key={epoch} className="animate-fade-in">
            {notes.length === 0 ? (
              <EmptyState keyword={keyword} />
            ) : (
              <WaterfallGrid notes={notes} />
            )}
          </div>

          {notes.length > 0 && (
            <div ref={sentinel} className="h-px w-full" aria-hidden="true" />
          )}

          {showLoading && <LoadingMore />}
          {showEnd && <FeedEnd />}

          {keyword && notes.length > 0 && (
            <p className="py-8 text-center text-[12px] text-neutral-400">
              搜索结果共 {notes.length} 条，清空搜索框可继续浏览推荐流
            </p>
          )}
        </main>
      </PullToRefresh>

      {toast && (
        <div
          role="status"
          className="animate-toast-in fixed bottom-10 left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-900/90 px-4 py-2.5 text-[12.5px] text-white shadow-lg backdrop-blur"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
