import { create } from 'zustand';
import type { CategoryId, FeedStore, Post } from '../types';
import { POSTS } from '../data/posts';

const PAGE_SIZE = 20;
const NETWORK_DELAY_MS = 420;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function matchesQuery(post: Post, query: string): boolean {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    post.title.toLowerCase().includes(needle) ||
    post.authorName.toLowerCase().includes(needle) ||
    post.category.toLowerCase().includes(needle)
  );
}

function buildFilteredPosts(
  query: string,
  category: CategoryId,
): Post[] {
  let pool: Post[];
  if (query.trim()) {
    pool = POSTS.filter((post) => matchesQuery(post, query));
  } else {
    pool = [...POSTS];
  }
  if (category !== 'recommend') {
    pool = pool.filter((post) => post.category === category);
  }
  return pool;
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  posts: [],
  loading: false,
  refreshing: false,
  hasMore: true,
  searchKeyword: '',
  activeCategory: 'recommend',
  page: 0,
  detailPost: null,
  selectedPostIds: [],

  fetchPosts: async () => {
    if (get().posts.length > 0) return;
    set({ loading: true });
    await wait(NETWORK_DELAY_MS);
    const { searchKeyword, activeCategory } = get();
    const pool = buildFilteredPosts(searchKeyword, activeCategory);
    const firstPage = pool.slice(0, PAGE_SIZE);
    set({
      posts: firstPage,
      page: 1,
      hasMore: pool.length > firstPage.length,
      loading: false,
      selectedPostIds: firstPage.map((p) => p.id),
    });
  },

  loadMorePosts: async () => {
    const { loading, hasMore, page, posts, searchKeyword, activeCategory } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    await wait(NETWORK_DELAY_MS);
    const pool = buildFilteredPosts(searchKeyword, activeCategory);
    const start = page * PAGE_SIZE;
    const next = pool.slice(start, start + PAGE_SIZE);
    const combined = [...posts, ...next];
    set({
      posts: combined,
      page: page + 1,
      hasMore: start + next.length < pool.length,
      loading: false,
      selectedPostIds: combined.map((p) => p.id),
    });
  },

  toggleLike: (postId: string) => {
    set((state) => {
      const nextPosts = state.posts.map((post) => {
        if (post.id !== postId) return post;
        const liked = !post.isLiked;
        return {
          ...post,
          isLiked: liked,
          likes: Math.max(0, post.likes + (liked ? 1 : -1)),
        };
      });
      const updatedDetail =
        state.detailPost && state.detailPost.id === postId
          ? nextPosts.find((p) => p.id === postId) ?? state.detailPost
          : state.detailPost;
      return { posts: nextPosts, detailPost: updatedDetail };
    });
  },

  setSearchKeyword: (keyword: string) => {
    set({ searchKeyword: keyword });
  },

  setActiveCategory: (category: CategoryId) => {
    if (get().activeCategory === category) return;
    set({ activeCategory: category });
  },

  refreshPosts: async () => {
    set({ refreshing: true });
    await wait(NETWORK_DELAY_MS);
    const { searchKeyword, activeCategory } = get();
    const pool = buildFilteredPosts(searchKeyword, activeCategory);
    const firstPage = pool.slice(0, PAGE_SIZE);
    set({
      posts: firstPage,
      page: 1,
      hasMore: pool.length > firstPage.length,
      refreshing: false,
      selectedPostIds: firstPage.map((p) => p.id),
    });
  },

  openDetail: (postId: string) => {
    const post = get().posts.find((p) => p.id === postId) ?? null;
    set({ detailPost: post });
  },

  closeDetail: () => {
    set({ detailPost: null });
  },

  setSelectedPostIds: (ids: string[]) => {
    set({ selectedPostIds: ids });
  },
}));
