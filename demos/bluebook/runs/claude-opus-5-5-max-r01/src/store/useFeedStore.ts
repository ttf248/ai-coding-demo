import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Author, CategoryId, ImageMeta, Note, NoteCategory } from '../types';
import { fetchNotes, findMockNote, matchesQuery } from '../mock/api';

type LoadStatus = 'idle' | 'loading' | 'refreshing' | 'error';
type LoadMode = 'first' | 'more' | 'refresh';

export interface PublishInput {
  title: string;
  desc: string;
  image: ImageMeta;
  category: NoteCategory;
}

interface FeedState {
  category: CategoryId;
  query: string;
  seed: number;
  items: Note[];
  page: number;
  hasMore: boolean;
  total: number;
  status: LoadStatus;
  initialLoading: boolean;
  error: string | null;
  liked: Record<string, true>;
  published: Note[];
  toast: { id: number; text: string } | null;
  loadFirstPage: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setCategory: (category: CategoryId) => void;
  setQuery: (query: string) => void;
  toggleLike: (id: string) => void;
  publish: (input: PublishInput) => Note;
  showToast: (text: string) => void;
  getNote: (id: string) => Note | null;
}

const ME: Author = { id: 'me', name: '我', color: '#fe2c55' };

// Incremented whenever the feed is reset (category / search / refresh) so stale responses are dropped.
let requestToken = 0;

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => {
      const publishedFor = (category: CategoryId, query: string) =>
        get().published.filter((n) => (category === 'recommend' || n.category === category) && matchesQuery(n, query));

      async function load(mode: LoadMode) {
        const s = get();
        const token = mode === 'more' ? requestToken : ++requestToken;
        const page = mode === 'more' ? s.page : 0;
        const seed = mode === 'refresh' ? s.seed + 1 : s.seed;
        if (mode === 'first') set({ items: [], page: 0, hasMore: true, total: 0, status: 'loading', initialLoading: true, error: null });
        else set({ status: mode === 'more' ? 'loading' : 'refreshing', error: null });
        try {
          const res = await fetchNotes({ feed: s.category, seed, page, query: s.query });
          if (token !== requestToken) return;
          set((cur) => {
            const own = mode === 'more' ? [] : publishedFor(cur.category, cur.query);
            const base = mode === 'more' ? cur.items : own;
            const seen = new Set(base.map((n) => n.id));
            return {
              items: [...base, ...res.items.filter((n) => !seen.has(n.id))],
              page: page + 1,
              hasMore: res.hasMore,
              total: mode === 'more' ? cur.total : res.total + own.length,
              status: 'idle',
              initialLoading: false,
              seed,
            };
          });
        } catch {
          if (token !== requestToken) return;
          set({ status: 'error', initialLoading: false, error: '网络开小差了，点击重试' });
        }
      }

      return {
        category: 'recommend',
        query: '',
        seed: 1,
        items: [],
        page: 0,
        hasMore: true,
        total: 0,
        status: 'idle',
        initialLoading: true,
        error: null,
        liked: {},
        published: [],
        toast: null,

        loadFirstPage: () => load('first'),
        loadMore: async () => {
          const s = get();
          if (s.initialLoading || s.status === 'loading' || s.status === 'refreshing' || !s.hasMore) return;
          await load('more');
        },
        refresh: async () => {
          if (get().status === 'refreshing') return;
          await load('refresh');
          if (get().status === 'idle') get().showToast('已为你推荐新内容');
        },
        setCategory: (category) => {
          if (category === get().category) return;
          set({ category });
          void load('first');
        },
        setQuery: (query) => {
          const q = query.trim();
          if (q === get().query) return;
          set({ query: q });
          void load('first');
        },
        toggleLike: (id) =>
          set((s) => {
            const liked = { ...s.liked };
            if (liked[id]) delete liked[id];
            else liked[id] = true;
            return { liked };
          }),
        publish: ({ title, desc, image, category }) => {
          const note: Note = {
            id: `pub-${Date.now().toString(36)}`,
            title,
            desc,
            image: image.file,
            width: image.width,
            height: image.height,
            author: ME,
            likes: 0,
            collects: 0,
            comments: 0,
            category,
            tags: ['我的笔记'],
            createdAt: Date.now(),
            published: true,
          };
          set((s) => {
            const visible = (s.category === 'recommend' || s.category === category) && matchesQuery(note, s.query);
            return {
              published: [note, ...s.published],
              items: visible ? [note, ...s.items] : s.items,
              total: visible ? s.total + 1 : s.total,
            };
          });
          get().showToast('发布成功');
          return note;
        },
        showToast: (text) => set({ toast: { id: Date.now() + Math.random(), text } }),
        getNote: (id) => {
          const s = get();
          return s.items.find((n) => n.id === id) ?? s.published.find((n) => n.id === id) ?? findMockNote(id);
        },
      };
    },
    {
      name: 'bluebook-state',
      partialize: (s) => ({ liked: s.liked, published: s.published }),
    },
  ),
);
