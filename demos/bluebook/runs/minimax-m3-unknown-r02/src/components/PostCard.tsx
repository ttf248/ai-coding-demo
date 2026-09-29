import React, { useState } from 'react';
import LazyLoad from 'react-lazyload';
import type { Post } from '../types';
import { FilledHeartIcon, HeartIcon, ImageIcon } from './Icons';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onOpen: (postId: string) => void;
}

function formatLikes(value: number): string {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onOpen }) => {
  const [svgFailed, setSvgFailed] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(post.id);
    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 320);
  };

  const handleOpen = () => {
    onOpen(post.id);
  };

  const showFallback = svgFailed;

  return (
    <article
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
      className="card-hover mb-3 flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-sm animate-fade-in focus:outline-none focus:ring-2 focus:ring-primary/40"
      aria-label={post.title}
    >
      <div className="relative w-full overflow-hidden bg-gray-100">
        <LazyLoad
          height={post.height}
          offset={150}
          once
          placeholder={
            <div
              className="w-full animate-pulse bg-gray-100"
              style={{ height: post.height }}
            />
          }
        >
          {showFallback ? (
            <div
              className="flex w-full flex-col items-center justify-center bg-gray-100 text-gray-400"
              style={{ height: post.height }}
            >
              <ImageIcon size={36} className="mb-2" />
              <span className="text-xs">图片加载失败</span>
            </div>
          ) : (
            <img
              src={post.imageUrl}
              alt={post.title}
              loading="lazy"
              className="block w-full object-cover"
              style={{ height: post.height, backgroundImage: post.gradient }}
              onError={() => setSvgFailed(true)}
            />
          )}
        </LazyLoad>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 transition-opacity duration-200 hover:opacity-100" />
      </div>

      <div className="flex flex-col gap-3 p-3">
        <h3 className="text-ellipsis-2 text-sm font-medium leading-snug text-gray-900">
          {post.title}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm"
              style={{ backgroundColor: post.authorColor }}
              aria-hidden="true"
            >
              {post.authorInitial}
            </span>
            <span className="truncate text-xs text-gray-600">
              {post.authorName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLike}
            aria-pressed={post.isLiked}
            aria-label={post.isLiked ? '取消点赞' : '点赞'}
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-all duration-200 ${
              post.isLiked
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 hover:bg-primary/5 hover:text-primary'
            }`}
          >
            {post.isLiked ? (
              <FilledHeartIcon
                size={13}
                className={animating ? 'animate-bounce-heart' : ''}
              />
            ) : (
              <HeartIcon
                size={13}
                className={animating ? 'animate-bounce-heart' : ''}
              />
            )}
            <span className="font-medium tabular-nums">
              {formatLikes(post.likes)}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
