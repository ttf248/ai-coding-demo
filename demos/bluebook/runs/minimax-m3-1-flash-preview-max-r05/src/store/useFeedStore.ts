import { create } from "zustand";
import { buildPage, TOTAL_ITEMS } from "../mock/data";
import type { Note } from "../types";

interface FeedState {
  notes: Note[];
  liked: Record<string, boolean>;
  page: number;
  status: "idle" | "loading" | "refreshing" | "done";
  hasMore: boolean;
  toggleLike: (id: string) => void;
  loadMore: () => void;
  refresh: () => void;
}

export const PAGE_SIZE = 20;

export const useFeedStore = create<FeedState>((set, get) => ({
  notes: [],
  liked: {},
  page: 0,
  status: "idle",
  hasMore: true,

  toggleLike: (id) =>
    set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),

  loadMore: () => {
    const { status, page, hasMore, notes } = get();
    if (status === "loading" || !hasMore) return;
    set({ status: "loading" });
    // 模拟网络请求，保证首屏与滚动加载都有真实的加载态
    window.setTimeout(() => {
      const next = buildPage(page);
      set({
        notes: notes.concat(next),
        page: page + 1,
        status: "idle",
        hasMore: notes.length + next.length < TOTAL_ITEMS,
      });
    }, 520);
  },

  refresh: () => {
    const { status } = get();
    if (status === "refreshing") return;
    set({ status: "refreshing" });
    window.setTimeout(() => {
      // 换一批数据：随机打乱首屏顺序，模拟下拉刷新的新内容
      const first = buildPage(0).map((n) => ({ ...n, id: `${n.id}-${Date.now()}` })).sort(() => Math.random() - 0.5);
      set({ notes: first, page: 1, status: "idle", hasMore: true });
    }, 700);
  },
}));
