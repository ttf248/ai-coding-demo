import { useState } from "react";
import LazyLoad from "react-lazyload";
import { FALLBACK_IMAGE } from "../data/mockNotes";
import { useFeedStore } from "../store/useFeedStore";
import type { Note } from "../types";

interface NoteCardProps {
  note: Note;
  index: number;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function NoteCard({ note, index }: NoteCardProps) {
  const [src, setSrc] = useState(note.image);
  const [burst, setBurst] = useState(false);
  const liked = useFeedStore((s) => Boolean(s.liked[note.id]));
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const ratio = `${note.width} / ${note.height}`;

  return (
    <article
      className="note-enter mb-3 block cursor-pointer overflow-hidden rounded-card bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover active:translate-y-0 active:scale-[0.985] active:shadow-card"
      style={{ animationDelay: `${Math.min(index, 14) * 32}ms` }}
    >
      <LazyLoad
        height={Math.round((280 * note.height) / note.width)}
        offset={260}
        once
        placeholder={
          <div className="w-full animate-pulse bg-slate-100" style={{ aspectRatio: ratio }} />
        }
      >
        <img
          src={src}
          alt={note.title}
          loading="lazy"
          onError={() => setSrc(FALLBACK_IMAGE)}
          className="block h-auto w-full object-cover"
          style={{ aspectRatio: ratio }}
        />
      </LazyLoad>

      <div className="px-2.5 pb-2.5 pt-2">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-[1.45] text-slate-800">
          {note.title}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: note.avatarColor }}
          >
            {note.avatar}
          </span>
          <span className="min-w-0 flex-1 truncate">{note.author}</span>
          <button
            type="button"
            aria-label={liked ? "取消点赞" : "点赞"}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(note.id);
              setBurst(true);
            }}
            className={`flex shrink-0 items-center gap-1 rounded-full px-1 py-0.5 transition-colors ${
              liked ? "text-brand" : "text-slate-400"
            }`}
          >
            <span
              className={burst ? "like-burst inline-flex" : "inline-flex"}
              onAnimationEnd={() => setBurst(false)}
            >
              <HeartIcon filled={liked} />
            </span>
            <span className="tabular-nums">{note.likes + (liked ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
