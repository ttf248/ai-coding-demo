import { useEffect, useMemo, useRef } from "react";
import { useAppStore } from "./store/useAppStore";
import { ALL_NOTES } from "./data/notes";
import SearchBar from "./components/SearchBar";
import Masonry from "./components/Masonry";
import NoteCard from "./components/NoteCard";
import { Spinner } from "./components/Icons";
import { usePullToRefresh } from "./components/usePullToRefresh";

const EMPTY = (
  <div className="flex flex-col items-center gap-3 py-24 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-2xl">🫧</div>
    <p className="text-sm text-[#888]">没有找到相关内容</p>
    <p className="text-xs text-[#bbb]">换个关键词试试</p>
  </div>
);

export default function App() {
  const notes = useAppStore((s) => s.notes);
  const query = useAppStore((s) => s.query);
  const status = useAppStore((s) => s.status);
  const refreshing = useAppStore((s) => s.refreshing);
  const fetchPage = useAppStore((s) => s.fetchPage);
  const pullRefresh = useAppStore((s) => s.pullRefresh);

  const sentinel = useRef<HTMLDivElement | null>(null);
  const { pull, ready, ratio } = usePullToRefresh(pullRefresh);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) fetchPage();
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchPage, notes.length]);

  const items = useMemo(
    () => notes.map((note) => ({ key: note.id, ratio: note.width / note.height, note })),
    [notes],
  );

  return (
    <div className="min-h-screen bg-canvas">
      <SearchBar />

      <div
        className="fixed left-1/2 top-2 z-30 -translate-x-1/2 transition-transform duration-200"
        style={{ transform: `translate(-50%, ${pull - 44}px)`, transitionDuration: refreshing ? "0s" : "200ms" }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg">
          {refreshing ? (
            <Spinner className="h-4 w-4 text-brand" />
          ) : (
            <span
              className={`text-base ${ready ? "text-brand" : "text-[#bbb]"}`}
              style={{ transform: `rotate(${ratio * 270}deg)`, display: "inline-block" }}
            >
              ↓
            </span>
          )}
        </div>
      </div>

      <main key={query} className="animate-fade-in px-2 pt-2 sm:px-6 sm:pt-4">
        {notes.length === 0 ? (
          EMPTY
        ) : (
          <Masonry
            items={items}
            getKey={(item) => item.note.id}
            getRatio={(item) => item.note.width / item.note.height}
            renderItem={(item, width) => <NoteCard note={item.note} width={width} />}
          />
        )}

        <div ref={sentinel} />
        <div className="py-6 text-center text-xs text-[#bbb]">
          {status === "loading" ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> 正在加载更多…
            </span>
          ) : status === "done" ? (
            "— 已经到底啦 —"
          ) : (
            `已展示 ${notes.length} / ${ALL_NOTES.length} 条`
          )}
        </div>
      </main>
    </div>
  );
}
