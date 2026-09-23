import { useEffect, useMemo, useRef, useState } from 'react';
import CategoryBar from './components/CategoryBar';
import FeedGrid from './components/FeedGrid';
import SiteHeader from './components/SiteHeader';
import { ArrowDownIcon, LeafIcon } from './components/Icons';
import { useFeedStore } from './store/feedStore';

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const posts = useFeedStore((state) => state.posts);
  const query = useFeedStore((state) => state.query);
  const activeCategory = useFeedStore((state) => state.activeCategory);
  const isLoadingMore = useFeedStore((state) => state.isLoadingMore);
  const isRefreshing = useFeedStore((state) => state.isRefreshing);
  const setQuery = useFeedStore((state) => state.setQuery);
  const setActiveCategory = useFeedStore((state) => state.setActiveCategory);
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const loadMore = useFeedStore((state) => state.loadMore);
  const refresh = useFeedStore((state) => state.refresh);

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return posts.filter((post) => {
      const matchesCategory = activeCategory === '推荐' || post.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${post.title} ${post.author} ${post.category}`.toLocaleLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, posts, query]);

  useEffect(() => {
    const node = mainRef.current;
    if (!node) return;

    let startY = 0;
    let tracking = false;
    let distance = 0;

    const onTouchStart = (event: TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('button, input, a')) return;
      if (window.scrollY > 0 || isRefreshing) return;
      startY = event.touches[0]?.clientY ?? 0;
      tracking = startY > 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!tracking || window.scrollY > 0) return;
      const currentY = event.touches[0]?.clientY ?? startY;
      distance = Math.max(0, Math.min(100, currentY - startY));
      if (distance > 0) {
        setPullDistance(distance);
        if (distance > 8) event.preventDefault();
      }
    };

    const onTouchEnd = () => {
      if (!tracking) return;
      tracking = false;
      if (distance >= 68) {
        setPullDistance(76);
        void refresh().finally(() => setPullDistance(0));
      } else {
        setPullDistance(0);
      }
      distance = 0;
    };

    node.addEventListener('touchstart', onTouchStart, { passive: true });
    node.addEventListener('touchmove', onTouchMove, { passive: false });
    node.addEventListener('touchend', onTouchEnd, { passive: true });
    node.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
      node.removeEventListener('touchend', onTouchEnd);
      node.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isRefreshing, refresh]);

  const showPullIndicator = pullDistance > 0 || isRefreshing;
  const pullLabel = isRefreshing ? '正在更新灵感' : pullDistance >= 68 ? '松开即可刷新' : '下拉刷新';

  return (
    <div className="page-enter min-h-screen bg-canvas text-ink" id="top">
      <SiteHeader query={query} onQueryChange={setQuery} />
      <main className="relative mx-auto min-h-[calc(100vh-76px)] max-w-[1440px] px-4 pb-8 pt-7 sm:px-7 sm:pt-10 lg:px-10" ref={mainRef}>
        <div
          aria-live="polite"
          className={`pull-indicator fixed left-1/2 z-40 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-[#77737c] shadow-[0_6px_24px_rgba(54,39,47,.12)] transition-all duration-200 ${showPullIndicator ? 'visible opacity-100' : 'invisible opacity-0'}`}
          style={{ transform: `translate(-50%, ${Math.max(10, pullDistance - 28)}px)` }}
        >
          {isRefreshing ? (
            <span className="refresh-spinner" aria-hidden="true" />
          ) : pullDistance >= 68 ? (
            <ArrowDownIcon className="h-4 w-4 rotate-180 text-brand" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-[#aaa6ae]" />
          )}
          <span>{pullLabel}</span>
        </div>

        <section className="welcome-panel mb-6 flex flex-col justify-between gap-5 overflow-hidden rounded-2xl px-5 py-5 sm:mb-8 sm:flex-row sm:items-end sm:px-8 sm:py-7">
          <div className="relative z-10">
            <div className="welcome-eyebrow mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.16em] sm:text-xs">
              <LeafIcon className="h-4 w-4" />
              <span>little things, lovely days</span>
            </div>
            <h1 className="max-w-xl text-[25px] font-semibold leading-[1.35] tracking-[-.04em] text-[#28252b] sm:text-[34px]">
              把生活的可爱，<span className="text-brand">慢慢收进来。</span>
            </h1>
            <p className="mt-2 text-xs leading-5 text-[#77737c] sm:mt-2.5 sm:text-sm">
              灵感不必很远，就藏在每一个认真生活的瞬间里。
            </p>
          </div>
          <div className="welcome-note relative z-10 hidden shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs text-[#79737c] sm:flex">
            <span className="note-sparkle" aria-hidden="true">✳</span>
            <span>今天也发现一点新鲜事</span>
          </div>
          <span className="welcome-orb welcome-orb-one" aria-hidden="true" />
          <span className="welcome-orb welcome-orb-two" aria-hidden="true" />
        </section>

        <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
          <div>
            <h2 className="text-[17px] font-semibold tracking-[-.025em] text-[#302d34] sm:text-lg">发现灵感</h2>
            <p className="mt-1 text-[11px] text-[#a09da5] sm:text-xs">每一张喜欢的图片，都是生活的小注脚</p>
          </div>
          <span className="mb-0.5 shrink-0 text-[11px] tabular-nums text-[#aaa7ae] sm:text-xs">
            {visiblePosts.length} 条内容
          </span>
        </div>

        <CategoryBar active={activeCategory} onChange={setActiveCategory} />
        <FeedGrid
          posts={visiblePosts}
          onLike={toggleLike}
          onLoadMore={loadMore}
          isLoading={isLoadingMore}
          transitionKey={`${activeCategory}:${query}`}
        />
        <footer className="flex items-center justify-center gap-2 pb-5 pt-1 text-[11px] text-[#b0adb4]">
          <span className="h-px w-7 bg-[#e8e5e8]" />
          <span>把平凡日子过得闪闪发光</span>
          <span className="h-px w-7 bg-[#e8e5e8]" />
        </footer>
      </main>
    </div>
  );
}
