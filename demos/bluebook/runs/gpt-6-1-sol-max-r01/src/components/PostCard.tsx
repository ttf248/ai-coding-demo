import LazyLoad from "react-lazyload";
import { type Post, fallbackImage } from "../mock";
import { useFeed } from "../store";
import { Icon } from "./Icon";
export function PostCard({
  post,
  onOpen,
}: {
  post: Post;
  onOpen: (post: Post) => void;
}) {
  const liked = useFeed((s) => s.likes.includes(post.id)),
    toggle = useFeed((s) => s.toggleLike);
  return (
    <article className="note-card mb-4 overflow-hidden rounded-lg bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[.98]">
      <button
        className="block w-full overflow-hidden bg-stone-100 text-left [&_.lazyload-wrapper]:h-full"
        aria-label={`查看笔记：${post.title}`}
        onClick={() => onOpen(post)}
        style={{ aspectRatio: post.ratio }}
      >
        <LazyLoad
          height={220}
          offset={450}
          once
          placeholder={
            <div className="h-full min-h-52 animate-pulse bg-stone-200" />
          }
        >
          <img
            src={post.image}
            alt={post.title}
            width="700"
            height={Math.round(700 / post.ratio)}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage();
            }}
          />
        </LazyLoad>
      </button>
      <div className="px-3 pb-3 pt-2.5">
        <button
          onClick={() => onOpen(post)}
          className="line-clamp-2 text-left text-[14px] font-semibold leading-6"
        >
          {post.title}
        </button>
        <div className="mt-3 flex items-center justify-between gap-1 text-xs text-stone-500">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-emerald-200 text-[10px] text-emerald-900">
              {post.author.slice(0, 1)}
            </span>
            <span className="truncate">{post.author}</span>
          </span>
          <button
            className={`like flex flex-none items-center gap-1 ${liked ? "liked text-brand" : ""}`}
            aria-label={`${liked ? "取消点赞" : "点赞"}：${post.title}`}
            aria-pressed={liked}
            onClick={() => toggle(post.id)}
          >
            <Icon name="heart" className="h-4 w-4" />
            <span>{post.likes + (liked ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
