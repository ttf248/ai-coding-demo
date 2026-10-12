import { create } from 'zustand'
import type { Post } from '../types'
import { makePosts } from '../lib/mock'

const FIRST_PAGE = 20
const PAGE_SIZE = 12
const MAX_PAGES = 12
const DELAY = 700

interface FeedState {
  items: Post[]
  page: number
  salt: number
  loading: boolean
  refreshing: boolean
  hasMore: boolean
  query: string
  liked: Record<string, boolean>
  selected: Post | null
  init: () => void
  loadMore: () => void
  refresh: () => Promise<void>
  setQuery: (q: string) => void
  toggleLike: (id: string) => void
  select: (p: Post | null) => void
}

export const useFeedStore = create<FeedState>((set, get) => ({
  items: [],
  page: 0,
  salt: 0,
  loading: false,
  refreshing: false,
  hasMore: true,
  query: '',
  liked: {},
  selected: null,

  init: () => {
    if (get().items.length > 0) return
    set({ items: makePosts(0, FIRST_PAGE, get().salt), page: 1 })
  },

  loadMore: () => {
    const { loading, refreshing, hasMore, page, salt } = get()
    if (loading || refreshing || !hasMore) return
    set({ loading: true })
    window.setTimeout(() => {
      const next = makePosts(page, PAGE_SIZE, salt)
      set((s) => ({
        items: [...s.items, ...next],
        page: s.page + 1,
        loading: false,
        hasMore: s.page + 1 < MAX_PAGES,
      }))
    }, DELAY)
  },

  refresh: () =>
    new Promise<void>((resolve) => {
      if (get().refreshing) return resolve()
      set({ refreshing: true })
      window.setTimeout(() => {
        const salt = get().salt + 1
        set({ salt, items: makePosts(0, FIRST_PAGE, salt), page: 1, hasMore: true, refreshing: false, liked: {} })
        resolve()
      }, DELAY)
    }),

  setQuery: (query) => set({ query }),

  toggleLike: (id) => set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),

  select: (selected) => set({ selected }),
}))
