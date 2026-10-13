import { create } from 'zustand';
import { Post, mockPosts } from './mock';
interface State {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  toggleLike: (id: number) => void;
  loadMore: () => void;
  refresh: () => void;
}
let nextId = 0;
export const useStore = create<State>((set, get) => ({
  posts: mockPosts(0, 20),
  loading: false,
  refreshing: false,
  toggleLike: (id) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p,
      ),
    })),
  loadMore: () => {
    if (get().loading) return;
    set({ loading: true });
    setTimeout(() => {
      nextId = get().posts.length;
      set((s) => ({ posts: [...s.posts, ...mockPosts(nextId, 12)], loading: false }));
    }, 700);
  },
  refresh: () => {
    set({ refreshing: true });
    setTimeout(() => {
      set({ posts: mockPosts(0, 20), refreshing: false });
      nextId = 20;
    }, 900);
  },
}));
// init nextId
nextId = 20;
