import { useEffect, useMemo, useRef } from "react";
import NoteCard from "./NoteCard";
import Spinner from "./Spinner";
import { useFeedStore } from "../store";

interface Props {
  base: string;
}

export default function Feed({ base }: Props) {
  const notes = useFeedStore((state) => state.notes);
  const query = useFeedStore((state) => state.query);
  const visible = useFeedStore((state) => state.visible);
  const loading = useFeedStore((state) => state.loading);
  const loadMore = useFeedStore((state) => state.loadMore);
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(keyword) ||
        note.author.toLowerCase().includes(keyword) ||
        note.tag.toLowerCase().includes(keyword),
    );
  }, [notes, query]);

  useEffect(() => {
    const element = sentinel.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [loadMore, visible]);

  if (!filtered.length) {
    return (
      <div className="rounded-lg bg-white py-16 text-center text-sm text-neutral-400">
        没有找到相关内容，换个关键词试试
      </div>
    );
  }

  return (
    <div>
      <div className="masonry columns-2 md:columns-3 xl:columns-4">
        {filtered.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onLike={toggleLike}
            base={base}
          />
        ))}
      </div>
      <div ref={sentinel} aria-hidden="true" className="h-px w-full" />
      {loading && <Spinner label="正在加载更多内容" />}
      {!loading && visible >= 60 && (
        <p className="py-8 text-center text-xs text-neutral-400">
          已经到底啦，去发布新的内容吧
        </p>
      )}
    </div>
  );
}
