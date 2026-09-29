import { create } from "zustand";
import { loadInitial, loadMore, type Post } from "../data/mock";

type State = {
  posts: Post[];
  liked: Set<number>;
  loading: boolean;
  hasMore: boolean;
  query: string;
  loadInitial: () => void;
  loadMore: () => void;
  toggleLike: (id: number) => void;
  setQuery: (q: string) => void;
};

export const usePosts = create<State>((set, get) => ({
  posts: [],
  liked: new Set<number>(),
  loading: false,
  hasMore: true,
  query: "",
  loadInitial: () => {
    if (get().posts.length > 0) return;
    set({ posts: loadInitial(20), hasMore: true, loading: false });
  },
  loadMore: () => {
    const { posts, loading, hasMore } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    setTimeout(() => {
      const next = loadMore(posts.length, 10);
      const merged = [...posts, ...next];
      set({
        posts: merged,
        loading: false,
        hasMore: merged.length < 220,
      });
    }, 360);
  },
  toggleLike: (id) => {
    const liked = new Set(get().liked);
    if (liked.has(id)) liked.delete(id);
    else liked.add(id);
    set({ liked });
  },
  setQuery: (q) => set({ query: q }),
}));