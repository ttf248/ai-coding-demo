import { useEffect, useState, useRef, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { Card } from './Card'
import { Loading } from './Loading'
import { Post } from '../types'

export const Waterfall = () => {
  const { posts, loading, hasMore, loadMore, refresh } = useStore()
  const [columnCount, setColumnCount] = useState(2)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ y: number; isAtTop: boolean } | null>(null)

  // 响应式列数
  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth
      if (width >= 1024) {
        setColumnCount(4)
      } else if (width >= 768) {
        setColumnCount(3)
      } else {
        setColumnCount(2)
      }
    }

    updateColumnCount()
    window.addEventListener('resize', updateColumnCount)
    return () => window.removeEventListener('resize', updateColumnCount)
  }, [])

  // 计算列高度分配
  const columns = useMemo(() => {
    if (posts.length === 0) return []

    const cols: Post[][] = Array.from({ length: columnCount }, () => [])
    const colHeights: number[] = Array(columnCount).fill(0)

    posts.forEach((post) => {
      // 找到最短的列
      const minHeightIndex = colHeights.indexOf(Math.min(...colHeights))
      cols[minHeightIndex].push(post)
      // 估算高度：图片高度 + 内容高度(约60px)
      colHeights[minHeightIndex] += (post.imageHeight || 220) + 60
    })

    return cols
  }, [posts, columnCount])

  // 无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  // 下拉刷新
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartRef.current = {
          y: e.touches[0].pageY,
          isAtTop: true,
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || !touchStartRef.current.isAtTop) return

      const currentY = e.touches[0].pageY
      const diff = currentY - touchStartRef.current.y

      if (diff > 80 && !isRefreshing && !loading) {
        setIsRefreshing(true)
        refresh()
        // 模拟刷新完成
        setTimeout(() => {
          setIsRefreshing(false)
          touchStartRef.current = null
        }, 1000)
      }
    }

    const handleTouchEnd = () => {
      touchStartRef.current = null
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true })
      container.addEventListener('touchmove', handleTouchMove, { passive: true })
      container.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchmove', handleTouchMove)
        container.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isRefreshing, loading, refresh])

  // 初始加载
  useEffect(() => {
    if (posts.length === 0) {
      refresh()
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50">
      {/* 下拉刷新指示器 */}
      {(isRefreshing || posts.length === 0) && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none">
          {isRefreshing && <Loading />}
        </div>
      )}

      {/* 瀑布流网格 */}
      <div
        className="grid gap-3 px-3 py-3 page-enter"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((columnPosts, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-3">
            {columnPosts.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      <div ref={loadMoreRef} className="py-6">
        {loading && <Loading />}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-gray-400 text-sm">— 没有更多了 —</p>
        )}
      </div>
    </div>
  )
}
