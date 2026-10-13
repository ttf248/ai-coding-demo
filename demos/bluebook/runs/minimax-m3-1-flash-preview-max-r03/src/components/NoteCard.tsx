import { useState } from "react";
import type { Note } from "../types";
import { useFeedStore, useLikeCount } from "../store/useFeedStore";
import { imageHeightFor } from "../lib/layout";
import { formatLikes } from "../lib/fallback";
import LazyImage from "./LazyImage";
import { HeartIcon } from "./Icons";

interface Props {
  note: Note;
  width: number;
}

export default function NoteCard({ note, width }: Props) {
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const liked = useFeedStore((s) => Boolean(s.liked[note.id]));
  const likeCount = useLikeCount(note);
  // 每次点赞自增 key，红心元素重新挂载，动画可以从头播放
  const [popKey, setPopKey] = useState(0);

  const height = imageHeightFor(note, width);

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-card bg-white shadow-[0_1px_2px_rgba(17,17,17,0.06)] transition duration-200 ease-spring hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(17,17,17,0.12)] active:translate-y-0 active:scale-[0.985] active:shadow-[0_1px_2px_rgba(17,17,17,0.06)] sm:hover:-translate-y-1"
      data-note-id={note.id}
    >
      <LazyImage note={note} width={width} height={height} />

      <div className="px-2.5 pt-2.5 pb-3">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-[18px] text-neutral-800">
          {note.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5">
          <img
            src={note.avatar}
            alt={note.nickname}
            draggable={false}
            className="h-6 w-6 shrink-0 rounded-full bg-[#eee] object-cover"
            loading="lazy"
            decoding="async"
          />
          <span className="min-w-0 flex-1 truncate text-[11px] text-neutral-500">
            {note.nickname}
          </span>

          <button
            type="button"
            aria-label={liked ? "取消点赞" : "点赞"}
            aria-pressed={liked}
            data-like={note.id}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(note.id);
              setPopKey((k) => k + 1);
            }}
            className="flex shrink-0 items-center gap-1 rounded-full px-1 py-0.5 text-[11px] transition-colors duration-150 hover:bg-[#fff1f4] active:bg-[#ffe4ea]"
          >
            <HeartIcon
              key={popKey}
              filled={liked}
              className={`h-[15px] w-[15px] ${
                liked ? "animate-heart-pop text-brand" : "text-neutral-400"
              }`}
            />
            <span
              className={`label tabular-nums ${liked ? "text-brand" : "text-neutral-500"}`}
            >
              {formatLikes(likeCount)}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
