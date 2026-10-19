import { create } from "zustand";
import { makePublishedNote, NOTES, type Note } from "./data";

export const INITIAL_COUNT = 20;
export const PAGE_SIZE = 10;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface NotesState {
  all: Note[];
  visibleCount: number;
  loading: boolean;
  query: string;
  liked: Record<string, boolean>;
  refreshCount: number;
  setQuery: (query: string) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleLike: (id: string) => void;
  publish: (title: string, body: string) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  all: NOTES,
  visibleCount: INITIAL_COUNT,
  loading: false,
  query: "",
  liked: {},
  refreshCount: 0,

  setQuery: (query) => set({ query, visibleCount: INITIAL_COUNT }),

  loadMore: async () => {
    const { loading, visibleCount, all } = get();
    if (loading || visibleCount >= all.length) return;
    set({ loading: true });
    await sleep(620);
    set((state) => ({
      visibleCount: Math.min(state.all.length, state.visibleCount + PAGE_SIZE),
      loading: false
    }));
  },

  refresh: async () => {
    if (get().loading) return;
    set({ loading: true });
    await sleep(760);
    set((state) => ({
      visibleCount: INITIAL_COUNT,
      loading: false,
      refreshCount: state.refreshCount + 1
    }));
  },

  toggleLike: (id) =>
    set((state) => {
      const liked = { ...state.liked };
      if (liked[id]) delete liked[id];
      else liked[id] = true;
      return { liked };
    }),

  publish: (title, body) =>
    set((state) => {
      const note = makePublishedNote(title, body);
      return {
        all: [note, ...state.all],
        visibleCount: state.visibleCount + 1
      };
    })
}));
