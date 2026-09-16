import { useState, useCallback } from 'react'
import { Post } from '../types'
import { useStore } from '../store/useStore'

// 默认图片
const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3E图片加载失败%3C/text%3E%3C/svg%3E'

// 文字头像组件
const TextAvatar = ({ name, size = 24 }: { name: string; size?: number }) => {
  const colors = [
    '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff',
    '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24'
  ]
  const bgColor = colors[name.charCodeAt(0) % colors.length]
  const initial = name.charAt(0).toUpperCase()

  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-medium"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: size * 0.45,
      }}
    >
      {initial}
    </div>
  )
}

// 骨架屏组件
const Skeleton = ({ height }: { height: number }) => (
  <div
    className="w-full bg-gray-200 animate-pulse rounded-t-lg"
    style={{ height }}
  />
)

interface CardProps {
  post: Post
  onClick?: (post: Post) => void
}

export const Card = ({ post, onClick }: CardProps) => {
  const { toggleLike } = useStore()
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [showHeart, setShowHeart] = useState(false)

  // 获取图片高度
  const imageHeight = post.imageHeight || 220

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isLiked) {
      setIsLiked(true)
      setShowHeart(true)
      toggleLike(post.id)

      setTimeout(() => setShowHeart(false), 500)
    } else {
      setIsLiked(false)
      toggleLike(post.id)
    }
  }, [isLiked, post.id, toggleLike])

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleClick = () => {
    onClick?.(post)
  }

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      {/* 图片容器 */}
      <div className="relative w-full overflow-hidden">
        {/* 骨架屏加载状态 */}
        {!imageLoaded && !imageError && <Skeleton height={imageHeight} />}

        {/* 图片 */}
        <img
          src={imageError ? defaultImage : post.image}
          alt={post.title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`w-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ height: imageHeight }}
        />

        {/* 点赞心形动画 */}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <svg
              className="w-12 h-12 text-red-500 fill-red-500 heart-liked"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        )}

        {/* 图片加载遮罩 */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">图片加载失败</span>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-3">
        {/* 标题 */}
        <h3 className="text-sm text-gray-800 line-clamp-2 leading-relaxed mb-2.5 group-hover:text-gray-700">
          {post.title}
        </h3>

        {/* 作者信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TextAvatar name={post.author.name} size={22} />
            <span className="text-xs text-gray-500">{post.author.name}</span>
          </div>

          {/* 点赞 */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 press-effect transition-transform active:scale-90"
          >
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                isLiked
                  ? 'text-redbook fill-redbook scale-110'
                  : 'text-gray-400'
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className={`text-xs transition-colors duration-300 ${
              isLiked ? 'text-redbook font-medium' : 'text-gray-400'
            }`}>
              {post.likes > 999 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
