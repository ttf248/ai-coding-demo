import { create } from "zustand";
import { mockPage, type Note } from "./data";
type Store = {
  notes: Note[];
  page: number;
  loading: boolean;
  query: string;
  category: string;
  setQuery: (q: string) => void;
  setCategory: (c: string) => void;
  like: (id: string) => void;
  load: () => Promise<void>;
  refresh: () => Promise<void>;
  publish: (title: string, image: string) => void;
};
export const useNotes = create<Store>((set, get) => ({
  notes: mockPage(0),
  page: 0,
  loading: false,
  query: "",
  category: "推荐",
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  like: (id) =>
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id
          ? { ...n, liked: !n.liked, likes: n.likes + (n.liked ? -1 : 1) }
          : n,
      ),
    })),
  load: async () => {
    if (get().loading || get().page >= 5) return;
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 600));
    set((s) => ({
      notes: [...s.notes, ...mockPage(s.page + 1)],
      page: s.page + 1,
      loading: false,
    }));
  },
  refresh: async () => {
    if (get().loading) return;
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 650));
    set({ notes: mockPage(0), page: 0, loading: false });
  },
  publish: (title, image) =>
    set((s) => ({
      notes: [
        {
          id: crypto.randomUUID(),
          title,
          image,
          author: "我",
          likes: 0,
          liked: false,
          category: "生活",
        },
        ...s.notes,
      ],
    })),
}));
