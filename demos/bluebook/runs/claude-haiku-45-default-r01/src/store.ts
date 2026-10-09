import { create } from 'zustand';

export interface Post {
  id: string;
  title: string;
  image: string;
  author: string;
  authorInitial: string;
  likes: number;
  liked: boolean;
}

interface AppStore {
  posts: Post[];
  loading: boolean;
  addPosts: (posts: Post[]) => void;
  toggleLike: (id: string) => void;
  setLoading: (loading: boolean) => void;
  refreshPosts: () => void;
}

// Mock 数据生成函数
const generateMockPosts = (startId: number, count: number): Post[] => {
  const titles = [
    '今天的咖啡馆太治愈了 ☕',
    '秋天的色彩美到不行 🍂',
    '新品测评：这个面膜真的绝！',
    '夕阳下的散步日记 🌅',
    '这家餐厅的甜品我的最爱 🍰',
    '健身30天变化对比 💪',
    '北京初秋天气太舒服了',
    '新入手的包包分享',
    '减肥食谱分享第一周成果',
    '旅游攻略：小众景点推荐',
  ];

  const authors = ['小红', '小蓝', '小明', '小芳', '小王', '小刘', '小李', '小张'];

  const images = Array.from({ length: 20 }, (_, i) =>
    `https://picsum.photos/300/400?random=${startId + i}`
  );

  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    return {
      id: `post-${id}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      image: images[i % images.length],
      author: authors[Math.floor(Math.random() * authors.length)],
      authorInitial: authors[Math.floor(Math.random() * authors.length)][0],
      likes: Math.floor(Math.random() * 10000) + 100,
      liked: false,
    };
  });
};

export const useAppStore = create<AppStore>((set) => ({
  posts: generateMockPosts(0, 20),
  loading: false,

  addPosts: (newPosts) =>
    set((state) => ({
      posts: [...state.posts, ...newPosts],
    })),

  toggleLike: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      ),
    })),

  setLoading: (loading) => set({ loading }),

  refreshPosts: () =>
    set({
      posts: generateMockPosts(0, 20),
    }),
}));
