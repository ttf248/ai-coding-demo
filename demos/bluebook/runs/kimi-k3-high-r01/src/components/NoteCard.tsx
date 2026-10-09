import { useState } from 'react'
import LazyLoad from 'react-lazyload'
import { useNoteStore } from '../store'
import type { Note } from '../mock'

function formatLikes(n: number) {
  return n >= 10000 ? (n / 10000).toFixed(1) + 'w' : String(n)
}

export default function NoteCard({ note, cardWidth }: { note: Note; cardWidth: number }) {
  const toggleLike = useNoteStore((s) => s.toggleLike)
  const [imgError, setImgError] = useState(false)
  const [popping, setPopping] = useState(false)
  const imgHeight = Math.round((cardWidth * note.height) / note.width)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(note.id)
    setPopping(true)
    setTimeout(() => setPopping(false), 420)
  }

  return (
    <article className="card-press break-inside-avoid mb-3 cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm">
      <LazyLoad height={imgHeight} offset={120} once>
        {imgError ? (
          <div
            className="flex w-full flex-col items-center justify-center gap-1 bg-gray-100 text-gray-400"
            style={{ height: imgHeight }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-4.5-4.5L6 21" />
            </svg>
            <span className="text-xs">图片加载失败</span>
          </div>
        ) : (
          <img
            src={note.image}
            alt={note.title}
            width={note.width}
            height={note.height}
            onError={() => setImgError(true)}
            className="w-full object-cover"
            style={{ height: imgHeight }}
            loading="lazy"
          />
        )}
      </LazyLoad>
      <div className="px-2.5 py-2">
        <p className="line-clamp-2 text-sm font-medium leading-5 text-gray-800">{note.title}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: note.avatarColor }}
            >
              {note.author[0]}
            </span>
            <span className="truncate text-xs text-gray-500">{note.author}</span>
          </div>
          <button
            onClick={handleLike}
            aria-label="点赞"
            className="flex shrink-0 items-center gap-1 text-xs text-gray-500"
          >
            <svg
              className={`h-4 w-4 ${popping ? 'like-pop' : ''}`}
              viewBox="0 0 24 24"
              fill={note.liked ? '#fe2c55' : 'none'}
              stroke={note.liked ? '#fe2c55' : 'currentColor'}
              strokeWidth="2"
            >
              <path d="M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 17.5 4c-1.8 0-3.4 1-4.2 2.4C12.4 5 10.8 4 9 4.5 7.2 4.9 6 6.5 6 8.5c0 2.3 1.5 4 3 5.5l4.5 4.5L19 14Z" />
            </svg>
            <span className={note.liked ? 'text-brand font-semibold' : ''}>{formatLikes(note.likes)}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
