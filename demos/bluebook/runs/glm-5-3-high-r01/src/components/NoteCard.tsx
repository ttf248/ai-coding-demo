import { useState } from "react";
import LazyLoad from "react-lazyload";
import type { Note } from "../types";
import { useFeed } from "../store";

const FALLBACK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="620"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" fill="#9ca3af" font-size="20" text-anchor="middle">图片走丢了</text></svg>'
  );

function formatLikes(n: number) {
  return n >= 10000 ? `${(n / 10000).toFixed(1)}万` : String(n);
}

interface Props {
  note: Note;
}

export default function NoteCard({ note }: Props) {
  const liked = useFeed((s) => !!s.liked[note.id]);
  const bumps = useFeed((s) => s.likeBumps[note.id] ?? 0);
  const toggleLike = useFeed((s) => s.toggleLike);
  const [failed, setFailed] = useState(false);

  return (
    <article className="card-press mb-2 cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <LazyLoad
        once
        offset={200}
        placeholder={
          <div
            style={{ aspectRatio: String(note.ratio) }}
            className="w-full animate-pulse bg-slate-200"
          />
        }
      >
        <img
          src={failed ? FALLBACK : note.img}
          onError={() => setFailed(true)}
          alt={note.title}
          className="w-full"
        />
      </LazyLoad>
      <div className="px-2 pb-2 pt-1.5">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-slate-800">
          {note.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          <img
            src={note.avatar}
            alt={note.author}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="truncate text-[11px] text-slate-500">
            {note.author}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(note.id);
            }}
            className="ml-auto flex shrink-0 items-center gap-0.5 pl-1"
            aria-label="点赞"
          >
            <svg
              key={bumps}
              viewBox="0 0 24 24"
              className={`h-4 w-4 ${
                liked
                  ? "animate-heart-pop fill-brand stroke-brand"
                  : "fill-none stroke-slate-400"
              }`}
              strokeWidth="2"
            >
              <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2.6 4.5 6.1 4.5c2 0 3.4 1.1 4.4 2.4h3c1-1.3 2.4-2.4 4.4-2.4 3.5 0 5.6 3.5 4.1 7.2C19.5 16.3 12 21 12 21z" />
            </svg>
            <span
              className={`text-[11px] ${
                liked ? "font-medium text-brand" : "text-slate-500"
              }`}
            >
              {formatLikes(note.likes + (liked ? 1 : 0))}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
