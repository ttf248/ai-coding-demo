import { useEffect, useRef, useState } from "react";
import LazyLoad from "react-lazyload";
import { FALLBACK_IMAGE, type Note } from "../data";
import { HeartIcon } from "./Icons";

interface NoteCardProps {
  note: Note;
  liked: boolean;
  onToggleLike: (id: string) => void;
}

function formatLikes(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return String(value);
}

export default function NoteCard({ note, liked, onToggleLike }: NoteCardProps) {
  const [src, setSrc] = useState(note.image);
  const [popping, setPopping] = useState(false);
  const popTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setSrc(note.image);
  }, [note.image]);

  useEffect(() => () => window.clearTimeout(popTimer.current), []);

  const handleLike = () => {
    onToggleLike(note.id);
    setPopping(true);
    window.clearTimeout(popTimer.current);
    popTimer.current = window.setTimeout(() => setPopping(false), 340);
  };

  const likes = note.likes + (liked ? 1 : 0);

  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-float active:scale-[.99]">
      <div className="relative bg-[#f2f3f5]">
        <LazyLoad
          once
          offset={420}
          placeholder={
            <div
              className="lazy-placeholder"
              style={{ aspectRatio: `600 / ${note.height}` }}
              aria-hidden="true"
            />
          }
        >
          <img
            src={src}
            alt={note.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => {
              if (src !== FALLBACK_IMAGE) setSrc(FALLBACK_IMAGE);
            }}
            className="block h-auto w-full select-none object-cover"
            style={{ aspectRatio: `600 / ${note.height}` }}
          />
        </LazyLoad>
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white ">
          {note.tag}
        </span>
      </div>

      <div className="p-2.5">
        <h2 className="line-clamp-2 text-[13px] font-medium leading-[1.45] text-gray-900">
          {note.title}
        </h2>
        <div className="mt-2 flex items-center gap-1.5">
          <img
            src={note.avatar}
            alt=""
            className="h-6 w-6 shrink-0 rounded-full bg-gray-100 object-cover"
            loading="lazy"
          />
          <span className="min-w-0 flex-1 truncate text-[11px] text-gray-500">{note.author}</span>
          <button
            type="button"
            onClick={handleLike}
            aria-pressed={liked}
            aria-label={liked ? `取消点赞，${likes} 个赞` : `点赞，${likes} 个赞`}
            className={`ml-auto flex shrink-0 items-center gap-0.5 rounded-full px-1 py-0.5 text-[11px] transition-colors ${
              liked ? "text-xhs" : "text-gray-400 hover:text-xhs"
            }`}
          >
            <span className={popping ? "animate-heartPop" : ""}>
              <HeartIcon filled={liked} className="h-[15px] w-[15px]" />
            </span>
            <span className="tabular-nums">{formatLikes(likes)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
