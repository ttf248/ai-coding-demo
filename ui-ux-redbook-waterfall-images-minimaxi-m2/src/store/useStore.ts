import { create } from 'zustand'

export type PostType = 'standard' | 'tall' | 'short' | 'wide' | 'full'

export interface CommentItem {
  id: number
  postId: number
  author: string
  content: string
  likes: number
  createTime: string
  avatar?: string
}

export interface PostItem {
  id: number
  title: string
  imageUrl: string
  author: string
  likes: number
  isLiked: boolean
  type: PostType
  tags: string[]
  comments?: CommentItem[]
}

interface AppState {
  posts: PostItem[]
  loading: boolean
  hasMore: boolean
  page: number
  searchQuery: string
  currentView: 'list' | 'detail'
  selectedPost: PostItem | null

  setPosts: (posts: PostItem[]) => void
  appendPosts: (posts: PostItem[]) => void
  setLoading: (loading: boolean) => void
  setHasMore: (hasMore: boolean) => void
  setPage: (page: number) => void
  setSearchQuery: (query: string) => void
  toggleLike: (id: number) => void
  refreshPosts: () => void
  setCurrentView: (view: 'list' | 'detail') => void
  setSelectedPost: (post: PostItem | null) => void
}

export const useStore = create<AppState>((set, get) => ({
  posts: [],
  loading: false,
  hasMore: true,
  page: 0,
  searchQuery: '',
  currentView: 'list',
  selectedPost: null,

  setPosts: (posts) => set({ posts }),

  appendPosts: (newPosts) =>
    set((state) => ({ posts: [...state.posts, ...newPosts] })),

  setLoading: (loading) => set({ loading }),

  setHasMore: (hasMore) => set({ hasMore }),

  setPage: (page) => set({ page }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleLike: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      ),
    })),

  refreshPosts: () => set({ page: 0, posts: [], hasMore: true }),

  setCurrentView: (view) => set({ currentView: view }),

  setSelectedPost: (post) => set({ selectedPost: post }),

  // 计算属性：根据搜索查询过滤帖子
  getFilteredPosts: () => {
    const { posts, searchQuery } = get()
    if (!searchQuery.trim()) return posts

    const query = searchQuery.toLowerCase().trim()
    return posts.filter((post) => {
      // 匹配标题
      if (post.title.toLowerCase().includes(query)) return true
      // 匹配作者
      if (post.author.toLowerCase().includes(query)) return true
      // 匹配类型（standard/tall/short/wide/full）
      if (post.type.toLowerCase().includes(query)) return true
      // 匹配标签
      if (post.tags.some(tag => tag.toLowerCase().includes(query))) return true
      return false
    })
  },
}))
