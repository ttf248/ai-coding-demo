import React, { useState } from 'react'
import LazyLoad from 'react-lazyload'
import { Heart } from 'lucide-react'
import { PostItem, useStore } from '../store/useStore'

interface PostCardProps {
  post: PostItem
}

const DEFAULT_AVATAR_COLORS = [
  'bg-red-100',
  'bg-blue-100',
  'bg-yellow-100',
  'bg-green-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-indigo-100',
]

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { toggleLike } = useStore()
  const [imageError, setImageError] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)

  const avatarColor = DEFAULT_AVATAR_COLORS[post.id % DEFAULT_AVATAR_COLORS.length]
  const avatarText = post.author.charAt(0)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(post.id)
    setShowHeartAnimation(true)
    setTimeout(() => setShowHeartAnimation(false), 600)
  }

  const handleCardClick = () => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
  }

  return (
    <div
      className={`break-inside-avoid mb-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer ${
        isPressed ? 'scale-95' : 'hover:-translate-y-1'
      } animate-fade-in`}
      onClick={handleCardClick}
    >
      <LazyLoad height={200} offset={100}>
        {!imageError ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-auto object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">图片加载失败</span>
          </div>
        )}
      </LazyLoad>

      <div className="p-3">
        <h3 className="text-sm text-gray-800 line-clamp-2 mb-3">
          {post.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${avatarColor} flex items-center justify-center text-xs font-medium text-gray-600`}>
              {avatarText}
            </div>
            <span className="text-xs text-gray-600">{post.author}</span>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors ${
              post.isLiked ? 'text-redbook' : 'text-gray-400'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${post.isLiked ? 'fill-redbook' : ''} ${
                showHeartAnimation ? 'animate-heart-beat' : ''
              }`}
            />
            <span className="text-xs">{post.likes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
