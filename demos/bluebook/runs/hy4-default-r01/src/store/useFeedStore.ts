import { create } from "zustand";
import { MOCK_NOTES } from "../data/mockNotes";
import type { Note } from "../types";

export const PAGE_SIZE = 20;

interface FeedState {
  notes: Note[];
  page: number;
  loading: boolean;
  refreshing: boolean;
  keyword: string;
  liked: Record<number, boolean>;
  toast: string | null;
  version: number;
  loadMore: () => void;
  refresh: () => void;
  setKeyword: (value: string) => void;
  toggleLike: (id: number) => void;
  publish: () => void;
  clearToast: () => void;
}

const take = (page: number) => MOCK_NOTES.slice(0, Math.min(page * PAGE_SIZE, MOCK_NOTES.length));
let timer: ReturnType<typeof setTimeout> | null = null;

export const useFeedStore = create<FeedState>((set, get) => ({
  notes: take(1),
  page: 1,
  loading: false,
  refreshing: false,
  keyword: "",
  liked: {},
  toast: null,
  version: 0,

  loadMore: () => {
    const { page, loading, keyword } = get();
    if (loading || keyword.trim() || page >= Math.ceil(MOCK_NOTES.length / PAGE_SIZE)) return;
    set({ loading: true });
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const next = get().page + 1;
      set({ notes: take(next), page: next, loading: false });
    }, 480);
  },

  refresh: () => {
    if (get().refreshing) return;
    set({ refreshing: true, loading: true });
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      set((s) => ({
        notes: take(1),
        page: 1,
        refreshing: false,
        loading: false,
        keyword: "",
        version: s.version + 1,
      }));
    }, 620);
  },

  setKeyword: (keyword) => set({ keyword }),
  toggleLike: (id) => set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),
  publish: () => set({ toast: "发布入口已就绪：本原型仅展示前端交互，未接入后端。" }),
  clearToast: () => set({ toast: null }),
}));
