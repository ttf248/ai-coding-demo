import { create } from 'zustand'
import { genItems, type FeedItem } from './mock'

interface FeedState {
  items: FeedItem[]
  loading: boolean
  refreshing: boolean
  hasMore: boolean
  page: number
  liked: Record<number, boolean>
  loadMore: () => void
  refresh: () => Promise<void>
  toggleLike: (id: number) => void
}

export const useStore = create<FeedState>((set, get) => ({
  items: [],
  loading: false,
  refreshing: false,
  hasMore: true,
  page: 0,
  liked: {},
  loadMore: () => {
    const { loading, hasMore, page } = get()
    if (loading || !hasMore) return
    set({ loading: true })
    setTimeout(() => {
      const next = page + 1
      set((s) => ({
        items: [...s.items, ...genItems(page * 20, 20)],
        page: next,
        hasMore: next < 5,
        loading: false,
      }))
    }, 600)
  },
  refresh: () =>
    new Promise<void>((resolve) => {
      set({ refreshing: true })
      setTimeout(() => {
        set({
          items: genItems(0, 20),
          page: 1,
          hasMore: true,
          refreshing: false,
        })
        resolve()
      }, 900)
    }),
  toggleLike: (id) =>
    set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),
}))
