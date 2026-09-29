import { create } from "zustand";
import { ALL_NOTES, PAGE_SIZE, type Note } from "../data/notes";

interface AppState {
  keyword: string;
  /** 提交搜索后生效的查询词，用于触发列表渐入 */
  query: string;
  notes: Note[];
  page: number;
  status: "idle" | "loading" | "refreshing" | "done";
  liked: Record<string, boolean>;
  refreshing: boolean;
  setKeyword: (value: string) => void;
  submitSearch: (value?: string) => void;
  loadMore: () => void;
  refresh: () => void;
  toggleLike: (id: string) => void;
}

const match = (note: Note, query: string) => {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    note.title.toLowerCase().includes(q) ||
    note.author.toLowerCase().includes(q) ||
    note.tags.some((t) => t.toLowerCase().includes(q))
  );
};

const firstPage = (query: string) =>
  ALL_NOTES.filter((n) => match(n, query)).slice(0, PAGE_SIZE);

export const useAppStore = create<AppState>((set, get) => ({
  keyword: "",
  query: "",
  notes: firstPage(""),
  page: 1,
  status: "idle",
  liked: {},
  refreshing: false,

  setKeyword: (value) => set({ keyword: value }),

  submitSearch: (value) => {
    const query = (value ?? get().keyword).trim();
    set({
      query,
      keyword: value ?? get().keyword,
      page: 1,
      notes: firstPage(query),
      status: "idle",
    });
  },

  loadMore: () => {
    const { query, page, status } = get();
    if (status === "loading" || status === "refreshing") return;
    const matched = ALL_NOTES.filter((n) => match(n, query));
    const next = page * PAGE_SIZE;
    if (next >= matched.length) {
      set({ status: "done" });
      return;
    }
    set({ status: "loading" });
    window.setTimeout(() => {
      const slice = matched.slice(next, next + PAGE_SIZE);
      set((s) => ({
        notes: [...s.notes, ...slice],
        page: page + 1,
        status: "idle",
      }));
    }, 600);
  },

  refresh: () => {
    if (get().refreshing) return;
    set({ refreshing: true, status: "refreshing" });
    window.setTimeout(() => {
      const { query } = get();
      set({
        notes: firstPage(query),
        page: 1,
        refreshing: false,
        status: "idle",
        liked: {},
      });
    }, 900);
  },

  toggleLike: (id) =>
    set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),
}));

export const totalMatched = (query: string) =>
  ALL_NOTES.filter((n) => match(n, query)).length;
