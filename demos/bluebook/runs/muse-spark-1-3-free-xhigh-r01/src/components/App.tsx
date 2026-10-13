import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import Card from './Card';
import SearchBar from './SearchBar';
export default function App() {
  const posts = useStore((s) => s.posts);
  const loading = useStore((s) => s.loading);
  const refreshing = useStore((s) => s.refreshing);
  const loadMore = useStore((s) => s.loadMore);
  const refresh = useStore((s) => s.refresh);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (loading) return;
      const el = document.documentElement;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 500) loadMore();
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading, loadMore]);
  // pull to refresh (touch)
  useEffect(() => {
    let startY = 0;
    const ts = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const te = (e: TouchEvent) => {
      const dy = e.changedTouches[0].clientY - startY;
      if (window.scrollY === 0 && dy > 80 && !refreshing) refresh();
    };
    window.addEventListener('touchstart', ts);
    window.addEventListener('touchend', te);
    return () => {
      window.removeEventListener('touchstart', ts);
      window.removeEventListener('touchend', te);
    };
  }, [refreshing, refresh]);
  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
      <SearchBar onRefresh={refresh} />
      <div ref={ref} className="max-w-6xl mx-auto px-2 py-3 page-fade">
        {refreshing && (
          <div className="text-center text-sm py-2 text-gray-500 loading-dots">下拉刷新中</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {posts.map((p) => (
            <Card key={p.id} post={p} />
          ))}
        </div>
        <div className="text-center py-6 text-sm text-gray-500">
          {loading ? <span className="loading-dots">加载中</span> : '— 滚动加载更多 · 已适配 iPhone 12+ —'}
        </div>
      </div>
    </div>
  );
}
