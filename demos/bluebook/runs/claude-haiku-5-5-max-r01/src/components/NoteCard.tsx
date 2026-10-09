import LazyLoadModule from "react-lazyload";
import { useFeed } from "../store";
import type { Note } from "../types";

// react-lazyload ships CommonJS; some bundler paths return the module object rather than its default export.
const LazyLoad = (LazyLoadModule as unknown as { default?: typeof LazyLoadModule }).default ?? LazyLoadModule;

const FALLBACK = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#e5e5e5"/><text x="150" y="158" text-anchor="middle" font-size="20" fill="#9a9a9a">图片加载失败</text></svg>')}`;

export default function NoteCard({ note }: { note: Note }) {
  const liked = useFeed((s) => Boolean(s.liked[note.id]));
  const toggleLike = useFeed((s) => s.toggleLike);
  const coverHeight = Math.round(300 * note.ratio);

  return (
    <article className="fade-in cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.97]">
      <LazyLoad
        once
        offset={160}
        height={coverHeight}
        placeholder={<div className="w-full bg-neutral-200" style={{ aspectRatio: `1 / ${note.ratio}` }} />}
      >
        <img
          src={note.cover}
          alt={note.title}
          width={300}
          height={coverHeight}
          className="block h-auto w-full"
          onError={(e) => {
            e.currentTarget.src = FALLBACK;
          }}
        />
      </LazyLoad>
      <div className="p-2.5">
        <h3 className="line-clamp-2 text-[14px] leading-5 text-neutral-900">{note.title}</h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <img src={note.avatar} alt="" width={24} height={24} className="h-6 w-6 flex-none rounded-full" />
            <span className="truncate text-xs text-neutral-500">{note.author}</span>
          </div>
          <button
            type="button"
            aria-pressed={liked}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(note.id);
            }}
            className={`flex flex-none items-center gap-1 text-xs ${liked ? "text-brand" : "text-neutral-500"}`}
          >
            <svg
              key={String(liked)}
              viewBox="0 0 24 24"
              className={`h-4 w-4 ${liked ? "beat" : ""}`}
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M12 21s-7-4.35-9.5-8.5C.8 9.2 2.2 5 6 5c2.1 0 3.4 1.2 4 2.3C10.6 6.2 11.9 5 14 5c3.8 0 5.2 4.2 3.5 7.5C19 16.65 12 21 12 21z" />
            </svg>
            {note.likes + (liked ? 1 : 0)}
          </button>
        </div>
      </div>
    </article>
  );
}
