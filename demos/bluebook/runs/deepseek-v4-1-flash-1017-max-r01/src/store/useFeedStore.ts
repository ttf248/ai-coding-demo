import { create } from "zustand";
import type { Post } from "../types";
import { ALL_POSTS, makePost } from "../data/mock";

const PAGE_SIZE = 20;
const BATCH_SIZE = 12;

interface FeedState {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  query: string;
  liked: Record<string, boolean>;
  likes: Record<string, number>;
  setQuery: (query: string) => void;
  loadMore: () => void;
  refresh: () => Promise<void>;
  toggleLike: (id: string) => void;
  publish: (title: string, body?: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: ALL_POSTS.slice(0, PAGE_SIZE),
  loading: false,
  refreshing: false,
  hasMore: ALL_POSTS.length > PAGE_SIZE,
  query: "",
  liked: {},
  likes: {},
  setQuery: (query) => set({ query }),
  loadMore: () => {
    const { loading, hasMore, posts } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    window.setTimeout(() => {
      const next = ALL_POSTS.slice(posts.length, posts.length + BATCH_SIZE);
      set((state) => ({
        posts: [...state.posts, ...next],
        loading: false,
        hasMore: state.posts.length + next.length < ALL_POSTS.length,
      }));
    }, 520);
  },
  refresh: async () => {
    if (get().refreshing) return;
    set({ refreshing: true });
    await new Promise((resolve) => window.setTimeout(resolve, 720));
    set({ posts: ALL_POSTS.slice(0, PAGE_SIZE), hasMore: true, refreshing: false });
  },
  toggleLike: (id) =>
    set((state) => {
      const nextLiked = !state.liked[id];
      const base =
        state.likes[id] ??
        state.posts.find((post) => post.id === id)?.likes ??
        0;
      return {
        liked: { ...state.liked, [id]: nextLiked },
        likes: { ...state.likes, [id]: base + (nextLiked ? 1 : -1) },
      };
    }),
  publish: (title, body) =>
    set((state) => ({
      posts: [makePost(title, state.posts.length + 1, body), ...state.posts],
    })),
}));

export function usePostLikes(post: Post) {
  const liked = useFeedStore((state) => Boolean(state.liked[post.id]));
  const likes = useFeedStore((state) => state.likes[post.id] ?? post.likes);
  return { liked, likes };
}
