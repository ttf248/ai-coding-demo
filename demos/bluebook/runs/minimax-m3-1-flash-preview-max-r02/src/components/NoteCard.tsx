import { memo, useState } from "react";
import LazyLoad from "react-lazyload";
import { useAppStore } from "../store/useAppStore";
import type { Note } from "../data/notes";
import { HeartIcon } from "./Icons";

const BROKEN =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="#f1f1f1"/>
      <g fill="none" stroke="#c6c6c6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M92 168l38-38 30 30 22-22 26 26"/>
        <circle cx="118" cy="106" r="14"/>
      </g>
      <text x="150" y="228" font-family="sans-serif" font-size="17" fill="#b5b5b5" text-anchor="middle">加载失败</text>
    </svg>`,
  );

const compact = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);

interface Props {
  note: Note;
  width: number;
}

function NoteCard({ note, width }: Props) {
  const liked = useAppStore((s) => s.likedIds.includes(note.id));
  const toggleLike = useAppStore((s) => s.toggleLike);
  const [broken, setBroken] = useState(false);
  const [pulse, setPulse] = useState(0);

  const onLike = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!liked) {
      setPulse((n) => n + 1);
      window.setTimeout(() => setPulse((n) => n - 1), 440);
    }
    toggleLike(note.id);
  };

  return (
    <div
      onClick={() => undefined}
      className="cursor-pointer overflow-hidden rounded-card bg-white shadow-card-rest transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover active:translate-y-0 active:scale-[0.97]"
      style={{ height: width / (note.width / note.height) + 96 }}
    >
      <LazyLoad height={Math.round(width / (note.width / note.height))} throttle={0} once>
        <img
          src={broken ? BROKEN : note.image}
          alt={note.title}
          decoding="async"
          onError={() => setBroken(true)}
          className="block w-full"
          style={{ height: width / (note.width / note.height), objectFit: "cover" }}
        />
      </LazyLoad>

      <div className="flex h-[96px] flex-col justify-between px-3 py-2.5">
        <h2 className="line-clamp-2 text-[13px] font-medium leading-5 text-[#222]">
          {note.title}
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundImage: `linear-gradient(140deg, ${note.avatarFrom}, ${note.avatarTo})` }}
            >
              {note.avatar}
            </span>
            <span className="truncate text-xs text-[#8b8b8b]">{note.author}</span>
          </div>

          <button
            type="button"
            onClick={onLike}
            aria-label={liked ? "取消点赞" : "点赞"}
            aria-pressed={liked}
            className="flex shrink-0 items-center gap-1 text-xs text-[#9a9a9a] transition-colors hover:text-brand"
          >
            <HeartIcon
              filled={liked}
              className={`h-4 w-4 ${liked ? "text-brand" : ""} ${pulse ? "animate-pop" : ""}`}
            />
            <span className={liked ? "font-semibold text-brand" : ""}>
              {compact(note.likes + (liked ? 1 : 0))}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(NoteCard);
