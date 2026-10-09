import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store';
import { PostCard } from './PostCard';

interface WaterfallGridProps {
  onRefresh?: () => void;
}

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({ onRefresh }) => {
  const posts = useAppStore((state) => state.posts);
  const setLoading = useAppStore((state) => state.setLoading);
  const addPosts = useAppStore((state) => state.addPosts);
  const loading = useAppStore((state) => state.loading);

  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);

  // 处理下拉刷新
  const handleTouchStart = (e: React.TouchEvent) => {
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      touchStartRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current === 0) return;

    const distance = e.touches[0].clientY - touchStartRef.current;
    if (distance > 0 && distance < 100) {
      setPullDistance(distance);
      setIsPulling(true);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 50) {
      handleRefresh();
    }
    setPullDistance(0);
    setIsPulling(false);
    touchStartRef.current = 0;
  };

  // 刷新数据
  const handleRefresh = async () => {
    setLoading(true);
    onRefresh?.();
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // 无限滚动加载
  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading) return;

    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 500) {
      setLoading(true);
      setTimeout(() => {
        const currentCount = posts.length;
        addPosts(
          Array.from({ length: 10 }, (_, i) => ({
            id: `post-${currentCount + i}`,
            title: `动态 ${currentCount + i + 1}`,
            image: `https://picsum.photos/300/400?random=${currentCount + i}`,
            author: ['小红', '小蓝', '小明', '小芳'][Math.floor(Math.random() * 4)],
            authorInitial: ['小', '红', '蓝', '明'][Math.floor(Math.random() * 4)],
            likes: Math.floor(Math.random() * 10000) + 100,
            liked: false,
          }))
        );
        setLoading(false);
      }, 400);
    }
  }, [posts.length, loading, addPosts, setLoading]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onScroll={handleScroll}
      className="pt-16 pb-8 overflow-y-auto overflow-x-hidden h-screen"
    >
      {/* 下拉刷新提示 */}
      {isPulling && (
        <div
          className="flex items-center justify-center transition-all"
          style={{
            height: `${pullDistance}px`,
            opacity: Math.min(pullDistance / 50, 1),
          }}
        >
          <div className="text-center">
            <svg
              className="w-6 h-6 mx-auto text-xiaohongshu spinner"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <p className="text-xs text-gray-500 mt-1">释放刷新</p>
          </div>
        </div>
      )}

      {/* 瀑布流网格 */}
      <div className="px-2 py-4 max-w-md mx-auto">
        {/* 响应式列布局 */}
        <div className="hidden sm:hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 平板和桌面 */}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* 移动端列布局 */}
        <div className="sm:hidden space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* 加载更多提示 */}
        {loading && (
          <div className="py-8 text-center">
            <div className="inline-block">
              <svg
                className="w-8 h-8 text-xiaohongshu spinner"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="1" opacity="0.3" />
                <circle cx="19" cy="12" r="1" opacity="0.6" />
                <circle cx="5" cy="12" r="1" opacity="0.6" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mt-2">加载中...</p>
          </div>
        )}

        {/* 没有更多内容 */}
        {!loading && posts.length > 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-400 text-sm">没有更多内容了</p>
          </div>
        )}
      </div>
    </div>
  );
};
