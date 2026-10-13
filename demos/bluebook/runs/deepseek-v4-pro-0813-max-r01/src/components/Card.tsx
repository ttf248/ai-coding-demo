import { useRef, useState } from 'react';
import LazyLoad from 'react-lazyload';
import type { Post } from '../data';
import { useStore } from '../store';

const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#ececec"/><text x="300" y="200" font-size="28" fill="#9aa0a6" text-anchor="middle" font-family="sans-serif">图片加载失败</text></svg>',
  );

export default function Card({ post }: { post: Post }) {
  const liked = useStore((s) => s.liked[post.id] ?? false);
  const extra = useStore((s) => s.extraLikes[post.id] ?? 0);
  const toggleLike = useStore((s) => s.toggleLike);
  const [failed, setFailed] = useState(false);
  const [pop, setPop] = useState(false);
  const timer = useRef<number>();

  const onLike = () => {
    toggleLike(post.id);
    if (!liked) {
      setPop(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setPop(false), 350);
    }
  };

  return (
    <article
      className="bg-white rounded-lg overflow-hidden shadow-sm active:scale-[0.98] transition-transform duration-150"
      data-testid="card"
    >
      <div className="relative transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md" style={{ height: post.height }}>
        <LazyLoad height={post.height} offset={300} once>
          {failed ? (
            <img src={FALLBACK} alt={post.title} className="w-full h-full object-cover" data-testid="fallback" />
          ) : (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setFailed(true)}
              data-testid="post-image"
            />
          )}
        </LazyLoad>
        {post.tags[0] && (
          <span className="absolute top-2 left-2 bg-black/35 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur">
            {post.tags[0]}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-[13px] leading-snug line-clamp-2 min-h-[34px]">{post.title}</h3>
        <div className="mt-2 flex items-center gap-1.5">
          <img src={post.avatar} alt={post.author} className="w-6 h-6 rounded-full object-cover bg-page" />
          <span className="text-[11px] text-gray-500 truncate">{post.author}</span>
          <button
            onClick={onLike}
            className="ml-auto flex items-center gap-1 text-gray-400 active:scale-90 transition-transform"
            aria-label="点赞"
            data-testid="like"
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 ${pop ? 'heart-pop' : ''} transition-colors ${liked ? 'text-brand' : ''}`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 21s-7.5-4.6-10-9.2C.4 8.2 2.3 4.5 5.9 4.5c2.1 0 3.7 1.2 4.6 2.5.9-1.3 2.5-2.5 4.6-2.5 3.6 0 5.5 3.7 3.9 7.3C19.5 16.4 12 21 12 21z" />
            </svg>
            <span className="text-[11px] tabular-nums">{post.likes + extra}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
