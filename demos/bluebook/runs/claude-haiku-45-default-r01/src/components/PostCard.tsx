import React, { useRef, useEffect, useState } from 'react';
import { useAppStore, type Post } from '../store';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const toggleLike = useAppStore((state) => state.toggleLike);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleImageError = () => {
    setImageFailed(true);
  };

  const getAuthorColor = (initial: string): string => {
    const colors = [
      'bg-red-400',
      'bg-pink-400',
      'bg-purple-400',
      'bg-blue-400',
      'bg-cyan-400',
      'bg-green-400',
      'bg-yellow-400',
      'bg-orange-400',
    ];
    const charCode = initial.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      {/* 图片容器 */}
      <div className="relative bg-gray-200 overflow-hidden">
        {!imageFailed ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            )}
            <img
              src={post.image}
              alt={post.title}
              className={`w-full aspect-[3/4] object-cover transition-transform duration-300 hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="w-full aspect-[3/4] bg-gray-300 flex items-center justify-center text-gray-500">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-3">
        {/* 标题 */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
          {post.title}
        </h3>

        {/* 用户信息 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full ${getAuthorColor(
                post.authorInitial
              )} flex items-center justify-center text-white text-xs font-semibold`}
            >
              {post.authorInitial}
            </div>
            <span className="text-xs text-gray-600">{post.author}</span>
          </div>
        </div>

        {/* 点赞按钮 */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${
            post.liked
              ? 'text-xiaohongshu'
              : 'text-gray-400 hover:text-xiaohongshu'
          }`}
        >
          <span
            className={`text-lg transition-transform ${post.liked ? 'heart-pulse' : ''}`}
          >
            {post.liked ? '❤️' : '🤍'}
          </span>
          <span>{post.likes}</span>
        </button>
      </div>
    </div>
  );
};
