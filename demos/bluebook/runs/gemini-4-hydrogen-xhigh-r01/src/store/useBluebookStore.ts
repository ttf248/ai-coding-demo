import { create } from "zustand";
import { createMockBatch, NoteItem } from "../data/mockNotes";

interface BluebookState {
  notes: NoteItem[];
  nextOffset: number;
  searchQuery: string;
  activeCategory: string;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  selectedNoteId: string | null;
  isPublishOpen: boolean;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (cat: string) => void;
  toggleLike: (id: string) => void;
  loadMore: () => Promise<void>;
  refreshFeed: () => Promise<void>;
  openNote: (id: string | null) => void;
  setPublishOpen: (open: boolean) => void;
  addNote: (payload: {
    title: string;
    author: string;
    category: string;
    description: string;
    aspectRatio: number;
    imageUrl?: string;
  }) => void;
}

const INITIAL_COUNT = 20;
const PAGE_SIZE = 10;
const MAX_TOTAL = 80;

export const useBluebookStore = create<BluebookState>((set, get) => ({
  notes: createMockBatch(0, INITIAL_COUNT),
  nextOffset: INITIAL_COUNT,
  searchQuery: "",
  activeCategory: "推荐",
  isLoadingMore: false,
  isRefreshing: false,
  hasMore: true,
  selectedNoteId: null,
  isPublishOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),

  toggleLike: (id) =>
    set((state) => ({
      notes: state.notes.map((item) =>
        item.id === id
          ? {
              ...item,
              liked: !item.liked,
              likes: item.liked ? Math.max(0, item.likes - 1) : item.likes + 1,
            }
          : item
      ),
    })),

  loadMore: async () => {
    const { isLoadingMore, hasMore, nextOffset } = get();
    if (isLoadingMore || !hasMore) return;
    set({ isLoadingMore: true });
    await new Promise((r) => setTimeout(r, 420));
    const batch = createMockBatch(nextOffset, PAGE_SIZE);
    const updatedOffset = nextOffset + batch.length;
    set((state) => ({
      notes: [...state.notes, ...batch],
      nextOffset: updatedOffset,
      isLoadingMore: false,
      hasMore: updatedOffset < MAX_TOTAL,
    }));
  },

  refreshFeed: async () => {
    if (get().isRefreshing) return;
    set({ isRefreshing: true });
    await new Promise((r) => setTimeout(r, 480));
    const freshSeed = Math.floor(Math.random() * 40) + 100;
    const freshTop = createMockBatch(freshSeed, 4).map((item, idx) => ({
      ...item,
      id: `refresh-${Date.now()}-${idx}`,
      title: `【刚刚更新】${item.title}`,
    }));
    set((state) => ({
      notes: [...freshTop, ...state.notes],
      isRefreshing: false,
    }));
  },

  openNote: (selectedNoteId) => set({ selectedNoteId }),
  setPublishOpen: (isPublishOpen) => set({ isPublishOpen }),

  addNote: ({ title, author, category, description, aspectRatio, imageUrl }) => {
    const customBatch = createMockBatch(Math.floor(Math.random() * 20), 1)[0];
    const newNote: NoteItem = {
      ...customBatch,
      id: `custom-${Date.now()}`,
      title: title.trim() || "我的生活新灵感",
      author: author.trim() || "我",
      category,
      aspectRatio,
      imageUrl: imageUrl?.trim() || customBatch.imageUrl,
      description: description.trim() || title.trim(),
      likes: 1,
      liked: true,
      tags: [category, "原创发布"],
    };
    set((state) => ({
      notes: [newNote, ...state.notes],
      isPublishOpen: false,
    }));
  },
}));
