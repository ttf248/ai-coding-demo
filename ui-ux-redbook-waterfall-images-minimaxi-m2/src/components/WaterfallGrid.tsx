import React, { useEffect, useRef } from 'react'
import Masonry from 'react-masonry-css'
import { Search } from 'lucide-react'
import { useStore } from '../store/useStore'
import { loadPosts } from '../data/mockData'
import PostCard from './PostCard'
import LoadingSpinner from './LoadingSpinner'

const WaterfallGrid: React.FC = () => {
  const { posts, loading, hasMore, searchQuery, setLoading, appendPosts, setHasMore, page, setPage } = useStore()
  const loaderRef = useRef<HTMLDivElement>(null)

  // 根据搜索查询过滤帖子
  const filteredPosts = React.useMemo(() => {
    if (!searchQuery.trim()) return posts

    const query = searchQuery.toLowerCase().trim()
    return posts.filter((post) => {
      // 匹配标题
      if (post.title.toLowerCase().includes(query)) return true
      // 匹配作者
      if (post.author.toLowerCase().includes(query)) return true
      // 匹配类型（standard/tall/short/wide/full）
      if (post.type.toLowerCase().includes(query)) return true
      return false
    })
  }, [posts, searchQuery])

  // 响应式断点配置
  const breakpointColumnsObj = {
    default: 4,  // 默认4列
    1280: 4,     // 大屏幕4列
    1024: 3,     // 平板3列
    768: 2,      // 手机横屏2列
    640: 2       // 手机竖屏2列
  }

  useEffect(() => {
    loadInitialPosts()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && !loading && hasMore) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loading, hasMore, page])

  const loadInitialPosts = async () => {
    setLoading(true)
    try {
      const newPosts = await loadPosts(0)
      appendPosts(newPosts)
      setHasMore(newPosts.length === 20)
      setPage(1)
    } finally {
      setLoading(false)
    }
  }

  const loadMorePosts = async () => {
    setLoading(true)
    try {
      const newPosts = await loadPosts(page)
      appendPosts(newPosts)
      setHasMore(newPosts.length === 20)
      setPage(page + 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      {/* 搜索结果提示 */}
      {searchQuery && (
        <div className="mb-4 px-2">
          <p className="text-sm text-gray-600">
            搜索 "<span className="font-semibold text-redbook">{searchQuery}</span>" 找到 {filteredPosts.length} 个结果
          </p>
        </div>
      )}

      {/* 空状态 */}
      {searchQuery && filteredPosts.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          </div>
          <p className="text-gray-500 mb-2">未找到相关内容</p>
          <p className="text-sm text-gray-400">试试其他关键词吧</p>
        </div>
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-3"
        columnClassName="pl-3 bg-clip-padding"
      >
        {filteredPosts.map((post) => (
          <div key={post.id} className="mb-3">
            <PostCard post={post} />
          </div>
        ))}
      </Masonry>

      {loading && <LoadingSpinner />}

      {!hasMore && posts.length > 0 && !searchQuery && (
        <div className="text-center text-gray-500 py-8">
          没有更多内容了
        </div>
      )}

      <div ref={loaderRef} />
    </div>
  )
}

export default WaterfallGrid
