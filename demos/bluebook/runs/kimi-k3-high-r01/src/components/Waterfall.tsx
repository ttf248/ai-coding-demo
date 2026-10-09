import { useEffect, useMemo, useRef, useState } from 'react'
import { useNoteStore } from '../store'
import NoteCard from './NoteCard'

function useColumnCount() {
  const get = () => {
    const w = window.innerWidth
    if (w >= 1024) return 4 // 桌面端四列
    if (w >= 640) return 3  // 平板三列
    return 2                // 移动端两列
  }
  const [cols, setCols] = useState(get)
  useEffect(() => {
    const onResize = () => setCols(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return cols
}

export default function Waterfall() {
  const { notes, loading, keyword, loadMore } = useNoteStore()
  const cols = useColumnCount()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(170)

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const gap = 12
        const w = (containerRef.current.clientWidth - gap * (cols - 1)) / cols
        setCardWidth(Math.max(80, w))
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [cols])

  const filtered = useMemo(() => {
    const kw = keyword.trim()
    if (!kw) return notes
    return notes.filter((n) => n.title.includes(kw) || n.author.includes(kw))
  }, [notes, keyword])

  // 瀑布流：贪心放入当前最短列（按图片估算高度）
  const columns = useMemo(() => {
    const heights = new Array(cols).fill(0)
    const buckets: typeof filtered[] = Array.from({ length: cols }, () => [])
    for (const note of filtered) {
      let shortest = 0
      for (let i = 1; i < cols; i++) if (heights[i] < heights[shortest]) shortest = i
      buckets[shortest].push(note)
      heights[shortest] += (note.height / note.width) * cardWidth + 96
    }
    return buckets
  }, [filtered, cols, cardWidth])

  // 滚动到底部自动加载更多
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const ob = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore()
    }, { rootMargin: '300px' })
    ob.observe(el)
    return () => ob.disconnect()
  }, [loadMore])

  return (
    <div ref={containerRef} className="mx-auto max-w-6xl px-3 pt-3">
      <div className="flex items-start gap-3">
        {columns.map((bucket, i) => (
          <div key={i} className="flex-1 min-w-0">
            {bucket.map((note) => (
              <NoteCard key={note.id} note={note} cardWidth={cardWidth} />
            ))}
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className="flex h-16 items-center justify-center">
        {loading ? (
          <span className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="loading-spinner h-4 w-4 text-brand" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="42" strokeDashoffset="14" strokeLinecap="round" />
            </svg>
            正在加载更多…
          </span>
        ) : (
          <span className="text-xs text-gray-300">下拉刷新 · 上滑加载更多</span>
        )}
      </div>
    </div>
  )
}
