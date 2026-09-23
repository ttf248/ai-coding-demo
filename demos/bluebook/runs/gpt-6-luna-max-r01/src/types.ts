export const CATEGORIES = ['推荐', '日常', '美食', '家居', '旅行', '穿搭'] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Post {
  id: string;
  title: string;
  image: string;
  category: Exclude<Category, '推荐'>;
  author: string;
  avatar: string;
  avatarColor: string;
  likes: number;
  liked: boolean;
  ratio: string;
}

export interface PostSeed extends Omit<Post, 'id' | 'liked'> {}
