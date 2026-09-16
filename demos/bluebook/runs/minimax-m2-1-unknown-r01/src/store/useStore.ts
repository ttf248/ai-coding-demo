import { create } from 'zustand'
import { Post } from '../types'
import { generateMockPosts } from '../data/mockData'

interface AppState {
  posts: Post[]
  page: number
  loading: boolean
  hasMore: boolean
  refreshing: boolean

  // Actions
  loadMore: () => void
  refresh: () => void
  toggleLike: (id: number) => void
  searchPosts: (keyword: string) => void
}

export const useStore = create<AppState>((set, get) => ({
  posts: [],
  page: 1,
  loading: false,
  hasMore: true,
  refreshing: false,

  loadMore: async () => {
    const { loading, hasMore, page } = get()
    if (loading || !hasMore) return

    set({ loading: true })

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    const nextPage = page + 1
    const newPosts = generateMockPosts(nextPage, 20)

    set(state => ({
      posts: [...state.posts, ...newPosts],
      page: nextPage,
      loading: false,
      // 假设最多加载5页
      hasMore: nextPage < 5,
    }))
  },

  refresh: async () => {
    const { refreshing } = get()
    if (refreshing) return

    set({ refreshing: true })

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newPosts = generateMockPosts(1, 20)

    set({
      posts: newPosts,
      page: 1,
      hasMore: true,
      refreshing: false,
    })
  },

  toggleLike: (id: number) => {
    set(state => ({
      posts: state.posts.map(post =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      ),
    }))
  },

  searchPosts: (keyword: string) => {
    if (!keyword.trim()) {
      // 如果搜索词为空，恢复初始数据
      const initialPosts = generateMockPosts(1, 20)
      set({ posts: initialPosts, page: 1, hasMore: true })
      return
    }

    // 过滤匹配的帖子
    const { posts: allPosts } = get()
    const filteredPosts = allPosts.filter(
      post =>
        post.title.toLowerCase().includes(keyword.toLowerCase()) ||
        post.author.name.toLowerCase().includes(keyword.toLowerCase())
    )

    set({ posts: filteredPosts, hasMore: false })
  },
}))
