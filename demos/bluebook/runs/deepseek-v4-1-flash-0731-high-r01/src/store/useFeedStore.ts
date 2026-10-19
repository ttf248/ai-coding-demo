import { create } from "zustand";
import { fetchNotes } from "../data/mock";
import type { FeedStatus, Note } from "../types";

interface FeedState {
  notes: Note[];
  page: number;
  status: FeedStatus;
  /** 已加载的页数上限，mock 数据循环取用 */
  hasMore: boolean;
  liked: Record<string, boolean>;
  likeBumps: Record<string, number>;
  error: string | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleLike: (id: string) => void;
}

const PAGE_SIZE = 20;
const MAX_PAGES = 6;

export const useFeedStore = create<FeedState>((set, get) => ({
  notes: [],
  page: 0,
  status: "idle",
  hasMore: true,
  liked: {},
  likeBumps: {},
  error: null,

  loadMore: async () => {
    const { status, page, hasMore } = get();
    if (status === "loading" || status === "refreshing" || !hasMore) return;
    set({ status: "loading", error: null });
    try {
      // 模拟网络延迟，让 loading 动画可见
      await new Promise((r) => setTimeout(r, 520));
      const next = page + 1;
      const chunk = fetchNotes(next);
      set((s) => ({
        notes: [...s.notes, ...chunk],
        page: next,
        status: "idle",
        hasMore: next < MAX_PAGES,
      }));
    } catch (e) {
      set({ status: "error", error: e instanceof Error ? e.message : "加载失败" });
    }
  },

  /** 下拉刷新：清空后重新拉第一页 */
  refresh: async () => {
    if (get().status === "refreshing") return;
    set({ status: "refreshing", error: null });
    try {
      await new Promise((r) => setTimeout(r, 760));
      set({
        notes: fetchNotes(1),
        page: 1,
        status: "idle",
        hasMore: true,
      });
    } catch (e) {
      set({ status: "error", error: e instanceof Error ? e.message : "刷新失败" });
    }
  },

  toggleLike: (id) => {
    set((s) => ({
      liked: { ...s.liked, [id]: !s.liked[id] },
      // 每次点击都自增，用于触发「放大再缩小」动画的重放
      likeBumps: { ...s.likeBumps, [id]: (s.likeBumps[id] ?? 0) + 1 },
    }));
  },
}));

export { PAGE_SIZE };
