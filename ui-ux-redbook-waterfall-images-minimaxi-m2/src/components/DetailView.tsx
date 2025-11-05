import React, { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share, Bookmark, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { PostItem, useStore } from '../store/useStore'
import SkeletonLoader from './SkeletonLoader'
import Toast, { ToastType } from './Toast'
import { useToast } from '../hooks/useToast'

interface DetailViewProps {
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

const DetailView: React.FC<DetailViewProps> = ({ post }) => {
  const { toggleLike, setCurrentView } = useStore()
  const { toast, showToast, hideToast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({})

  const avatarColor = DEFAULT_AVATAR_COLORS[post.id % DEFAULT_AVATAR_COLORS.length]
  const avatarText = post.author.charAt(0)

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      } else if (e.key === 'Escape') {
        handleBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentImageIndex, post.images.length])

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(post.id)
    setShowHeartAnimation(true)
    setTimeout(() => setShowHeartAnimation(false), 600)
    showToast(post.isLiked ? '已取消点赞' : '点赞成功！', 'success')
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    const button = e.currentTarget as HTMLElement
    button.classList.add('animate-button-press')
    setTimeout(() => {
      button.classList.remove('animate-button-press')
    }, 200)
  }

  const handleBack = () => {
    setCurrentView('list')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `查看 "${post.title}" - by ${post.author}`,
          url: window.location.href,
        })
        showToast('分享成功！', 'success')
      } catch (err) {
        console.log('分享取消')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast('链接已复制到剪贴板！', 'success')
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    showToast(isBookmarked ? '已取消收藏' : '收藏成功！', 'success')
  }

  const handlePrevImage = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : post.images.length - 1))
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handleNextImage = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentImageIndex((prev) => (prev < post.images.length - 1 ? prev + 1 : 0))
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handleImageSelect = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return
    setIsTransitioning(true)
    setCurrentImageIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handleImageLoad = (index: number) => {
    setImageLoadingStates(prev => ({ ...prev, [index]: false }))
  }

  const handleImageLoadStart = (index: number) => {
    setImageLoadingStates(prev => ({ ...prev, [index]: true }))
  }

  const commentCount = post.comments?.length || 0

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Toast 通知 */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* 头部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
        <button
          onClick={handleBack}
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold">帖子详情</h1>
      </div>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 pb-20 sm:pb-24">
        {/* 图片区域 - 图集展示 */}
        <div className="mb-3 sm:mb-4">
          {post.images && post.images.length > 0 && (
            <div className="relative">
              {/* 主图片 */}
              <div className="relative bg-white rounded-lg overflow-hidden group shadow-sm">
                {imageLoadingStates[currentImageIndex] !== false && (
                  <div
                    className="w-full flex items-center justify-center"
                    style={{
                      maxHeight: 'calc(100vh - 400px)',
                      minHeight: '400px'
                    }}
                  >
                    <SkeletonLoader
                      rounded
                      width="100%"
                      height="100%"
                      className="!bg-gray-200"
                    />
                  </div>
                )}
                <img
                  src={post.images[currentImageIndex]}
                  alt={`${post.title} - ${currentImageIndex + 1}`}
                  className={`w-full h-auto object-contain transition-opacity duration-300 ${
                    isTransitioning ? 'opacity-50' : 'opacity-100'
                  } ${imageLoadingStates[currentImageIndex] !== false ? 'absolute inset-0' : ''}`}
                  style={{
                    maxHeight: 'calc(100vh - 400px)',
                    minHeight: '400px'
                  }}
                  onLoadStart={() => handleImageLoadStart(currentImageIndex)}
                  onLoad={() => handleImageLoad(currentImageIndex)}
                />

                {/* 上一张/下一张按钮 */}
                {post.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      disabled={isTransitioning}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      disabled={isTransitioning}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* 图片计数器 */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {post.images.length}
                </div>

                {/* 图片指示器 */}
                {post.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {post.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        disabled={isTransitioning}
                        className={`transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'w-8 h-2 bg-white rounded-full'
                            : 'w-2 h-2 bg-white/60 hover:bg-white/80 rounded-full'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 缩略图列表 */}
              {post.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 px-1">
                  {post.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      disabled={isTransitioning}
                      className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        index === currentImageIndex
                          ? 'border-redbook shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {imageLoadingStates[index] !== false ? (
                        <SkeletonLoader
                          rounded
                          width="100%"
                          height="100%"
                          className="!bg-gray-200"
                        />
                      ) : (
                        <img
                          src={image}
                          alt={`缩略图 ${index + 1}`}
                          className="w-full h-full object-cover"
                          onLoadStart={() => handleImageLoadStart(index)}
                          onLoad={() => handleImageLoad(index)}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-redbook/10 text-redbook text-xs sm:text-sm rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 标题 */}
        <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 leading-relaxed">
          {post.title}
        </h2>

        {/* 描述 */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            今天分享一组超美的图片给大家～每一张都是用心拍摄，希望你们会喜欢！
            这个世界上有太多美好的事物值得我们去记录和分享，每一个小瞬间都值得被珍藏。
            希望这些图片能带给你们一些温暖和快乐，记得点赞收藏哦 💕
          </p>
        </div>

        {/* 作者信息 */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${avatarColor} flex items-center justify-center text-sm sm:text-lg font-bold text-gray-700`}
              >
                {avatarText}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base">{post.author}</div>
                <div className="text-xs sm:text-sm text-gray-500">生活方式分享者</div>
                <div className="text-xs text-gray-400 mt-0.5">2小时前发布</div>
              </div>
            </div>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-redbook text-white rounded-full text-xs sm:text-sm font-medium hover:bg-redbook/90 transition-colors">
              关注
            </button>
          </div>
        </div>

        {/* 互动数据 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-800">{post.likes}</div>
            <div className="text-xs sm:text-sm text-gray-500">点赞</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-800">{commentCount}</div>
            <div className="text-xs sm:text-sm text-gray-500">评论</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-800">{post.images.length}</div>
            <div className="text-xs sm:text-sm text-gray-500">图片</div>
          </div>
        </div>

        {/* 评论列表 */}
        {post.comments && post.comments.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              评论 ({commentCount})
            </h3>
            <div className="space-y-3">
              {post.comments.slice(0, 5).map((comment) => {
                const commentAvatarColor = DEFAULT_AVATAR_COLORS[comment.id % DEFAULT_AVATAR_COLORS.length]
                const commentAvatarText = comment.author.charAt(0)

                return (
                  <div key={comment.id} className="bg-white border border-gray-100 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${commentAvatarColor} flex items-center justify-center text-xs sm:text-sm font-medium text-gray-700 flex-shrink-0`}
                      >
                        {commentAvatarText}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-400">{comment.createTime}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">{comment.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-gray-400 hover:text-redbook transition-colors">
                            <Heart className="w-3.5 h-3.5" />
                            <span className="text-xs">{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {post.comments.length > 5 && (
              <button className="w-full mt-3 py-2 text-center text-sm text-redbook hover:bg-redbook/5 rounded-lg transition-colors">
                查看更多评论
              </button>
            )}
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={(e) => {
              handleLike(e)
              handleButtonClick(e)
            }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all hover:scale-105 ${
              post.isLiked
                ? 'bg-redbook text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                post.isLiked ? 'fill-white' : ''
              } ${
                showHeartAnimation ? 'animate-heart-beat' : ''
              }`}
            />
            <span className="text-xs sm:text-sm font-medium">
              {post.isLiked ? '已点赞' : '点赞'}
            </span>
            <span className="text-xs opacity-75">({post.likes})</span>
          </button>

          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => {}}
              className="flex flex-col items-center gap-1"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              <span className="text-xs text-gray-500">评论</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1"
            >
              <Share className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              <span className="text-xs text-gray-500">分享</span>
            </button>

            <button
              onClick={handleBookmark}
              className="flex flex-col items-center gap-1"
            >
              <Bookmark
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isBookmarked ? 'fill-redbook text-redbook' : 'text-gray-700'
                }`}
              />
              <span className="text-xs text-gray-500">收藏</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailView
