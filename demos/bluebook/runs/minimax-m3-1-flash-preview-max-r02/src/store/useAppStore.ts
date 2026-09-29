import { create } from "zustand";
import { ALL_NOTES, PAGE_SIZE, type Note } from "../data/notes";

export type LoadStatus = "idle" | "loading" | "done";

interface AppState {
  keyword: string;
  query: string;
  notes: Note[];
  page: number;
  status: LoadStatus;
  refreshing: boolean;
  likedIds: string[];
  setKeyword: (value: string) => void;
  commitSearch: (value: string) => void;
  fetchPage: () => void;
  pullRefresh: () => void;
  toggleLike: (id: string) => void;
}

function filtered(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_NOTES;
  return ALL_NOTES.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.author.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

function firstPage(query: string) {
  return filtered(query).slice(0, PAGE_SIZE);
}

export const useAppStore = create<AppState>((set, get) => ({
  keyword: "",
  query: "",
  notes: firstPage(""),
  page: 1,
  status: "idle",
  refreshing: false,
  likedIds: [],

  setKeyword: (keyword) => set({ keyword }),

  commitSearch: (keyword) =>
    set({
      keyword,
      query: keyword.trim(),
      page: 1,
      notes: firstPage(keyword),
      status: "idle",
    }),

  fetchPage: () => {
    const { query, page, status, refreshing } = get();
    if (status === "loading" || refreshing) return;
    const matched = filtered(query);
    const start = page * PAGE_SIZE;
    if (start >= matched.length) {
      set({ status: "done" });
      return;
    }
    set({ status: "loading" });
    window.setTimeout(() => {
      set({
        notes: [...get().notes, ...matched.slice(start, start + PAGE_SIZE)],
        page: page + 1,
        status: "idle",
      });
    }, 620);
  },

  pullRefresh: () => {
    if (get().refreshing) return;
    set({ refreshing: true });
    window.setTimeout(() => {
      set({
        notes: firstPage(get().query),
        page: 1,
        status: "idle",
        refreshing: false,
        likedIds: [],
      });
    }, 950);
  },

  toggleLike: (id) =>
    set((state) => ({
      likedIds: state.likedIds.includes(id)
        ? state.likedIds.filter((v) => v !== id)
        : [...state.likedIds, id],
    })),
}));
