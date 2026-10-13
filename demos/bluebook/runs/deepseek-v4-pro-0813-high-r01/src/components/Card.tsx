import { useState } from 'react'
import LazyLoad from 'react-lazyload'
import { useStore } from '../store'
import type { FeedItem } from '../mock'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? '#fe2c55' : 'none'}
      stroke={filled ? '#fe2c55' : 'currentColor'}
      strokeWidth="1.8"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

export default function Card({ item }: { item: FeedItem }) {
  const liked = useStore((s) => !!s.liked[item.id])
  const toggleLike = useStore((s) => s.toggleLike)
  const [err, setErr] = useState(false)
  const [pop, setPop] = useState(false)

  const onLike = () => {
    toggleLike(item.id)
    setPop(true)
    setTimeout(() => setPop(false), 320)
  }

  return (
    <div className="fade-in mb-2 break-inside-avoid overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]">
      <LazyLoad height={item.height} offset={300} once>
        {err ? (
          <div
            className="flex items-center justify-center bg-gray-100 text-xs text-gray-400"
            style={{ height: item.height }}
          >
            图片加载失败
          </div>
        ) : (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            style={{ height: item.height }}
            className="w-full object-cover"
            onError={() => setErr(true)}
          />
        )}
      </LazyLoad>
      <div className="p-2">
        <p className="line-clamp-2 text-sm leading-5 text-gray-800">{item.title}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img src={item.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
            <span className="text-xs text-gray-500">{item.author}</span>
          </div>
          <button onClick={onLike} className="flex items-center gap-1 text-gray-500">
            <span className={pop ? 'heart-pop' : ''}>
              <HeartIcon filled={liked} />
            </span>
            <span className="text-xs">{item.likes + (liked ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
