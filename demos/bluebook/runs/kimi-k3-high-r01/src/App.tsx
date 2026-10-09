import { useEffect, useRef, useState } from 'react'
import SearchHeader from './components/SearchHeader'
import Waterfall from './components/Waterfall'
import { useNoteStore } from './store'

const REFRESH_THRESHOLD = 72

export default function App() {
  const refreshing = useNoteStore((s) => s.refreshing)
  const refresh = useNoteStore((s) => s.refresh)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef<number | null>(null)

  // 下拉刷新：仅在页面滚动到顶部时生效（触摸端）
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (window.scrollY <= 0) startY.current = e.touches[0].clientY
    }
    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return
      const dy = e.touches[0].clientY - startY.current
      if (dy > 0 && window.scrollY <= 0) {
        setPullDistance(Math.min(dy * 0.5, REFRESH_THRESHOLD * 1.6))
        if (dy * 0.5 > 8) e.preventDefault()
      }
    }
    const onEnd = () => {
      if (startY.current === null) return
      if (pullDistance >= REFRESH_THRESHOLD) refresh()
      startY.current = null
      setPullDistance(0)
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [pullDistance, refresh])

  return (
    <div className="page-enter min-h-screen bg-page">
      {/* 下拉刷新指示条 */}
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex justify-center transition-transform"
        style={{ transform: `translateY(${refreshing ? 40 : pullDistance - 32}px)` }}
      >
        <div className="mt-2 flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs text-gray-500 shadow-md">
          {refreshing ? (
            <>
              <svg className="loading-spinner h-3.5 w-3.5 text-brand" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="42" strokeDashoffset="14" strokeLinecap="round" />
              </svg>
              正在刷新…
            </>
          ) : (
            <span className="refresh-hint">{pullDistance >= REFRESH_THRESHOLD ? '松手刷新' : '下拉刷新'}</span>
          )}
        </div>
      </div>

      <SearchHeader />
      <Waterfall />

      <footer className="pb-8 pt-2 text-center text-xs text-gray-300">
        小蓝书 · 瀑布流社区 Demo（React 18 + TypeScript + Tailwind + Zustand）
      </footer>
    </div>
  )
}
