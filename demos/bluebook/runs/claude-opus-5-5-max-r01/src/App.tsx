import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useFeedStore } from './store/useFeedStore';
import { useColumns } from './hooks/useColumns';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { backToFeed, useHashRoute } from './router';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import MasonryGrid, { SkeletonGrid } from './components/MasonryGrid';
import LoadMoreStatus from './components/LoadMoreStatus';
import PullToRefresh from './components/PullToRefresh';
import NoteDetail from './components/NoteDetail';
import PublishSheet from './components/PublishSheet';
import { BackToTop, Toast } from './components/Feedback';
import { SearchIcon } from './components/icons';

export default function App() {
  const route = useHashRoute();
  const columns = useColumns();
  const { items, status, hasMore, error, initialLoading, query, total, category } = useFeedStore(
    useShallow((s) => ({ items: s.items, status: s.status, hasMore: s.hasMore, error: s.error, initialLoading: s.initialLoading, query: s.query, total: s.total, category: s.category })),
  );
  const { loadFirstPage, loadMore, refresh, setQuery } = useFeedStore(
    useShallow((s) => ({ loadFirstPage: s.loadFirstPage, loadMore: s.loadMore, refresh: s.refresh, setQuery: s.setQuery })),
  );
  const [publishOpen, setPublishOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  useInfiniteScroll(sentinel, () => void loadMore(), !initialLoading && hasMore && status === 'idle', [items.length, columns]);

  const overlay = route.name === 'note' || publishOpen;
  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', overlay);
  }, [overlay]);

  return (
    <div className="min-h-screen bg-page">
      <Header onPublish={() => setPublishOpen(true)} />
      <PullToRefresh onRefresh={refresh} disabled={overlay}>
        <main className="mx-auto max-w-6xl px-2 pt-2 md:px-6 md:pt-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
          {query && (
            <div className="mb-2 flex items-center justify-between px-1 text-sm text-gray-500 md:mb-3">
              <span className="truncate">
                搜索“<b className="font-medium text-gray-800">{query}</b>”{initialLoading ? '' : ` · 共 ${total} 条结果`}
              </span>
              <button type="button" onClick={() => setQuery('')} className="shrink-0 text-brand">清除搜索</button>
            </div>
          )}
          <div key={`${category}|${query}`} className="animate-fade-in">
            {initialLoading ? (
              <SkeletonGrid columns={columns} />
            ) : items.length ? (
              <MasonryGrid items={items} columns={columns} />
            ) : status !== 'error' ? (
              <div className="flex flex-col items-center gap-2 py-24 text-gray-400">
                <SearchIcon size={40} />
                <p className="text-sm">没有找到相关内容，换个关键词试试吧</p>
              </div>
            ) : null}
          </div>
          <div ref={sentinel} aria-hidden="true" />
          {!initialLoading && <LoadMoreStatus status={status} hasMore={hasMore} error={error} empty={!items.length} onRetry={() => void loadMore()} />}
        </main>
      </PullToRefresh>
      {route.name === 'note' && (
        <ErrorBoundary key={route.id} onReset={backToFeed}>
          <NoteDetail id={route.id} />
        </ErrorBoundary>
      )}
      <PublishSheet open={publishOpen} onClose={() => setPublishOpen(false)} />
      <BackToTop hidden={overlay} />
      <Toast />
    </div>
  );
}
