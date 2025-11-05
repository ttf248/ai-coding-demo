import React, { useState } from 'react'
import { Heart, MessageCircle, Share, Bookmark, ArrowLeft } from 'lucide-react'
import { PostItem, useStore } from '../store/useStore'

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
  const [imageError, setImageError] = useState(false)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)

  const avatarColor = DEFAULT_AVATAR_COLORS[post.id % DEFAULT_AVATAR_COLORS.length]
  const avatarText = post.author.charAt(0)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(post.id)
    setShowHeartAnimation(true)
    setTimeout(() => setShowHeartAnimation(false), 600)
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
      } catch (err) {
        console.log('分享取消')
      }
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* 头部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">帖子详情</h1>
      </div>

      {/* 主内容 */}
      <div className="px-4 pb-6">
        {/* 图片区域 */}
        <div className="mt-4 mb-6">
          {!imageError ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">图片加载失败</span>
            </div>
          )}
        </div>

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-redbook/10 text-redbook text-sm rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 标题 */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 leading-relaxed">
          {post.title}
        </h2>

        {/* 描述 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            今天分享一组超美的图片给大家～每一张都是用心拍摄，希望你们会喜欢！
            这个世界上有太多美好的事物值得我们去记录和分享，每一个小瞬间都值得被珍藏。
            希望这些图片能带给你们一些温暖和快乐，记得点赞收藏哦 💕
          </p>
        </div>

        {/* 作者信息 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-lg font-bold text-gray-700`}
              >
                {avatarText}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{post.author}</div>
                <div className="text-sm text-gray-500">生活方式分享者</div>
                <div className="text-xs text-gray-400 mt-1">2小时前发布</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-redbook text-white rounded-full text-sm font-medium hover:bg-redbook/90 transition-colors">
              关注
            </button>
          </div>
        </div>

        {/* 互动数据 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{post.likes}</div>
            <div className="text-sm text-gray-500">点赞</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">128</div>
            <div className="text-sm text-gray-500">评论</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">56</div>
            <div className="text-sm text-gray-500">收藏</div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                post.isLiked
                  ? 'bg-redbook text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${post.isLiked ? 'fill-white' : ''} ${
                  showHeartAnimation ? 'animate-heart-beat' : ''
                }`}
              />
              <span className="font-medium">
                {post.isLiked ? '已点赞' : '点赞'}
              </span>
              <span className="text-sm opacity-75">({post.likes})</span>
            </button>

            <div className="flex items-center gap-4">
              <button className="flex flex-col items-center gap-1">
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-500">评论</span>
              </button>

              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1"
              >
                <Share className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-500">分享</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <Bookmark className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-500">收藏</span>
              </button>
            </div>
          </div>
        </div>

        {/* 底部占位符 */}
        <div className="h-24" />
      </div>
    </div>
  )
}

export default DetailView
