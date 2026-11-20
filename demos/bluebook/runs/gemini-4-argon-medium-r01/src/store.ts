import { create } from 'zustand';
import { PostItem, generateMockPosts, createArtworkDataUrl } from './mockData';

interface BlueBookState {
  posts: PostItem[];
  searchQuery: string;
  activeCategory: string;
  page: number;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  forceBrokenMode: boolean;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (cat: string) => void;
  toggleLike: (id: string) => void;
  loadMore: () => void;
  refreshFeed: () => void;
  toggleBrokenMode: () => void;
  publishPost: (title: string, category: string, authorName: string) => void;
}

export const useBlueBookStore = create<BlueBookState>((set, get) => ({
  // 首次加载 20 条数据
  posts: generateMockPosts(1, 20),
  searchQuery: '',
  activeCategory: 'all',
  page: 1,
  isLoadingMore: false,
  isRefreshing: false,
  forceBrokenMode: false,

  setSearchQuery: (q) => set({ searchQuery: q }),

  setActiveCategory: (cat) => set({ activeCategory: cat }),

  toggleLike: (id) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1
            }
          : p
      )
    })),

  loadMore: () => {
    const { isLoadingMore, page, posts } = get();
    if (isLoadingMore) return;
    set({ isLoadingMore: true });
    setTimeout(() => {
      const nextPage = page + 1;
      const more = generateMockPosts(nextPage, 12);
      set({
        posts: [...posts, ...more],
        page: nextPage,
        isLoadingMore: false
      });
    }, 550);
  },

  refreshFeed: () => {
    if (get().isRefreshing) return;
    set({ isRefreshing: true });
    setTimeout(() => {
      const fresh = generateMockPosts(1, 20).map((item, idx) => ({
        ...item,
        id: `fresh_${Date.now()}_${idx}`,
        likes: item.likes + Math.floor(Math.random() * 50)
      }));
      set({
        posts: fresh,
        page: 1,
        isRefreshing: false
      });
    }, 600);
  },

  toggleBrokenMode: () =>
    set((state) => ({
      forceBrokenMode: !state.forceBrokenMode
    })),

  publishPost: (title, category, authorName) =>
    set((state) => {
      const seed = state.posts.length + 101;
      const newPost: PostItem = {
        id: `custom_${Date.now()}`,
        title,
        category: category || 'travel',
        imageUrl: createArtworkDataUrl(seed, 400, 500, title.slice(0, 8), '新发布灵感笔记'),
        aspectRatio: 500 / 400,
        authorName: authorName || '小蓝书创作者',
        authorInitial: (authorName || '蓝').slice(0, 1),
        authorColor: '#fe2c55',
        likes: 1,
        liked: true
      };
      return {
        posts: [newPost, ...state.posts]
      };
    })
}));
