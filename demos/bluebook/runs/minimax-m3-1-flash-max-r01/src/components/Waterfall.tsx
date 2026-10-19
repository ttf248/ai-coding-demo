import { useEffect, useRef } from "react";
import NoteCard from "./NoteCard";
import LoadingMore from "./LoadingMore";
import { selectVisibleNotes, useStore } from "../store/useStore";

export default function Waterfall() {
  const notes = useStore(selectVisibleNotes);
  const loading = useStore((s) => s.loading);
  const hasMore = useStore((s) => s.hasMore);
  const loadMore = useStore((s) => s.loadMore);
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="waterfall columns-2 md:columns-3 lg:columns-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
      <div ref={sentinel} aria-hidden />
      <LoadingMore visible={loading} />
      {!hasMore && notes.length > 0 && (
        <p className="py-8 text-center text-[13px] text-[#a8adb8]">没有更多内容了</p>
      )}
      {notes.length === 0 && (
        <p className="py-20 text-center text-[13px] text-[#a8adb8]">
          没有找到相关内容
        </p>
      )}
    </>
  );
}
