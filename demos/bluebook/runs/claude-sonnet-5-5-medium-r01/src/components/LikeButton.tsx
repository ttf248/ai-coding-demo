import type { MouseEvent } from 'react'
import { useFeedStore } from '../store/useFeedStore'
import { HeartIcon } from './Icons'

interface LikeButtonProps {
  id: string
  base: number
  size?: 'sm' | 'lg'
}

function formatCount(n: number) {
  return n >= 10000 ? `${(n / 10000).toFixed(1)}w` : String(n)
}

export default function LikeButton({ id, base, size = 'sm' }: LikeButtonProps) {
  const liked = useFeedStore((s) => !!s.liked[id])
  const toggle = useFeedStore((s) => s.toggleLike)
  const onClick = (e: MouseEvent) => {
    e.stopPropagation()
    toggle(id)
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={liked}
      aria-label={liked ? '取消点赞' : '点赞'}
      className={`flex items-center gap-1 ${size === 'lg' ? 'text-base' : 'text-xs'} ${liked ? 'text-brand' : 'text-gray-500'}`}
    >
      {/* key 变化会重新挂载图标，从而在点赞时重播“放大再缩小”动画 */}
      <span key={liked ? 'on' : 'off'} className={`inline-flex ${liked ? 'animate-heart-pop' : ''}`}>
        <HeartIcon filled={liked} className={size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} />
      </span>
      <span>{formatCount(base + (liked ? 1 : 0))}</span>
    </button>
  )
}
