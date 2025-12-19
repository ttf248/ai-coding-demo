import { useState } from 'react'
import LazyLoad from 'react-lazyload'
import { Post } from '../types'
import { useStore } from '../store/useStore'

interface CardProps {
  post: Post
}

// 默认图片
const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3E图片加载失败%3C/text%3E%3C/svg%3E'

// 文字头像组件
const TextAvatar = ({ name, size = 24 }: { name: string; size?: number }) => {
  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd']
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

export const Card = ({ post }: CardProps) => {
  const { toggleLike } = useStore()
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(post.id)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer press-effect">
      {/* 图片 */}
      <div className="relative w-full">
        <LazyLoad
          height={200}
          offset={100}
          placeholder={
            <div className="w-full bg-gray-100 animate-pulse" style={{ paddingBottom: '120%' }} />
          }
        >
          <img
            src={imageError ? defaultImage : post.image}
            alt={post.title}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className={`w-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ paddingBottom: '120%' }}
          />
        </LazyLoad>
      </div>

      {/* 内容区域 */}
      <div className="p-3">
        {/* 标题 */}
        <h3 className="text-sm text-gray-800 line-clamp-2 leading-relaxed mb-2">
          {post.title}
        </h3>

        {/* 作者信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TextAvatar name={post.author.name} size={24} />
            <span className="text-xs text-gray-600">{post.author.name}</span>
          </div>

          {/* 点赞 */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1 press-effect"
          >
            <svg
              className={`w-4 h-4 transition-colors duration-200 ${
                post.isLiked ? 'text-redbook fill-redbook' : 'text-gray-400'
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className={`text-xs ${post.isLiked ? 'text-redbook' : 'text-gray-400'}`}>
              {post.likes > 999 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
