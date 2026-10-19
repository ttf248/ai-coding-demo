import { useState, type MouseEvent } from "react";
import LazyLoad from "react-lazyload";
import { FALLBACK_IMG, type Post } from "../data/mock";
import { useFeedStore } from "../store";

function formatLikes(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "w";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

export default function MasonryCard({ post }: { post: Post }) {
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const [pop, setPop] = useState(false);

  const onLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleLike(post.id);
    setPop(true);
    window.setTimeout(() => setPop(false), 460);
  };

  return (
    <article className="mb-3 animate-bounce-in">
      {/* 注意：入场动画放在外层 article，避免 animation 的 transform 覆盖 hover 上浮效果 */}
      <div className="card-frame bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer">
        <LazyLoad
          height={post.height}
          offset={400}
          once
          placeholder={<div className="bg-gray-100 animate-pulse" style={{ height: post.height }} />}
        >
          <img
            src={post.img}
            alt={post.title}
            draggable={false}
            className="w-full h-auto block bg-gray-100"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
            }}
          />
        </LazyLoad>
        <div className="p-2.5">
          <h3 className="text-[13px] leading-snug font-medium line-clamp-2">{post.title}</h3>
          <div className="mt-2 flex items-center">
            <span
              className="w-6 h-6 rounded-full text-white text-[11px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: post.avatarColor }}
              aria-hidden
            >
              {post.author.slice(0, 1)}
            </span>
            <span className="ml-1.5 text-xs text-gray-500 truncate flex-1">{post.author}</span>
            <button
              type="button"
              onClick={onLike}
              aria-label={post.liked ? "取消点赞" : "点赞"}
              aria-pressed={post.liked}
              className="flex items-center gap-1 text-xs text-gray-500 active:scale-90 transition-transform"
            >
              <svg
                viewBox="0 0 24 24"
                className={"w-4 h-4 " + (pop ? "animate-heart-pop" : "")}
                fill={post.liked ? "#fe2c55" : "none"}
                stroke={post.liked ? "#fe2c55" : "currentColor"}
                strokeWidth="2"
                strokeLinejoin="round"
              >
                <path d="M19.5 12.57 12 20l-7.5-7.43A5 5 0 1 1 12 6.01a5 5 0 1 1 7.5 6.56Z" />
              </svg>
              <span className={post.liked ? "text-xhs" : ""}>{formatLikes(post.likes)}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
