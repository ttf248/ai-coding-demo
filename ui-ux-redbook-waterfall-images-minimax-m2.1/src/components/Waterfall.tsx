import { useEffect, useState, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { Card } from './Card'
import { Loading } from './Loading'
import { Post, Column } from '../types'

export const Waterfall = () => {
  const { posts, loading, hasMore, loadMore, refreshing, refresh } = useStore()
  const [columns, setColumns] = useState<Column[]>([])
  const [columnCount, setColumnCount] = useState(2)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // 分配帖子到列
  const distributePosts = useCallback((postsToDistribute: Post[], currentColumns: Column[], count: number): Column[] => {
    if (postsToDistribute.length === 0) return currentColumns

    const newColumns: Column[] = currentColumns.length === count
      ? currentColumns
      : Array.from({ length: count }, () => ({ posts: [], height: 0 }))

    postsToDistribute.forEach((post, index) => {
      // 找到最短的列
      let minHeight = Infinity
      let minIndex = 0
      newColumns.forEach((col, i) => {
        if (col.height < minHeight) {
          minHeight = col.height
          minIndex = i
        }
      })

      // 添加到最短的列
      newColumns[minIndex] = {
        posts: [...newColumns[minIndex].posts, post],
        height: minHeight + 200, // 估算高度
      }
    })

    return newColumns
  }, [])

  // 初始化和更新列
  useEffect(() => {
    if (posts.length === 0) {
      setColumns(Array.from({ length: columnCount }, () => ({ posts: [], height: 0 })))
    } else {
      setColumns(prev => distributePosts(posts, prev, columnCount))
    }
  }, [posts, columnCount, distributePosts])

  // 无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  // 下拉刷新
  useEffect(() => {
    let startY = 0
    let isRefreshing = false

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].pageY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].pageY
      if (currentY - startY > 100 && !isRefreshing && window.scrollY === 0) {
        isRefreshing = true
        refresh()
        setTimeout(() => { isRefreshing = false }, 1000)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('touchstart', handleTouchStart)
      container.addEventListener('touchmove', handleTouchMove)
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchmove', handleTouchMove)
      }
    }
  }, [refresh])

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-100">
      {/* 下拉刷新指示器 */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
          <Loading />
        </div>
      )}

      {/* 瀑布流网格 */}
      <div className="grid gap-3 px-3 py-3 page-enter" style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}>
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-3">
            {column.posts.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      <div ref={loadMoreRef} className="py-4">
        {loading && <Loading />}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-gray-400 text-sm">没有更多了</p>
        )}
      </div>
    </div>
  )
}
