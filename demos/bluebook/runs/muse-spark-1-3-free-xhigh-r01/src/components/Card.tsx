import { useState } from 'react';
import LazyLoad from 'react-lazyload';
import { Post } from '../mock';
import { useStore } from '../store';
function avatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 60%, 55%)`;
}
export default function Card({ post }: { post: Post }) {
  const toggleLike = useStore((s) => s.toggleLike);
  const [pop, setPop] = useState(false);
  const [err, setErr] = useState(false);
  const src = err
    ? ''
    : `https://picsum.photos/seed/${post.seed}/400/${post.height}`;
  return (
    <div className="card-hover bg-white rounded-lg overflow-hidden page-fade">
      <div style={{ minHeight: 120, background: '#eee' }}>
        {err ? (
          <div
            className="flex items-center justify-center text-sm text-gray-400"
            style={{ height: post.height * 0.5, background: 'linear-gradient(135deg,#ffe4e6,#e0e7ff)' }}
          >
            图片加载失败 · 默认图
          </div>
        ) : (
          <LazyLoad height={post.height * 0.5} offset={200} once>
            <img
              src={src}
              alt={post.title}
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={() => setErr(true)}
            />
          </LazyLoad>
        )}
      </div>
      <div className="p-2">
        <p className="clamp2 text-[13px] leading-5 min-h-[40px]">{post.title}</p>
        <div className="flex items-center gap-1 mt-1">
          <span
            className="rounded-full text-white text-[11px] flex items-center justify-center shrink-0"
            style={{ width: 24, height: 24, background: avatarColor(post.author) }}
          >
            {post.author[0]}
          </span>
          <span className="text-xs text-gray-500 truncate flex-1">{post.author}</span>
          <button
            className={pop ? 'like-pop' : ''}
            onClick={() => {
              toggleLike(post.id);
              setPop(true);
              setTimeout(() => setPop(false), 400);
            }}
            aria-label="点赞"
          >
            <span style={{ color: post.liked ? '#fe2c55' : '#9ca3af' }}>{post.liked ? '❤' : '♡'}</span>
          </button>
          <span className="text-xs text-gray-500">{post.likes}</span>
        </div>
      </div>
    </div>
  );
}
