import { create } from 'zustand';
import { postSeeds } from '../data/posts';
import type { Category, Post } from '../types';

const INITIAL_COUNT = 20;
const PAGE_SIZE = 8;

function createPosts(offset: number, count: number, epoch: number): Post[] {
  return Array.from({ length: count }, (_, index) => {
    const absoluteIndex = offset + index;
    const seed = postSeeds[(absoluteIndex + epoch * 3) % postSeeds.length];
    const repeats = Math.floor(absoluteIndex / postSeeds.length);
    return {
      ...seed,
      id: `${epoch}-${absoluteIndex}`,
      likes: seed.likes + repeats * 7,
      liked: false,
    };
  });
}

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

interface FeedState {
  posts: Post[];
  query: string;
  activeCategory: Category;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  nextOffset: number;
  epoch: number;
  setQuery: (query: string) => void;
  setActiveCategory: (category: Category) => void;
  toggleLike: (id: string) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: createPosts(0, INITIAL_COUNT, 0),
  query: '',
  activeCategory: '推荐',
  isLoadingMore: false,
  isRefreshing: false,
  nextOffset: INITIAL_COUNT,
  epoch: 0,

  setQuery: (query) => set({ query }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),

  toggleLike: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
          : post,
      ),
    })),

  loadMore: async () => {
    const current = get();
    if (current.isLoadingMore || current.isRefreshing) return;

    const requestEpoch = current.epoch;
    const offset = current.nextOffset;
    set({ isLoadingMore: true });
    await wait(680);

    const latest = get();
    if (latest.epoch !== requestEpoch || latest.isRefreshing) return;

    const additions = createPosts(offset, PAGE_SIZE, requestEpoch);
    set({
      posts: [...latest.posts, ...additions],
      nextOffset: offset + additions.length,
      isLoadingMore: false,
    });
  },

  refresh: async () => {
    const current = get();
    if (current.isRefreshing) return;

    const nextEpoch = current.epoch + 1;
    set({ epoch: nextEpoch, isRefreshing: true, isLoadingMore: false });
    await wait(760);
    set({
      posts: createPosts(0, INITIAL_COUNT, nextEpoch),
      nextOffset: INITIAL_COUNT,
      isRefreshing: false,
    });
  },
}));
