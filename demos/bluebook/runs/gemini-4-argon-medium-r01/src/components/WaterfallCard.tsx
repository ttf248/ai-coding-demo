import React, { useState } from 'react';
import LazyLoad from 'react-lazyload';
import { PostItem, FALLBACK_IMAGE_URL } from '../mockData';

interface WaterfallCardProps {
  post: PostItem;
  forceBroken: boolean;
  onToggleLike: (id: string) => void;
  onSelectPost: (post: PostItem) => void;
}

export const WaterfallCard: React.FC<WaterfallCardProps> = ({
  post,
  forceBroken,
  onToggleLike,
  onSelectPost
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [animatingHeart, setAnimatingHeart] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingHeart(true);
    onToggleLike(post.id);
    setTimeout(() => setAnimatingHeart(false), 380);
  };

  const displaySrc =
    imgFailed || forceBroken || post.simulateBroken ? FALLBACK_IMAGE_URL : post.imageUrl;

  return (
    <article
      onClick={() => onSelectPost(post)}
      className="bg-white rounded-[8px] overflow-hidden shadow-sm border border-neutral-100 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] select-none"
    >
      {/* 图片容器：宽度 100%，高度按比例自适应 + react-lazyload 懒加载 + 失败默认占位图 */}
      <div className="w-full bg-neutral-100 relative overflow-hidden">
        <LazyLoad
          height={220}
          offset={120}
          once
          placeholder={
            <div
              style={{ aspectRatio: `${1 / post.aspectRatio}` }}
              className="w-full bg-neutral-200 animate-pulse flex items-center justify-center text-xs text-neutral-400"
            >
              加载中...
            </div>
          }
        >
          <img
            src={displaySrc}
            alt={post.title}
            onError={() => setImgFailed(true)}
            className="w-full h-auto block object-cover"
          />
        </LazyLoad>
      </div>

      {/* 卡片正文区域 */}
      <div className="p-3 space-y-2.5">
        {/* 标题：最多两行，超出显示 ... */}
        <h3
          className="text-[13.5px] font-semibold text-neutral-800 leading-snug overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {post.title}
        </h3>

        {/* 作者圆形 24px 头像 + 昵称 + 右侧红心点赞动画 */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              style={{ backgroundColor: post.authorColor }}
              className="w-[24px] h-[24px] rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-inner"
            >
              {post.authorInitial}
            </div>
            <span className="text-xs text-neutral-500 truncate">{post.authorName}</span>
          </div>

          <button
            type="button"
            onClick={handleLikeClick}
            aria-label="点赞"
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-[#fe2c55] transition-colors py-0.5 px-1.5 rounded-full"
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 transition-transform ${
                animatingHeart ? 'animate-heart-pop' : ''
              } ${
                post.liked
                  ? 'fill-[#fe2c55] stroke-[#fe2c55]'
                  : 'fill-none stroke-neutral-400'
              }`}
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            <span className={post.liked ? 'text-[#fe2c55] font-semibold' : ''}>
              {post.likes}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
