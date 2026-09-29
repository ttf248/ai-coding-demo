import { useEffect, useRef } from "react";
import { useAppStore, totalMatched } from "./store/useAppStore";
import SearchBar from "./components/SearchBar";
import NoteCard from "./components/NoteCard";
import RefreshIndicator from "./components/RefreshIndicator";
import { usePullToRefresh } from "./components/usePullToRefresh";
import { EmptyState, LoadingMore, NoMore } from "./components/FooterStates";

export default function App() {
  const notes = useAppStore((s) => s.notes);
  const query = useAppStore((s) => s.query);
  const status = useAppStore((s) => s.status);
  const refreshing = useAppStore((s) => s.refreshing);
  const loadMore = useAppStore((s) => s.loadMore);
  const refresh = useAppStore((s) => s.refresh);

  const sentinel = useRef<HTMLDivElement | null>(null);
  const { offset, progress, armed } = usePullToRefresh(refresh);
  const total = totalMatched(query);

  // 滚动到底部自动加载更多
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, notes.length]);

  return (
    <div className="min-h-screen bg-canvas">
      <SearchBar />
      <RefreshIndicator
        offset={offset}
        progress={progress}
        armed={armed}
        refreshing={refreshing}
      />

      <main key={query} className="animate-fade-in px-2 pt-2 sm:px-6 sm:pt-4">
        {notes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="masonry">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}

        <div ref={sentinel} />
        {status === "loading" ? <LoadingMore /> : null}
        {status === "done" && notes.length > 0 ? <NoMore /> : null}
      </main>

      <footer className="px-4 py-8 text-center text-[11px] text-[#ccc]">
        共 {total} 条内容 · 小蓝书 Demo
      </footer>
    </div>
  );
}
