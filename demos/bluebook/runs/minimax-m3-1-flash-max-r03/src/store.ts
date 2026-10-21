import { create } from "zustand";
import { createNotes, PAGE_SIZE, TOTAL } from "./data";
import type { Note } from "./data";

interface FeedState {
  notes: Note[];
  visible: number;
  loading: boolean;
  refreshing: boolean;
  query: string;
  loadMore: () => void;
  refresh: () => void;
  toggleLike: (id: number) => void;
  setQuery: (query: string) => void;
  finishLoading: () => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useFeedStore = create<FeedState>((set, get) => ({
  notes: createNotes(PAGE_SIZE),
  visible: PAGE_SIZE,
  loading: false,
  refreshing: false,
  query: "",
  loadMore: () => {
    const { visible, loading, notes } = get();
    if (loading || visible >= TOTAL) return;
    set({ loading: true });
    void sleep(520).then(() => {
      const next = visible + PAGE_SIZE;
      set({
        notes: [...notes, ...createNotes(Math.min(PAGE_SIZE, TOTAL - visible), visible)],
        visible: next,
        loading: false,
      });
    });
  },
  refresh: () => {
    if (get().refreshing) return;
    set({ refreshing: true });
    void sleep(700).then(() => {
      set({
        notes: createNotes(PAGE_SIZE),
        visible: PAGE_SIZE,
        refreshing: false,
      });
    });
  },
  toggleLike: (id) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              liked: !note.liked,
              likes: note.liked ? note.likes - 1 : note.likes + 1,
            }
          : note,
      ),
    })),
  setQuery: (query) => set({ query }),
  finishLoading: () => set({ loading: false }),
}));

/** 按标题 / 作者 / 标签过滤，搜索框与筛选条共用 */
export function selectFilteredNotes(state: FeedState): Note[] {
  const keyword = state.query.trim().toLowerCase();
  if (!keyword) return state.notes;
  return state.notes.filter(
    (note) =>
      note.title.toLowerCase().includes(keyword) ||
      note.author.toLowerCase().includes(keyword) ||
      note.tag.toLowerCase().includes(keyword),
  );
}
