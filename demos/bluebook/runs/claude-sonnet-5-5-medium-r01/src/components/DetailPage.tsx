import { useEffect } from 'react'
import type { Post } from '../types'
import { BackIcon } from './Icons'
import LikeButton from './LikeButton'
import PostImage from './PostImage'

interface DetailPageProps {
  post: Post
  onClose: () => void
}

/** 详情页：页面切换使用渐入效果 */
export default function DetailPage({ post, onClose }: DetailPageProps) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 animate-fade-in overflow-y-auto bg-white" data-testid="detail">
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-white/95 px-3 py-3 backdrop-blur" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <button type="button" onClick={onClose} aria-label="返回" className="rounded-full p-1.5 text-gray-700 active:bg-gray-100">
          <BackIcon />
        </button>
        <img src={post.avatar} alt="" className="h-8 w-8 rounded-full" />
        <span className="text-sm font-medium text-gray-800">{post.author}</span>
      </div>
      <div className="mx-auto max-w-xl pb-10">
        <PostImage src={post.image} alt={post.title} ratio={Math.min(post.ratio, 1.4)} lazy={false} />
        <div className="px-4 pt-4">
          <h2 className="text-lg font-bold leading-snug text-gray-900">{post.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{post.desc}</p>
          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            <LikeButton id={post.id} base={post.likes} size="lg" />
            <span className="text-xs text-gray-400">按 Esc 或点击左上角返回</span>
          </div>
        </div>
      </div>
    </div>
  )
}
