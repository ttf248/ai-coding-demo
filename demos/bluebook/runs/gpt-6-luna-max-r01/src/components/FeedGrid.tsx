import { useEffect, useRef } from 'react';
import type { Post } from '../types';
import LoadingDots from './LoadingDots';
import PostCard from './PostCard';
import { LeafIcon } from './Icons';

interface FeedGridProps {
  posts: Post[];
  onLike: (id: string) => void;
  onLoadMore: () => void;
  isLoading: boolean;
  transitionKey: string;
}

export default function FeedGrid({ posts, onLike, onLoadMore, isLoading, transitionKey }: FeedGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { rootMargin: '720px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore, posts.length]);

  if (!posts.length) {
    return (
      <div className="empty-state mx-auto flex min-h-[300px] max-w-md flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#dfbdc4] shadow-card">
          <LeafIcon className="h-8 w-8" />
        </span>
        <h2 className="text-base font-semibold text-ink">还没有找到这类灵感</h2>
        <p className="mt-2 text-sm leading-6 text-[#99969e]">试试换个关键词，或者看看其他分类吧。</p>
      </div>
    );
  }

  return (
    <div key={transitionKey} className="feed-transition">
      <div className="waterfall-columns">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={onLike} />
        ))}
      </div>
      <div className="pb-12 pt-3">
        {isLoading ? (
          <LoadingDots />
        ) : (
          <div aria-hidden="true" className="h-4" />
        )}
        <div ref={sentinelRef} className="h-1" />
      </div>
    </div>
  );
}
