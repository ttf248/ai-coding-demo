import { create } from 'zustand';
import { POSTS, type Post } from './data';

type Store = {
  posts: Post[]; page: number; query: string; category: string; following: boolean; loading: boolean; likes: Set<number>;
  setQuery: (query: string) => void; setCategory: (category: string) => void; setFollowing: (value: boolean) => void;
  toggleLike: (id: number) => void; loadMore: () => Promise<void>; refresh: () => void;
};

export const useFeed = create<Store>((set, get) => ({
  posts: POSTS.slice(0, 20), page: 1, query: '', category: '推荐', following: false, loading: false, likes: new Set(),
  setQuery: (query) => set({ query }), setCategory: (category) => set({ category }), setFollowing: (following) => set({ following }),
  toggleLike: (id) => set((state) => { const likes = new Set(state.likes); likes.has(id) ? likes.delete(id) : likes.add(id); return { likes }; }),
  loadMore: async () => { const { loading, page } = get(); if (loading || page * 20 >= POSTS.length) return; set({ loading: true }); await new Promise((resolve) => setTimeout(resolve, 650)); set({ posts: POSTS.slice(0, (page + 1) * 20), page: page + 1, loading: false }); },
  refresh: () => set({ posts: POSTS.slice(0, 20), page: 1, query: '', category: '推荐' }),
}));
