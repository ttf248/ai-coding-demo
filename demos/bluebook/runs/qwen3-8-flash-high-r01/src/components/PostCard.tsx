import { useState } from "react";
import LazyLoad from "react-lazyload";
import { MockPost } from "../data/mock";
import { useFeedStore } from "../store/feed";
import LazyImage from "./LazyImage";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M12 20.3 4.6 13a4.9 4.9 0 0 1 0-7 4.9 4.9 0 0 1 7 0l.4.4.4-.4a4.9 4.9 0 0 1 7 0 4.9 4.9 0 0 1 0 7z" />
    </svg>
  );
}

interface Props {
  post: MockPost;
  imagePx: number;
}

export default function PostCard({ post, imagePx }: Props) {
  const liked = useFeedStore((s) => !!s.likedIds[post.id]);
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const [popKey, setPopKey] = useState(0);

  return (
    <article className="group cursor-pointer overflow-hidden rounded-card bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97] active:duration-75">
      <LazyLoad height={imagePx} offset={240} once>
        <LazyImage src={post.image} alt={post.title} height={imagePx} />
      </LazyLoad>
      <h3 className="line-clamp-2 px-2.5 pt-2 text-sm font-medium leading-snug text-gray-800">
        {post.title}
      </h3>
      <div className="flex items-center gap-1.5 px-2.5 pb-2.5 pt-1.5">
        <img
          src={post.avatar}
          alt={post.author}
          className="h-6 w-6 shrink-0 rounded-full"
        />
        <span className="min-w-0 flex-1 truncate text-xs text-gray-500">
          {post.author}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(post.id);
            if (!liked) setPopKey((k) => k + 1);
          }}
          className={`flex shrink-0 items-center gap-1 text-xs tabular-nums transition ${
            liked ? "text-brand" : "text-gray-500 hover:text-brand"
          }`}
          aria-pressed={liked}
          aria-label="点赞"
        >
          <span key={popKey} className={popKey ? "heart-pop" : ""}>
            <HeartIcon filled={liked} />
          </span>
          {post.likes + (liked ? 1 : 0)}
        </button>
      </div>
    </article>
  );
}
