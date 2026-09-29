import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFeedStore } from '../store/feedStore';
import LoadingDots from './LoadingDots';
import PostCard from './PostCard';
import { ImageIcon, RefreshIcon } from './Icons';

const PULL_THRESHOLD = 80;
const MAX_PULL_DISTANCE = 130;

interface Column {
  items: ReturnType<typeof useFeedStore.getState>['posts'];
  totalHeight: number;
}

const COLUMN_TARGETS: Record<string, number> = {
  base: 2, // < md
  md: 3, // md
  lg: 4, // lg+
};

function getColumnCount(): number {
  if (typeof window === 'undefined') return COLUMN_TARGETS.base;
  const w = window.innerWidth;
  if (w >= 1024) return COLUMN_TARGETS.lg;
  if (w >= 768) return COLUMN_TARGETS.md;
  return COLUMN_TARGETS.base;
}

function distribute(posts: ReturnType<typeof useFeedStore.getState>['posts'], count: number): Column[] {
  const columns: Column[] = Array.from({ length: count }, () => ({
    items: [],
    totalHeight: 0,
  }));

  for (const post of posts) {
    let shortestIdx = 0;
    for (let i = 1; i < columns.length; i++) {
      if (columns[i].totalHeight < columns[shortestIdx].totalHeight) {
        shortestIdx = i;
      }
    }
    const estimatedHeight = post.height + 90; // image height + content + spacing
    columns[shortestIdx].items.push(post);
    columns[shortestIdx].totalHeight += estimatedHeight;
  }
  return columns;
}

const PostCardSkeleton: React.FC<{ height: number }> = ({ height }) => (
  <div className="mb-3 overflow-hidden rounded-xl bg-white shadow-sm">
    <div
      className="w-full animate-pulse bg-gray-200"
      style={{ height }}
    />
    <div className="space-y-2 p-3">
      <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  </div>
);

const FeedGrid: React.FC = () => {
  const {
    posts,
    loading,
    refreshing,
    hasMore,
    fetchPosts,
    loadMorePosts,
    toggleLike,
    openDetail,
    refreshPosts,
  } = useFeedStore();

  const [columnCount, setColumnCount] = useState<number>(getColumnCount);

  useEffect(() => {
    const onResize = () => setColumnCount(getColumnCount());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (posts.length === 0) {
      void fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          void loadMorePosts();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMorePosts]);

  const columns = useMemo(() => distribute(posts, columnCount), [posts, columnCount]);

  // Pull-to-refresh
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef(0);
  const pulling = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [pullActive, setPullActive] = useState(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 0 || refreshing) return;
    startY.current = e.touches[0].clientY;
    pulling.current = true;
  }, [refreshing]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current || refreshing) return;
    if (window.scrollY > 0) {
      setPullDistance(0);
      return;
    }
    const delta = e.touches[0].clientY - startY.current;
    if (delta <= 0) {
      if (pullDistance !== 0) setPullDistance(0);
      return;
    }
    e.preventDefault();
    const next = Math.min(delta * 0.5, MAX_PULL_DISTANCE);
    setPullDistance(next);
    setPullActive(next > PULL_THRESHOLD);
  }, [pullDistance, refreshing]);

  const onTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pullDistance > PULL_THRESHOLD) {
      setPullDistance(60);
      await refreshPosts();
    }
    setPullDistance(0);
    setPullActive(false);
  }, [pullDistance, refreshPosts]);

  const empty = !loading && posts.length === 0;
  const initialLoading = loading && posts.length === 0;

  return (
    <div
      ref={containerRef}
      className="relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => {
        pulling.current = false;
        setPullDistance(0);
        setPullActive(false);
      }}
    >
      {/* pull-to-refresh indicator */}
      <div
        className="pointer-events-none flex items-center justify-center transition-transform duration-200"
        style={{
          height: 56,
          transform: `translateY(${Math.max(0, pullDistance - 56)}px)`,
          opacity: Math.min(1, pullDistance / 60),
        }}
      >
        <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
          <RefreshIcon
            size={20}
            className={`text-primary transition-transform duration-200 ${
              refreshing
                ? 'animate-spin'
                : pullActive
                ? 'rotate-180'
                : ''
            }`}
          />
          <span>
            {refreshing
              ? '刷新中…'
              : pullActive
              ? '松开即可刷新'
              : '下拉可以刷新'}
          </span>
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl px-3 pb-12 transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {initialLoading ? (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columnCount * 3 }).map((_, idx) => {
              const col = idx % columnCount;
              const heights = [240, 280, 320, 360, 300, 340];
              const height = heights[(col + idx) % heights.length];
              return <PostCardSkeleton key={idx} height={height} />;
            })}
          </div>
        ) : empty ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <ImageIcon size={28} className="text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-700">暂无相关内容</p>
            <p className="mt-1 text-xs text-gray-400">
              换个关键词或切换分类试试
            </p>
          </div>
        ) : (
          <>
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                alignItems: 'start',
              }}
            >
              {columns.map((col, idx) => (
                <div key={idx} className="flex flex-col">
                  {col.items.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={toggleLike}
                      onOpen={openDetail}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div ref={sentinelRef} className="flex justify-center py-8">
              {loading && (
                <div className="flex flex-col items-center gap-2 text-xs text-gray-500">
                  <LoadingDots />
                  <span>加载中…</span>
                </div>
              )}
              {!hasMore && !loading && (
                <span className="text-xs text-gray-400">已经到底啦</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedGrid;
