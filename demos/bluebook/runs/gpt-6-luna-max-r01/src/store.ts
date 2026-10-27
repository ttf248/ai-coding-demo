import { create } from 'zustand';

export type Post = {
  id: number;
  title: string;
  author: string;
  avatar: string;
  image: string;
  likes: number;
  tag: string;
};

const pictures = [
  'photo-1470252649378-9c29740c9fa8', 'photo-1500530855697-b586d89ba3ee',
  'photo-1470770841072-f978cf4d019e', 'photo-1518837695005-2083093ee35b',
  'photo-1519681393784-d120267933ba', 'photo-1441974231531-c6227db76b6e',
  'photo-1470071459604-3b5ec3a7fe05', 'photo-1500534623283-312aade485b7',
  'photo-1490750967868-88aa4486c946', 'photo-1493246507139-91e8fad9978e',
  'photo-1472214103451-9374bd1c798e', 'photo-1448375240586-882707db888b',
  'photo-1464822759023-fed622ff2c3b', 'photo-1485470733090-0aae1788d5af',
  'photo-1500534314209-a25ddb2bd429', 'photo-1511497584788-876760111969',
  'photo-1433086966358-54859d0ed716', 'photo-1469474968028-56623f02e42e',
  'photo-1475924156734-496f6cac6ec1', 'photo-1501785888041-af3ef285b470',
];
const titles = [
  '在山野里住了三天，终于睡了一个好觉', '周末散步地图｜城市边缘的安静角落',
  '把日子调成慢速，发现好多微小的幸福', '第一次看见这样的日落，像天空在写信',
  '独居第 365 天，我给自己做了一顿晚餐', '秋天的风，刚好适合去海边发呆',
  '一个人的徒步，也可以很热闹', '今天不赶路，只沿着河流慢慢走',
  '在森林里找到属于自己的呼吸节奏', '分享这条没人排队的观景小路',
  '晨光刚好落在窗台，心情也亮了一点', '路过花店，买下今天第一束自由',
  '周末小记：山顶的云比想象中更近', '一个人旅行的第七天，遇见一场雨',
  '把工作日留白一小时，去公园晒晒太阳', '不需要计划的下午，原来也很珍贵',
  '落叶铺满的小径，像一封秋天的邀请', '远离通知的一天，我重新听见自己',
  '看海的时候，什么都不用想', '冬日清晨的第一杯咖啡和第一束光',
];
const people = ['林间慢慢', '海盐汽水', '阿满的日常', '小岛日记', '山茶不晚', '橘子同学', '慢慢拍', '木木在路上'];
const avatars = ['photo-1534528741775-53994a69daeb', 'photo-1500648767791-00dcc994a43e', 'photo-1524504388940-b1c1722653e1', 'photo-1506794778202-cad84cf45f1d'];
export const createPosts = (start: number, count: number): Post[] =>
  Array.from({ length: count }, (_, offset) => {
    const id = start + offset;
    const pic = pictures[id % pictures.length];
    const avatar = avatars[id % avatars.length];
    return {
      id,
      title: titles[id % titles.length],
      author: people[id % people.length],
      avatar: `https://images.unsplash.com/${avatar}?auto=format&fit=crop&w=100&q=80`,
      image: `https://images.unsplash.com/${pic}?auto=format&fit=crop&w=720&q=85`,
      likes: 126 + ((id * 173) % 12500),
      tag: ['日常灵感', '周末去处', '慢生活', '摄影'][id % 4],
    };
  });

type FeedState = {
  posts: Post[];
  query: string;
  loading: boolean;
  hasMore: boolean;
  liked: Set<number>;
  setQuery: (query: string) => void;
  toggleLike: (id: number) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
};
export const useFeed = create<FeedState>((set, get) => ({
  posts: createPosts(0, 20),
  query: '',
  loading: false,
  hasMore: true,
  liked: new Set(),
  setQuery: (query) => set({ query }),
  toggleLike: (id) => set((state) => {
    const liked = new Set(state.liked);
    liked.has(id) ? liked.delete(id) : liked.add(id);
    return { liked };
  }),
  loadMore: async () => {
    const state = get();
    if (state.loading || !state.hasMore) return;
    set({ loading: true });
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    const start = get().posts.length;
    set((current) => ({ posts: [...current.posts, ...createPosts(start, 12)], loading: false }));
  },
  refresh: async () => {
    set({ loading: true });
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    set({ posts: createPosts(0, 20), liked: new Set(), loading: false });
  },
}));
