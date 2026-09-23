import { useState } from 'react';
import LazyLoad from 'react-lazyload';
import type { Post } from '../types';
import { HeartIcon } from './Icons';

const imageModules = import.meta.glob('../../images/*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const imageUrls = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => [path.split('/').pop()?.replace(/\.svg$/, ''), url]),
) as Record<string, string>;

const fallbackImage = imageUrls['fallback'];

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [heartPulse, setHeartPulse] = useState(0);
  const imageUrl = imageFailed ? fallbackImage : imageUrls[post.image] ?? fallbackImage;

  return (
    <article className="feed-card mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[10px] bg-white align-top shadow-card sm:mb-[18px]">
      <div className="relative overflow-hidden bg-[#f1eef0]">
        <LazyLoad
          once
          offset={360}
          height={240}
          placeholder={<div className="image-placeholder" style={{ aspectRatio: post.ratio }} />}
        >
          <img
            alt={post.title}
            className="post-image block h-auto w-full object-cover"
            decoding="async"
            onError={() => setImageFailed(true)}
            src={imageUrl}
            style={{ aspectRatio: post.ratio }}
          />
        </LazyLoad>
        <span className="image-category absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide sm:text-[11px]">
          {post.category}
        </span>
      </div>
      <div className="px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4 sm:pt-3.5">
        <h2 className="post-title line-clamp-2 text-[13px] font-semibold leading-[1.55] text-[#302e34] sm:text-sm">
          {post.title}
        </h2>
        <div className="mt-3 flex min-w-0 items-center justify-between gap-2 sm:mt-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`author-avatar flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white ${post.avatarColor}`} aria-hidden="true">
              {post.avatar}
            </span>
            <span className="truncate text-[11px] text-[#8b8990] sm:text-xs">{post.author}</span>
          </div>
          <button
            aria-label={`${post.liked ? '取消点赞' : '点赞'}，${post.likes} 个赞`}
            aria-pressed={post.liked}
            className={`like-button flex shrink-0 items-center gap-1 rounded-full py-1 pl-1.5 pr-1 text-[11px] tabular-nums transition hover:bg-[#fff1f3] sm:gap-1.5 sm:text-xs ${post.liked ? 'text-brand' : 'text-[#88858d]'}`}
            onClick={() => {
              setHeartPulse((pulse) => pulse + 1);
              onLike(post.id);
            }}
            type="button"
          >
            <HeartIcon
              key={heartPulse}
              className={`heart-icon h-[17px] w-[17px] ${post.liked ? 'heart-filled' : ''} ${heartPulse ? 'heart-pop-animation' : ''}`}
              filled={post.liked}
            />
            <span>{post.likes > 999 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
