import { create } from 'zustand'
import { collection, type Note } from './data'
type Feed = {
  notes: Note[], liked: Record<string, boolean>, query: string, category: string, limit: number,
  setFilter: (category: string, query: string) => void, more: () => void, refresh: () => void,
  toggle: (id: string) => void, publish: (note: Note) => void
}
export const useFeed = create<Feed>((set) => ({
  notes: collection, liked: {}, query: '', category: '推荐', limit: 20,
  setFilter: (category,query) => set({ category, query, limit: 20 }),
  more: () => set(s => ({ limit: s.limit + 20 })),
  refresh: () => set(s => ({ notes: [...s.notes.slice(7), ...s.notes.slice(0,7)], limit: 20 })),
  toggle: (id) => set(s => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),
  publish: (note) => set(s => ({ notes: [note, ...s.notes], category: '推荐', query: '', limit: 20 }))
}))
