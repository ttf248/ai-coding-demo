export interface Post {
  id: string;
  title: string;
  imageUrl: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  isLiked: boolean;
  aspectRatio: number; // 图片宽高比
}

export interface AppState {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  searchKeyword: string;
}

export interface PostStore extends AppState {
  fetchPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  toggleLike: (postId: string) => void;
  setSearchKeyword: (keyword: string) => void;
  refreshPosts: () => Promise<void>;
}
