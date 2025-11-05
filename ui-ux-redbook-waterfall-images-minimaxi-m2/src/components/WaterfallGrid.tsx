import React, { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { loadPosts } from '../data/mockData'
import PostCard from './PostCard'
import LoadingSpinner from './LoadingSpinner'

const WaterfallGrid: React.FC = () => {
  const { posts, loading, hasMore, setLoading, appendPosts, setHasMore, page, setPage } = useStore()
  const loaderRef = useRef<HTMLDivElement>(null)

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
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {loading && <LoadingSpinner />}

      {!hasMore && posts.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          没有更多内容了
        </div>
      )}

      <div ref={loaderRef} />
    </div>
  )
}

export default WaterfallGrid
