import { create } from 'zustand';
import { PostStore } from '../types';
import { mockApi } from '../mock/data';

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  loading: false,
  hasMore: true,
  searchKeyword: '',

  fetchPosts: async () => {
    set({ loading: true });
    try {
      const posts = await mockApi.fetchPosts(0, 20);
      set({ posts, loading: false, hasMore: true });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      set({ loading: false });
    }
  },

  loadMorePosts: async () => {
    const { posts, loading, hasMore } = get();
    if (loading || !hasMore) return;

    set({ loading: true });
    try {
      const currentPage = Math.floor(posts.length / 20);
      const newPosts = await mockApi.fetchPosts(currentPage, 20);
      
      if (newPosts.length < 20) {
        set({ hasMore: false });
      }
      
      set({ 
        posts: [...posts, ...newPosts], 
        loading: false 
      });
    } catch (error) {
      console.error('Failed to load more posts:', error);
      set({ loading: false });
    }
  },

  toggleLike: async (postId: string) => {
    const { posts } = get();
    
    // 乐观更新UI
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    
    set({ posts: updatedPosts });

    try {
      // 调用API更新服务器状态
      await mockApi.toggleLike(postId);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // 如果API调用失败，回滚UI状态
      set({ posts });
    }
  },

  setSearchKeyword: (keyword: string) => {
    set({ searchKeyword: keyword });
  },

  refreshPosts: async () => {
    const { searchKeyword } = get();
    set({ loading: true, posts: [] });
    
    try {
      let posts;
      if (searchKeyword.trim()) {
        posts = await mockApi.searchPosts(searchKeyword);
      } else {
        posts = await mockApi.fetchPosts(0, 20);
      }
      set({ posts, loading: false, hasMore: true });
    } catch (error) {
      console.error('Failed to refresh posts:', error);
      set({ loading: false });
    }
  },
}));
