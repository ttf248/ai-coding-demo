import { create } from "zustand";
import { generateMockBatch } from "../data/mockNotes";
import type { NoteCategory, NoteItem } from "../types/note";

interface FeedState {
  notes: NoteItem[];
  page: number;
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  searchQuery: string;
  activeCategory: NoteCategory;
  selectedNoteId: string | null;
  publishOpen: boolean;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (cat: NoteCategory) => void;
  toggleLike: (id: string) => void;
  loadMore: () => Promise<void>;
  refreshFeed: () => Promise<void>;
  openNote: (id: string | null) => void;
  setPublishOpen: (open: boolean) => void;
  publishNote: (payload: {
    title: string;
    content: string;
    category: Exclude<NoteCategory, "推荐">;
    imageUrl: string;
  }) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  notes: generateMockBatch(1, 20), // Initial 20 items
  page: 1,
  loading: false,
  refreshing: false,
  hasMore: true,
  searchQuery: "",
  activeCategory: "推荐",
  selectedNoteId: null,
  publishOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),

  toggleLike: (id) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id
          ? { ...n, liked: !n.liked, likes: n.liked ? n.likes - 1 : n.likes + 1 }
          : n,
      ),
    })),

  loadMore: async () => {
    const { loading, hasMore, page } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 420));
    const nextPage = page + 1;
    const more = generateMockBatch(nextPage, 12);
    set((state) => ({
      notes: [...state.notes, ...more],
      page: nextPage,
      loading: false,
      hasMore: nextPage < 6,
    }));
  },

  refreshFeed: async () => {
    if (get().refreshing) return;
    set({ refreshing: true });
    await new Promise((r) => setTimeout(r, 480));
    // Re-shuffle fresh top batch with unique IDs
    const seedPage = Math.floor(Math.random() * 5) + 2;
    const fresh = generateMockBatch(seedPage, 20).map((item, idx) => ({
      ...item,
      id: `refresh-${Date.now()}-${idx}`,
      createdAt: "刚刚更新",
    }));
    set({
      notes: fresh,
      page: 1,
      hasMore: true,
      refreshing: false,
    });
  },

  openNote: (selectedNoteId) => set({ selectedNoteId }),
  setPublishOpen: (publishOpen) => set({ publishOpen }),

  publishNote: ({ title, content, category, imageUrl }) => {
    const created: NoteItem = {
      id: `user-${Date.now()}`,
      title: title.trim() || "记录今天的闪光瞬间",
      content: content.trim() || "分享此刻的小蓝书灵感笔记。",
      category,
      imageUrl,
      aspectRatio: 1.22,
      author: {
        name: "我",
        initial: "我",
        avatarBg: "#fe2c55",
      },
      likes: 1,
      liked: true,
      tags: [category, "新发布"],
      createdAt: "刚刚",
    };
    set((state) => ({
      notes: [created, ...state.notes],
      publishOpen: false,
      activeCategory: "推荐",
    }));
  },
}));
