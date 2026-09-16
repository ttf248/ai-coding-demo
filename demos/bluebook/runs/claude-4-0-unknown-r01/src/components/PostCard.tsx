import React, { useState } from 'react';
import { Heart, User } from 'lucide-react';
import LazyLoad from 'react-lazyload';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    onLike(post.id);
    
    // 动画结束后重置状态
    setTimeout(() => setIsLiking(false), 300);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const formatLikes = (likes: number): string => {
    if (likes >= 10000) {
      return `${(likes / 10000).toFixed(1)}w`;
    } else if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}k`;
    }
    return likes.toString();
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm card-hover mb-4 animate-fade-in">
      {/* 图片容器 */}
      <div className="relative overflow-hidden">
        <LazyLoad
          height={300}
          offset={100}
          placeholder={
            <div className="w-full h-64 bg-gray-100 animate-pulse flex items-center justify-center">
              <div className="text-gray-400">Loading...</div>
            </div>
          }
        >
          {!imageError ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className={`w-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                aspectRatio: post.aspectRatio,
                minHeight: '200px',
                maxHeight: '400px',
              }}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            // 错误占位图
            <div
              className="w-full bg-gray-100 flex items-center justify-center"
              style={{ aspectRatio: post.aspectRatio, minHeight: '200px' }}
            >
              <div className="text-center text-gray-400">
                <User className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">图片加载失败</p>
              </div>
            </div>
          )}
        </LazyLoad>

        {/* 图片上的渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* 卡片内容 */}
      <div className="p-3">
        {/* 标题 */}
        <h3 className="text-sm font-medium text-gray-900 text-ellipsis-2 mb-3 leading-5">
          {post.title}
        </h3>

        {/* 底部信息 */}
        <div className="flex items-center justify-between">
          {/* 作者信息 */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-6 w-6 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&size=24&background=fe2c55&color=fff`;
              }}
            />
            <span className="text-xs text-gray-600 truncate">
              {post.author.name}
            </span>
          </div>

          {/* 点赞 */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200 ${
              post.isLiked
                ? 'text-primary bg-primary/10'
                : 'text-gray-500 hover:text-primary hover:bg-primary/5'
            }`}
            disabled={isLiking}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-all duration-200 ${
                post.isLiked ? 'fill-current' : ''
              } ${isLiking ? 'animate-bounce-heart' : ''}`}
            />
            <span className="text-xs font-medium">
              {formatLikes(post.likes)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
