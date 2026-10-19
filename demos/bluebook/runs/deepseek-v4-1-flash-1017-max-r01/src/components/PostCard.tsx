import { useState } from "react";
import type { Post } from "../types";
import { DEFAULT_IMAGE } from "../data/mock";
import { useFeedStore, usePostLikes } from "../store/useFeedStore";
import { HeartIcon } from "./Icons";

export function formatLikes(value: number) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1).replace(/\.0$/, "")}万`;
  }
  return value.toLocaleString("zh-CN");
}

interface PostCardProps {
  post: Post;
  onOpen: (post: Post) => void;
}

export function PostCard({ post, onOpen }: PostCardProps) {
  const { liked, likes } = usePostLikes(post);
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const [failed, setFailed] = useState(false);

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-card transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lift active:scale-[0.985]"
      onClick={() => onOpen(post)}
      aria-label={post.title}
    >
      <div
        className="relative overflow-hidden bg-[#eeeae5]"
        style={{ aspectRatio: `1 / ${post.ratio}` }}
      >
        <img
          src={failed ? DEFAULT_IMAGE : post.image}
          alt={post.title}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full select-none object-cover transition duration-500 ease-out group-hover:scale-[1.035]"
        />
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
          {post.category}
        </span>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="px-2.5 pb-2.5 pt-2">
        <h3 className="line-clamp-2 min-h-[2.6em] text-[13px] font-medium leading-[1.35] text-neutral-800">
          {post.title}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <img
              src={post.avatar}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full bg-neutral-100 object-cover ring-1 ring-black/5"
            />
            <span className="truncate text-[11px] text-neutral-500">{post.author}</span>
          </div>
          <button
            type="button"
            aria-label={liked ? "取消点赞" : "点赞"}
            aria-pressed={liked}
            className={`flex shrink-0 items-center gap-0.5 rounded-full px-1 py-0.5 text-[11px] tabular-nums transition active:scale-90 ${
              liked ? "text-brand" : "text-neutral-500 hover:text-brand"
            }`}
            onClick={(event) => {
              event.stopPropagation();
              toggleLike(post.id);
            }}
          >
            <HeartIcon
              filled={liked}
              className={`h-[15px] w-[15px] ${liked ? "animate-pop" : ""}`}
            />
            <span>{formatLikes(likes)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-card">
      <div className="h-52 w-full animate-shimmer bg-[linear-gradient(90deg,#f2f2f2_25%,#e9e9e9_37%,#f2f2f2_63%)] bg-[length:800px_100%]" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-4/5 rounded bg-neutral-200" />
        <div className="h-3 w-3/5 rounded bg-neutral-100" />
      </div>
    </div>
  );
}
