import React, { useEffect, useRef } from 'react';
import { usePostStore } from '../store/postStore';
import PostCard from './PostCard';
import { WaterfallSkeleton } from './Skeleton';

// 简单的内联LoadingSpinner组件
const LoadingSpinner: React.FC = () => (
  <div className="inline-block h-6 w-6">
    <div className="relative">
      <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
    </div>
  </div>
);

const WaterfallGrid: React.FC = () => {
  const { posts, loading, hasMore, fetchPosts, loadMorePosts, toggleLike } = usePostStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 初始化数据
  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [fetchPosts, posts.length]);

  // 无限滚动 - 使用底部加载指示器
  useEffect(() => {
    if (!loadMoreRef.current || loading || !hasMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    observer.observe(loadMoreRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore, loadMorePosts, posts.length]);
  // 将posts分配到不同列
  const distributePostsToColumns = () => {
    const columns: typeof posts[] = [[], [], [], []];
    const columnHeights = [0, 0, 0, 0];

    posts.forEach((post) => {
      // 找到最短的列
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columns[shortestColumnIndex].push(post);
      
      // 估算卡片高度 (图片高度 + 内容高度)
      const estimatedHeight = (300 / post.aspectRatio) + 120;
      columnHeights[shortestColumnIndex] += estimatedHeight;
    });

    return columns;
  };

  const columns = distributePostsToColumns();
  if (posts.length === 0 && loading) {
    return <WaterfallSkeleton />;
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-4xl mb-4">📷</div>
        <p className="text-lg font-medium mb-2">暂无内容</p>
        <p className="text-sm">刷新页面或搜索其他内容</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 响应式瀑布流网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {columns.map((columnPosts, columnIndex) => (
          <div key={columnIndex} className="flex flex-col">
            {columnPosts.map((post) => (
              <div key={post.id}>
                <PostCard post={post} onLike={toggleLike} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 加载更多指示器 */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {loading && (
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner />
            <p className="text-sm text-gray-500">加载中...</p>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-sm text-gray-400">没有更多内容了</p>
        )}
      </div>
    </div>
  );
};

export default WaterfallGrid;
