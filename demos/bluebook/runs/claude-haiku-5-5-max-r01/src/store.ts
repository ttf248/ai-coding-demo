import { create } from "zustand";
import { fetchNotes } from "./mock";
import type { Note } from "./types";

export const PAGE_SIZE = 20;
const MAX_PAGES = 6;

type FeedState = {
  items: Note[];
  liked: Record<string, boolean>;
  loading: boolean;
  hasMore: boolean;
  page: number;
  seed: number;
  query: string;
  setQuery: (query: string) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleLike: (id: string) => void;
};

export const useFeed = create<FeedState>()((set, get) => ({
  items: [],
  liked: {},
  loading: false,
  hasMore: true,
  page: 0,
  seed: 0,
  query: "",
  setQuery: (query) => set({ query }),
  loadMore: async () => {
    const { loading, hasMore, page, seed } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    const next = await fetchNotes(seed, page, PAGE_SIZE);
    set((s) => ({
      items: [...s.items, ...next],
      page: s.page + 1,
      loading: false,
      hasMore: s.page + 1 < MAX_PAGES,
    }));
  },
  refresh: async () => {
    if (get().loading) return;
    set({ loading: true });
    const seed = get().seed + 1;
    const next = await fetchNotes(seed, 0, PAGE_SIZE);
    set({ items: next, seed, page: 1, loading: false, hasMore: true });
  },
  toggleLike: (id) => set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),
}));
