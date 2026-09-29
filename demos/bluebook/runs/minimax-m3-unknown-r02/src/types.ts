export type CategoryId =
  | 'recommend'
  | 'food'
  | 'travel'
  | 'fashion'
  | 'beauty'
  | 'fitness'
  | 'home'
  | 'pets'
  | 'handmade'
  | 'photography';

export interface Category {
  id: CategoryId;
  label: string;
}

export interface Author {
  id: string;
  name: string;
  initial: string;
  color: string;
}

export interface Post {
  id: string;
  title: string;
  authorInitial: string;
  authorName: string;
  authorColor: string;
  likes: number;
  isLiked: boolean;
  height: number;
  gradient: string;
  svg: string;
  imageUrl: string;
  category: CategoryId;
}

export interface FeedState {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  searchKeyword: string;
  activeCategory: CategoryId;
  page: number;
  detailPost: Post | null;
  selectedPostIds: string[];
}

export interface FeedActions {
  fetchPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  toggleLike: (postId: string) => void;
  setSearchKeyword: (keyword: string) => void;
  setActiveCategory: (category: CategoryId) => void;
  refreshPosts: () => Promise<void>;
  openDetail: (postId: string) => void;
  closeDetail: () => void;
  setSelectedPostIds: (ids: string[]) => void;
}

export type FeedStore = FeedState & FeedActions;
