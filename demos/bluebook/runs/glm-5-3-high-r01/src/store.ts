import { create } from "zustand";
import { makeNotes } from "./mock";
import type { Note } from "./types";

const PAGE_SIZE = 20;
const MAX_PAGES = 5;

interface FeedState {
  notes: Note[];
  page: number;
  loading: boolean;
  finished: boolean;
  liked: Record<string, boolean>;
  likeBumps: Record<string, number>;
  search: string;
  loadMore: () => void;
  refresh: () => void;
  toggleLike: (id: string) => void;
  setSearch: (q: string) => void;
}

function fetchPage(page: number): Promise<Note[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(makeNotes(page, PAGE_SIZE)), 600);
  });
}

export const useFeed = create<FeedState>((set, get) => ({
  notes: [],
  page: 0,
  loading: false,
  finished: false,
  liked: {},
  likeBumps: {},
  search: "",
  loadMore: async () => {
    const { page, loading, finished } = get();
    if (loading || finished) return;
    set({ loading: true });
    const next = page + 1;
    const batch = await fetchPage(next);
    set((s) => ({
      notes: [...s.notes, ...batch],
      page: next,
      loading: false,
      finished: next >= MAX_PAGES,
    }));
  },
  refresh: async () => {
    if (get().loading) return;
    set({ loading: true, finished: false, page: 0 });
    const batch = await fetchPage(1);
    set({ notes: batch, page: 1, loading: false, finished: 1 >= MAX_PAGES });
  },
  toggleLike: (id) =>
    set((s) => ({
      liked: { ...s.liked, [id]: !s.liked[id] },
      likeBumps: { ...s.likeBumps, [id]: (s.likeBumps[id] ?? 0) + 1 },
    })),
  setSearch: (q) => set({ search: q }),
}));
