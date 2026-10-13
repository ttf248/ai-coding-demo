import { useEffect, useRef } from 'react';
import Card from './Card';
import { useStore } from '../store';

export default function Waterfall() {
  const posts = useStore((s) => s.posts);
  const loading = useStore((s) => s.loading);
  const refreshing = useStore((s) => s.refreshing);
  const query = useStore((s) => s.query);
  const loadMore = useStore((s) => s.loadMore);
  const refresh = useStore((s) => s.refresh);
  const pullRef = useRef<{ startY: number; pulling: boolean }>({ startY: 0, pulling: false });

  // 滚动到底部自动加载更多
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300) {
        loadMore();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loadMore]);

  // 下拉刷新（顶部下拉，触摸与鼠标拖动均可触发）
  const onTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) pullRef.current = { startY: e.touches[0].clientY, pulling: true };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!pullRef.current.pulling) return;
    const dy = e.touches[0].clientY - pullRef.current.startY;
    if (dy > 0 && window.scrollY <= 0) {
      document.documentElement.style.setProperty('--pull-h', `${Math.min(dy * 0.5, 90)}px`);
    }
  };
  const onTouchEnd = () => {
    if (!pullRef.current.pulling) return;
    pullRef.current.pulling = false;
    const h = document.documentElement.style.getPropertyValue('--pull-h');
    document.documentElement.style.setProperty('--pull-h', '0px');
    if (parseFloat(h) > 45) refresh();
  };

  return (
    <main
      className="mx-auto max-w-3xl px-3 pt-3 pb-10"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="pull-indicator overflow-hidden" style={{ height: 'var(--pull-h, 0px)' }}>
        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs py-2">
          <span className="inline-block w-3.5 h-3.5 border-2 border-gray-300 border-t-transparent rounded-full spinner" />
          {refreshing ? '正在刷新…' : '下拉刷新'}
        </div>
      </div>

      {query && (
        <div className="fade-in mb-3 text-xs text-gray-500" data-testid="search-hint">
          搜索「{query}」共 {posts.length} 条结果
        </div>
      )}

      {/* 瀑布流：移动端 2 列 / 平板 3 列 / 桌面 4 列 */}
      <div className="fade-in grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4" data-testid="waterfall">
        {posts.map((p) => (
          <Card key={p.id} post={p} />
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center text-gray-400 text-sm py-16">没有找到相关内容，换个关键词试试吧</div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-gray-400 text-xs" data-testid="loading">
          <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full spinner" />
          加载中…
        </div>
      )}
      {!query && !loading && (
        <div className="text-center text-gray-300 text-xs py-4" data-testid="end">
          已经到底啦
        </div>
      )}
    </main>
  );
}
