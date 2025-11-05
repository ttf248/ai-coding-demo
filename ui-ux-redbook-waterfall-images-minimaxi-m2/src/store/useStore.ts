import { create } from 'zustand'

export interface PostItem {
  id: number
  title: string
  imageUrl: string
  author: string
  likes: number
  isLiked: boolean
}

interface AppState {
  posts: PostItem[]
  loading: boolean
  hasMore: boolean
  page: number
  searchQuery: string

  setPosts: (posts: PostItem[]) => void
  appendPosts: (posts: PostItem[]) => void
  setLoading: (loading: boolean) => void
  setHasMore: (hasMore: boolean) => void
  setPage: (page: number) => void
  setSearchQuery: (query: string) => void
  toggleLike: (id: number) => void
  refreshPosts: () => void
}

export const useStore = create<AppState>((set) => ({
  posts: [],
  loading: false,
  hasMore: true,
  page: 0,
  searchQuery: '',

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
}))
