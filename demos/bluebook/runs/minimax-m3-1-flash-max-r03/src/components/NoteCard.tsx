import { useRef, useState } from "react";
import LazyLoad from "react-lazyload";
import type { Note } from "../data";

interface Props {
  note: Note;
  onLike: (id: number) => void;
  base: string;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M12 20.5s-7.2-4.3-7.2-9.4A4.1 4.1 0 0 1 12 8.4a4.1 4.1 0 0 1 7.2 2.7c0 5.1-7.2 9.4-7.2 9.4Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NoteCard({ note, onLike, base }: Props) {
  const [popping, setPopping] = useState(false);
  const timer = useRef<number | null>(null);

  const handleLike = () => {
    onLike(note.id);
    setPopping(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPopping(false), 400);
  };

  const height = Math.round(320 / note.ratio);

  return (
    <article className="card-surface overflow-hidden">
      <div className="relative w-full overflow-hidden bg-neutral-100">
        <LazyLoad
          height={height}
          width="100%"
          offset={120}
          placeholder={
            <div
              className="w-full animate-pulse bg-neutral-100"
              style={{ height }}
            />
          }
        >
          <img
            src={`${base}${note.image}`}
            alt={note.title}
            loading="lazy"
            className="block w-full object-cover"
            style={{ aspectRatio: `1 / ${1 / note.ratio}` }}
            onError={(event) => {
              const img = event.currentTarget;
              if (!img.dataset.fallback) {
                img.dataset.fallback = "1";
                img.src = `${base}images/fallback.svg`;
              }
            }}
          />
        </LazyLoad>
        <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
          {note.tag}
        </span>
      </div>

      <div className="px-3 pb-3 pt-2.5">
        <h3 className="line-clamp-2 text-[15px] font-medium leading-6 text-neutral-800">
          {note.title}
        </h3>
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand/80 to-rose-300 text-[11px] font-semibold text-white"
            >
              {note.avatar}
            </span>
            <span className="truncate text-xs text-neutral-500">
              {note.author}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLike}
            aria-pressed={note.liked}
            aria-label={`点赞，当前 ${note.likes} 赞`}
            className={`flex shrink-0 items-center gap-1 rounded-full px-1.5 py-1 text-xs transition ${
              note.liked ? "text-brand" : "text-neutral-400 hover:text-brand"
            }`}
          >
            <span
              className={popping ? "inline-block animate-like-pop" : "inline-block"}
            >
              <HeartIcon filled={note.liked} />
            </span>
            <span>{note.likes}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
