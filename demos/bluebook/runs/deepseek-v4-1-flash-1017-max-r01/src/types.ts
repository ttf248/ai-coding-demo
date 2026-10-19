export interface Post {
  id: string;
  title: string;
  author: string;
  avatar: string;
  image: string;
  likes: number;
  ratio: number;
  category: string;
  body?: string;
}
