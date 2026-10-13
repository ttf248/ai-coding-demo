import { create } from 'zustand';
import { makePosts, type Post } from './data';

const PAGE_SIZE = 20;
const SEED = 20261014;

interface AppState {
  query: string;
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  liked: Record<number, boolean>;
  extraLikes: Record<number, number>;
  setQuery: (q: string) => void;
  loadMore: () => void;
  refresh: () => void;
  toggleLike: (id: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  query: '',
  posts: makePosts(SEED, 0, PAGE_SIZE),
  loading: false,
  refreshing: false,
  liked: {},
  extraLikes: {},
  setQuery: (q) =>
    set(() => {
      const qq = q.trim();
      if (!qq) return { query: q, posts: makePosts(SEED, 0, PAGE_SIZE) };
      // 在较大数据集上检索（标题/作者/标签）
      const all = makePosts(SEED, 0, 120);
      const posts = all.filter(
        (p) => p.title.includes(qq) || p.author.includes(qq) || p.tags.some((t) => t.includes(qq)),
      );
      return { query: q, posts };
    }),
  loadMore: () => {
    const { loading, query } = get();
    if (loading || query.trim()) return;
    set({ loading: true });
    window.setTimeout(() => {
      set((s) => ({ posts: [...s.posts, ...makePosts(SEED, s.posts.length, PAGE_SIZE)], loading: false }));
    }, 600);
  },
  refresh: () => {
    const { refreshing, query } = get();
    if (refreshing) return;
    set({ refreshing: true });
    window.setTimeout(() => {
      set(() => {
        const qq = query.trim();
        const posts = qq
          ? makePosts(SEED, 0, 120).filter(
              (p) => p.title.includes(qq) || p.author.includes(qq) || p.tags.some((t) => t.includes(qq)),
            )
          : makePosts(SEED, 0, PAGE_SIZE);
        return { posts, refreshing: false, liked: {}, extraLikes: {} };
      });
    }, 800);
  },
  toggleLike: (id) =>
    set((s) => {
      const on = !s.liked[id];
      return {
        liked: { ...s.liked, [id]: on },
        extraLikes: { ...s.extraLikes, [id]: on ? 1 : 0 },
      };
    }),
}));
