import { create } from "zustand";
import { makeBatch, type NoteItem } from "./mock";

const PAGE_SIZE = 20;
const MAX_PAGES = 6;

export type LoadStatus = "idle" | "loading" | "refreshing" | "error";

interface AppState {
  items: NoteItem[];
  page: number;
  status: LoadStatus;
  hasMore: boolean;
  liked: Record<string, boolean>;
  query: string;
  /** 首次加载 / 下拉刷新 */
  bootstrap: () => Promise<void>;
  /** 滚动到底加载更多 */
  loadMore: () => Promise<void>;
  toggleLike: (id: string) => void;
  setQuery: (q: string) => void;
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const useStore = create<AppState>((set, get) => ({
  items: [],
  page: 0,
  status: "idle",
  hasMore: true,
  liked: {},
  query: "",

  bootstrap: async () => {
    if (get().status === "loading" || get().status === "refreshing") return;
    set({ status: "refreshing" });
    await wait(600);
    set({
      items: makeBatch(0, PAGE_SIZE),
      page: 0,
      hasMore: true,
      status: "idle",
      liked: {},
    });
  },

  loadMore: async () => {
    const { status, hasMore, page } = get();
    if (status !== "idle" || !hasMore) return;
    set({ status: "loading" });
    await wait(700);
    const next = page + 1;
    set({
      items: [...get().items, ...makeBatch(next, PAGE_SIZE)],
      page: next,
      hasMore: next < MAX_PAGES - 1,
      status: "idle",
    });
  },

  toggleLike: (id) =>
    set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),

  setQuery: (q) => set({ query: q }),
}));
