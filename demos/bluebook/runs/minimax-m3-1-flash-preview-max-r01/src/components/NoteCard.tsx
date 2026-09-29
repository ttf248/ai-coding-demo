import { useState } from "react";
import LazyLoad from "react-lazyload";
import { useAppStore } from "../store/useAppStore";
import type { Note } from "../data/notes";
import { HeartIcon } from "./Icons";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#f0f0f0"/>
      <g fill="none" stroke="#c9c9c9" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
        <path d="M180 250l80-80 60 60 45-45 55 55"/>
        <circle cx="230" cy="150" r="26"/>
      </g>
      <text x="300" y="330" font-family="sans-serif" font-size="26" fill="#b0b0b0" text-anchor="middle">图片加载失败</text>
    </svg>`,
  );

const formatLikes = (value: number) =>
  value >= 10000 ? `${(value / 10000).toFixed(1)}w` : String(value);

export default function NoteCard({ note }: { note: Note }) {
  const liked = useAppStore((s) => !!s.liked[note.id]);
  const toggleLike = useAppStore((s) => s.toggleLike);
  const [broken, setBroken] = useState(false);
  const [burst, setBurst] = useState(0);

  const onLike = () => {
    if (!liked) {
      setBurst((n) => n + 1);
      window.setTimeout(() => setBurst((n) => n - 1), 430);
    }
    toggleLike(note.id);
  };

  return (
    <article
      className="overflow-hidden rounded-card bg-white shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] active:duration-75"
    >
      <div className="relative bg-[#f2f2f2]">
        <LazyLoad height={note.height} throttle={0} once>
          <img
            src={broken ? FALLBACK_IMAGE : note.image}
            alt={note.title}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="block w-full object-cover"
            style={{ aspectRatio: `${note.width} / ${note.height}` }}
          />
        </LazyLoad>
      </div>

      <div className="px-3 py-2.5">
        <h2 className="line-clamp-2 text-[13px] font-medium leading-5 text-[#222]">
          {note.title}
        </h2>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
              style={{
                backgroundImage: `linear-gradient(135deg, ${note.avatarFrom}, ${note.avatarTo})`,
              }}
              aria-hidden="true"
            >
              {note.avatar}
            </span>
            <span className="truncate text-xs text-[#888]">{note.author}</span>
          </div>

          <button
            type="button"
            onClick={onLike}
            aria-label={liked ? "取消点赞" : "点赞"}
            aria-pressed={liked}
            className="flex shrink-0 items-center gap-1 rounded-full px-1 py-0.5 text-xs text-[#999] transition-colors hover:text-brand active:scale-90"
          >
            <HeartIcon
              filled={liked}
              className={`h-4 w-4 ${liked ? "text-brand" : ""} ${burst ? "animate-pop" : ""}`}
            />
            <span className={liked ? "font-medium text-brand" : ""}>
              {formatLikes(note.likes + (liked ? 1 : 0))}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
