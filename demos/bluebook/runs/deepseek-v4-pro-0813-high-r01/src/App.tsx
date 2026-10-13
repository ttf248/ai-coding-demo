import { useEffect, useRef, useState } from 'react'
import SearchBar from './components/SearchBar'
import Card from './components/Card'
import Loading from './components/Loading'
import { useStore } from './store'

export default function App() {
  const items = useStore((s) => s.items)
  const loading = useStore((s) => s.loading)
  const refreshing = useStore((s) => s.refreshing)
  const hasMore = useStore((s) => s.hasMore)
  const loadMore = useStore((s) => s.loadMore)
  const refresh = useStore((s) => s.refresh)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const [pull, setPull] = useState(0)
  const touchStartY = useRef<number | null>(null)

  // 首次加载
  useEffect(() => {
    if (items.length === 0) loadMore()
  }, [])

  // 滚动到底部自动加载更多
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore()
    }, { rootMargin: '200px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [loadMore])

  // 下拉刷新
  const onTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) touchStartY.current = e.touches[0].clientY
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || window.scrollY > 0) return
    const delta = e.touches[0].clientY - touchStartY.current
    if (delta > 0) setPull(Math.min(delta, 90))
  }
  const onTouchEnd = async () => {
    if (touchStartY.current !== null && pull > 60) {
      await refresh()
    }
    touchStartY.current = null
    setPull(0)
  }

  return (
    <div
      className="min-h-screen"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <SearchBar />

      {/* 下拉刷新指示 */}
      <div style={{ height: pull }} className="flex items-center justify-center overflow-hidden text-xs text-gray-400">
        {refreshing ? (
          <span className="flex items-center gap-2"><span className="spinner" style={{ width: 18, height: 18 }} />正在刷新…</span>
        ) : pull > 60 ? (
          '松开刷新'
        ) : (
          pull > 0 && '下拉刷新'
        )}
      </div>

      <main className="mx-auto max-w-5xl px-2 pt-2">
        <div className="columns-2 gap-2 md:columns-3 lg:columns-4">
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>

        {loading && <Loading />}
        {!loading && !hasMore && (
          <div className="py-8 text-center text-xs text-gray-400">已经到底啦 ~</div>
        )}
        <div ref={sentinelRef} className="h-1" />
      </main>
    </div>
  )
}
