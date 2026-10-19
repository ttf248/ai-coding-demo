import { create } from "zustand";
import { createMockNotes, Note, PAGE_SIZE, resetMockCursor } from "../data/mock";

interface AppState {
  notes: Note[];
  page: number;
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  query: string;
  liked: Record<string, boolean>;
  likeBurst: Record<string, number>;
  publishOpen: boolean;
  loadMore: () => void;
  refresh: () => void;
  setQuery: (q: string) => void;
  toggleLike: (id: string) => void;
  setPublishOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  notes: [],
  page: 0,
  loading: false,
  refreshing: false,
  hasMore: true,
  query: "",
  liked: {},
  likeBurst: {},
  publishOpen: false,

  loadMore: () => {
    const { loading, hasMore, page } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    // 模拟网络请求延迟
    window.setTimeout(() => {
      const next = createMockNotes(page * PAGE_SIZE, PAGE_SIZE);
      set((state) => ({
        notes: [...state.notes, ...next],
        page: state.page + 1,
        loading: false,
        hasMore: state.notes.length + next.length < 120,
      }));
    }, 420);
  },

  refresh: () => {
    if (get().refreshing) return;
    set({ refreshing: true, loading: false });
    window.setTimeout(() => {
      resetMockCursor();
      const first = createMockNotes(0, PAGE_SIZE);
      set({
        notes: first,
        page: 1,
        refreshing: false,
        hasMore: true,
        liked: {},
      });
    }, 700);
  },

  setQuery: (query) => set({ query }),

  toggleLike: (id) =>
    set((state) => ({
      liked: { ...state.liked, [id]: !state.liked[id] },
      likeBurst: { ...state.likeBurst, [id]: (state.likeBurst[id] ?? 0) + 1 },
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, likes: note.likes + (state.liked[id] ? -1 : 1) }
          : note,
      ),
    })),

  setPublishOpen: (publishOpen) => set({ publishOpen }),
}));

export const selectVisibleNotes = (state: AppState): Note[] => {
  const q = state.query.trim();
  if (!q) return state.notes;
  return state.notes.filter(
    (note) =>
      note.title.includes(q) ||
      note.author.includes(q) ||
      note.tags.some((tag) => tag.includes(q)),
  );
};
