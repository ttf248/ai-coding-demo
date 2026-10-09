import { create } from 'zustand'
import { generateNotes, type Note } from './mock'

interface NoteState {
  notes: Note[]
  loading: boolean
  refreshing: boolean
  keyword: string
  loadMore: () => void
  refresh: () => void
  toggleLike: (id: number) => void
  setKeyword: (kw: string) => void
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: generateNotes(20, 0), // 首次加载 20 条
  loading: false,
  refreshing: false,
  keyword: '',
  loadMore: () => {
    const { loading, notes } = get()
    if (loading) return
    set({ loading: true })
    // 模拟网络请求
    setTimeout(() => {
      set({
        notes: [...get().notes, ...generateNotes(20, notes.length)],
        loading: false,
      })
    }, 600)
  },
  refresh: () => {
    set({ refreshing: true })
    setTimeout(() => {
      set({ notes: generateNotes(20, 0), refreshing: false })
    }, 800)
  },
  toggleLike: (id) => {
    set({
      notes: get().notes.map((n) =>
        n.id === id
          ? { ...n, liked: !n.liked, likes: n.likes + (n.liked ? -1 : 1) }
          : n,
      ),
    })
  },
  setKeyword: (kw) => set({ keyword: kw }),
}))
