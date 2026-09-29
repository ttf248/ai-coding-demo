import LazyLoad from "react-lazyload";
import { useState, useRef, useEffect } from "react";
import { Heart, ImageFallback } from "./Icons";
import type { Post } from "../data/mock";
import { usePosts } from "../store/usePosts";

type Props = { post: Post };

export function PostCard({ post }: Props) {
  const liked = usePosts((s) => s.liked.has(post.id));
  const toggleLike = usePosts((s) => s.toggleLike);
  const [popKey, setPopKey] = useState(0);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Force the heart-pop animation to replay each click.
  useEffect(() => {
    if (!liked) return;
    setPopKey((k) => k + 1);
  }, [liked]);

  return (
    <article
      data-id={post.id}
      className="group relative bg-white rounded-lg overflow-hidden shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-cardHover active:scale-[0.99] animate-fade-in"
    >
      <LazyLoad
        height={post.height}
        offset={120}
        placeholder={
          <div
            className="skeleton w-full"
            style={{ aspectRatio: `${post.width} / ${post.height}` }}
          />
        }
      >
        {error ? (
          <div
            className="w-full bg-neutral-100 flex flex-col items-center justify-center text-neutral-400 gap-2"
            style={{ aspectRatio: `${post.width} / ${post.height}` }}
          >
            <ImageFallback className="w-7 h-7" />
            <span className="text-xs">图片加载失败</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={post.image}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto"
            onError={() => setError(true)}
          />
        )}
      </LazyLoad>

      <div className="p-3">
        <h3 className="text-sm leading-snug text-neutral-800 line-clamp-2 min-h-[2.6em]">
          {post.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="avatar-initial"
              style={{ backgroundColor: post.avatarColor }}
              aria-hidden="true"
            >
              {post.nickname.slice(0, 1)}
            </span>
            <span className="text-xs text-neutral-500 truncate">
              {post.nickname}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(post.id);
            }}
            className={`inline-flex items-center gap-1 text-xs select-none transition ${
              liked ? "text-brand" : "text-neutral-500 hover:text-brand"
            }`}
            aria-pressed={liked}
            aria-label={liked ? "取消点赞" : "点赞"}
          >
            <span
              key={popKey}
              className={liked ? "inline-block animate-heart-pop" : "inline-block"}
            >
              <Heart filled={liked} className="w-4 h-4" />
            </span>
            <span>{post.likes + (liked ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}