import React, { useState } from 'react'
import LazyLoad from 'react-lazyload'
import { Heart, MessageCircle, Share, Bookmark } from 'lucide-react'
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
  const { toggleLike, setCurrentView, setSelectedPost } = useStore()
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

  const handleButtonClick = (e: React.MouseEvent) => {
    const button = e.currentTarget as HTMLElement
    button.classList.add('animate-button-press')
    setTimeout(() => {
      button.classList.remove('animate-button-press')
    }, 200)
  }

  const handleCardClick = () => {
    setIsPressed(true)
    setTimeout(() => {
      setIsPressed(false)
      // 导航到详情页
      setSelectedPost(post)
      setCurrentView('detail')
    }, 150)
  }

  const renderStandardCard = () => (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group ${
        isPressed ? 'scale-95' : 'hover:-translate-y-2'
      } animate-fade-in`}
      onClick={handleCardClick}
    >
      <LazyLoad height={200} offset={100}>
        {!imageError ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
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
        <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 mb-3">
          {post.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${avatarColor} flex items-center justify-center text-xs font-medium text-gray-600`}>
              {avatarText}
            </div>
            <span className="text-xs text-gray-600">{post.author}</span>
          </div>

          <button
            onClick={(e) => {
              handleLike(e)
              handleButtonClick(e)
            }}
            className={`flex items-center gap-1 transition-all duration-200 hover:scale-110 ${
              post.isLiked ? 'text-redbook' : 'text-gray-400'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${post.isLiked ? 'fill-redbook' : ''} ${
                showHeartAnimation ? 'animate-heart-beat' : ''
              }`}
            />
            <span className="text-xs">{post.likes}</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderTallCard = () => (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group ${
        isPressed ? 'scale-95' : 'hover:-translate-y-2'
      } animate-fade-in`}
      onClick={handleCardClick}
    >
      <LazyLoad height={300} offset={100}>
        {!imageError ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ height: '350px' }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[3/5] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">图片加载失败</span>
          </div>
        )}
      </LazyLoad>

      <div className="p-4">
        <div className="flex gap-2 mb-3">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-redbook/10 text-redbook text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 mb-3">
          {post.title}
        </h3>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          今天分享一组超美的图片给大家～每一张都是用心拍摄，希望你们会喜欢！记得点赞收藏哦 💕
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${avatarColor} flex items-center justify-center text-xs font-medium text-gray-600`}>
              {avatarText}
            </div>
            <span className="text-xs text-gray-600">{post.author}</span>
          </div>

          <button
            onClick={(e) => {
              handleLike(e)
              handleButtonClick(e)
            }}
            className={`flex items-center gap-1 transition-all duration-200 hover:scale-110 ${
              post.isLiked ? 'text-redbook' : 'text-gray-400'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${post.isLiked ? 'fill-redbook' : ''} ${
                showHeartAnimation ? 'animate-heart-beat' : ''
              }`}
            />
            <span className="text-xs">{post.likes}</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderShortCard = () => (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group ${
        isPressed ? 'scale-95' : 'hover:-translate-y-2'
      } animate-fade-in`}
      onClick={handleCardClick}
    >
      <LazyLoad height={150} offset={100}>
        {!imageError ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ height: '180px' }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">图片加载失败</span>
          </div>
        )}
      </LazyLoad>

      <div className="p-3">
        <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 mb-2">
          {post.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full ${avatarColor} flex items-center justify-center text-xs font-medium text-gray-600`}>
              {avatarText}
            </div>
            <span className="text-xs text-gray-500">{post.author}</span>
          </div>

          <button
            onClick={(e) => {
              handleLike(e)
              handleButtonClick(e)
            }}
            className={`flex items-center gap-1 transition-all duration-200 hover:scale-110 ${
              post.isLiked ? 'text-redbook' : 'text-gray-400'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-redbook' : ''}`}
            />
            <span className="text-xs">{post.likes}</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderWideCard = () => (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group ${
        isPressed ? 'scale-95' : 'hover:-translate-y-2'
      } animate-fade-in`}
      onClick={handleCardClick}
    >
      <LazyLoad height={250} offset={100}>
        {!imageError ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ height: '280px' }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">图片加载失败</span>
          </div>
        )}
      </LazyLoad>

      <div className="p-4">
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-redbook/10 text-redbook text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 mb-4">
          {post.title}
        </h3>

        <p className="text-xs text-gray-500 mb-4">
          生活中的美好瞬间，值得被记录和分享 ✨
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium text-gray-600`}>
              {avatarText}
            </div>
            <div>
              <div className="text-xs text-gray-700 font-medium">{post.author}</div>
              <div className="text-xs text-gray-400">生活方式分享者</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                handleLike(e)
                handleButtonClick(e)
              }}
              className={`flex items-center gap-1 transition-all duration-200 hover:scale-110 ${
                post.isLiked ? 'text-redbook' : 'text-gray-400'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${post.isLiked ? 'fill-redbook' : ''}`}
              />
              <span className="text-xs">{post.likes}</span>
            </button>
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            <Share className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderFullCard = () => (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group ${
        isPressed ? 'scale-95' : 'hover:-translate-y-2'
      } animate-fade-in`}
      onClick={handleCardClick}
    >
      <LazyLoad height={200} offset={100}>
        {!imageError ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">图片加载失败</span>
          </div>
        )}
      </LazyLoad>

      <div className="p-4">
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-redbook/10 text-redbook text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 mb-3">
          {post.title}
        </h3>

        <p className="text-xs text-gray-500 mb-4 line-clamp-3">
          今天分享一组超美的图片给大家～每一张都是用心拍摄，希望你们会喜欢！记得点赞收藏哦 💕
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium text-gray-600`}>
              {avatarText}
            </div>
            <div>
              <div className="text-xs text-gray-700 font-medium">{post.author}</div>
              <div className="text-xs text-gray-400">生活方式分享者</div>
            </div>
          </div>

          <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                handleLike(e)
                handleButtonClick(e)
              }}
              className={`flex items-center gap-1 transition-all duration-200 hover:scale-110 ${
                post.isLiked ? 'text-redbook' : 'text-gray-400'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${post.isLiked ? 'fill-redbook' : ''} ${
                  showHeartAnimation ? 'animate-heart-beat' : ''
                }`}
              />
              <span className="text-xs">{post.likes}</span>
            </button>
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            <Share className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400">2小时前</span>
        </div>
      </div>
    </div>
  )

  const renderCard = () => {
    // 暂时移除骨架屏，直接渲染卡片
    // if (isLoading) {
    //   return renderSkeletonCard(post.type)
    // }

    switch (post.type) {
      case 'tall':
        return renderTallCard()
      case 'short':
        return renderShortCard()
      case 'wide':
        return renderWideCard()
      case 'full':
        return renderFullCard()
      default:
        return renderStandardCard()
    }
  }

  return renderCard()
}

export default PostCard