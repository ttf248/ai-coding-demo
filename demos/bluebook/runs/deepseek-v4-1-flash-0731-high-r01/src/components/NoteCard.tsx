import { useState } from "react";
import LazyLoad from "react-lazyload";
import { useFeedStore } from "../store/useFeedStore";
import type { Note } from "../types";

interface Props {
  note: Note;
}

function formatLikes(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return String(n);
}

/** 单张瀑布流卡片：图片 + 标题 + 文字头像 + 昵称 + 点赞 */
export function NoteCard({ note }: Props) {
  const liked = useFeedStore((s) => Boolean(s.liked[note.id]));
  const bump = useFeedStore((s) => s.likeBumps[note.id] ?? 0);
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const [failed, setFailed] = useState(false);

  return (
    <article className="animate-fade-in mb-2 break-inside-avoid overflow-hidden rounded-card bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.13)] active:scale-[0.985] sm:mb-3">
      {/* 图片：宽度 100%、高度按原始比例自适应 */}
      <div
        className="relative w-full overflow-hidden bg-neutral-100"
        style={{ aspectRatio: `${note.ratio}` }}
      >
        <LazyLoad
          height={220}
          offset={320}
          once
          placeholder={<div className="skeleton absolute inset-0" />}
        >
          <img
            src={failed ? note.fallback : note.image}
            alt={note.title}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
          />
        </LazyLoad>
      </div>

      <div className="px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3">
        {/* 标题：最多两行，超出省略 */}
        <h3 className="line-clamp-2 text-[13px] font-medium leading-[1.35] text-neutral-800 sm:text-[14px]">
          {note.title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          {/* 文字头像：24px 圆形 */}
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: note.avatarColor }}
            aria-hidden="true"
          >
            {note.author.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1 truncate text-[12px] text-neutral-500">
            {note.author}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(note.id);
            }}
            aria-pressed={liked}
            aria-label={liked ? "取消点赞" : "点赞"}
            className="flex shrink-0 items-center gap-1 text-[12px] text-neutral-500 transition-colors hover:text-xhs"
          >
            {/* key 变化时重放「放大再缩小」动画 */}
            <span
              key={bump}
              className={bump ? "grid animate-heart-pop place-items-center" : "grid place-items-center"}
            >
              <svg
                viewBox="0 0 24 24"
                className={liked ? "h-[15px] w-[15px] text-xhs" : "h-[15px] w-[15px] text-neutral-400"}
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M12 20s-7-4.35-7-9a3.9 3.9 0 017-2.4A3.9 3.9 0 0119 11c0 4.65-7 9-7 9z" />
              </svg>
            </span>
            <span className={liked ? "text-xhs" : ""}>
              {formatLikes(note.likes + (liked ? 1 : 0))}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
