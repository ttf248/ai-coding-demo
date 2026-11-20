import React, { useEffect, useMemo, useRef, useState } from 'react';
import { forceCheck } from 'react-lazyload';
import { useBlueBookStore } from './store';
import { CATEGORIES, PostItem, FALLBACK_IMAGE_URL } from './mockData';
import { HeaderBar } from './components/HeaderBar';
import { WaterfallCard } from './components/WaterfallCard';

export default function App() {
  const {
    posts,
    searchQuery,
    activeCategory,
    isLoadingMore,
    isRefreshing,
    forceBrokenMode,
    setSearchQuery,
    setActiveCategory,
    toggleLike,
    loadMore,
    refreshFeed,
    toggleBrokenMode,
    publishPost
  } = useBlueBookStore();

  // 响应式列数：移动端 (<768px) 2列，平板 (768px~1023px) 3列，桌面端 (>=1024px) 4列
  const [colCount, setColCount] = useState<number>(4);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCat, setNewCat] = useState('travel');

  // 触摸下拉刷新手势状态
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function updateColumns() {
      const w = window.innerWidth;
      if (w < 768) setColCount(2);
      else if (w < 1024) setColCount(3);
      else setColCount(4);
    }
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // 过滤搜索词与分类
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  // 最短列贪心分配算法，确保 2/3/4 列高度均衡紧凑
  const columns = useMemo(() => {
    const cols: PostItem[][] = Array.from({ length: colCount }, () => []);
    const heights = new Array(colCount).fill(0);
    for (const post of filteredPosts) {
      let shortestIdx = 0;
      for (let i = 1; i < colCount; i++) {
        if (heights[i] < heights[shortestIdx]) {
          shortestIdx = i;
        }
      }
      cols[shortestIdx].push(post);
      heights[shortestIdx] += post.aspectRatio + 0.35;
    }
    return cols;
  }, [filteredPosts, colCount]);

  useEffect(() => {
    setTimeout(() => forceCheck(), 60);
  }, [filteredPosts, activeCategory]);

  // 滚动到底部自动加载更多
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: '180px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoadingMore, loadMore]);

  // 下拉刷新触摸处理
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 5) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0 && window.scrollY <= 5) {
      setPullDistance(Math.min(90, delta * 0.5));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= 52) {
      refreshFeed();
    }
    setPullDistance(0);
    touchStartY.current = null;
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    publishPost(newTitle.trim(), newCat, newAuthor.trim() || '灵感薯');
    setNewTitle('');
    setNewAuthor('');
    setShowPublishModal(false);
  };

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部搜索栏 */}
      <HeaderBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPublish={() => setShowPublishModal(true)}
        onRefresh={refreshFeed}
        isRefreshing={isRefreshing}
      />

      {/* 分类频道切换栏 + 故障回退测试开关 */}
      <div className="bg-white border-b border-neutral-200/70">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                    active
                      ? 'bg-[#fe2c55] text-white font-semibold shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={toggleBrokenMode}
            className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap border transition ${
              forceBrokenMode
                ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold'
                : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            {forceBrokenMode ? '🖼️ 已开启默认占位图预览' : '🧪 测试图片失败默认图'}
          </button>
        </div>
      </div>

      {/* 下拉刷新动画提示条 */}
      {(pullDistance > 10 || isRefreshing) && (
        <div
          style={{ height: isRefreshing ? 48 : pullDistance }}
          className="flex items-center justify-center text-xs text-[#fe2c55] font-medium transition-all overflow-hidden bg-rose-50/70"
        >
          <span className="inline-block w-4 h-4 border-2 border-[#fe2c55] border-t-transparent rounded-full animate-spin mr-2" />
          {isRefreshing
            ? '正在为你刷新最新社区灵感...'
            : pullDistance >= 52
              ? '释放立即刷新'
              : '继续下拉刷新'}
        </div>
      )}

      {/* 瀑布流主体：key 绑定分类触发页面切换渐入动画 */}
      <main
        key={activeCategory}
        className="flex-1 max-w-6xl w-full mx-auto px-2.5 sm:px-5 py-4 animate-page-fade"
      >
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-[8px] p-12 text-center text-neutral-500 text-sm my-6">
            没有找到与“{searchQuery}”相关的笔记，换个关键词试试吧～
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 items-start">
            {columns.map((colPosts, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-2.5 sm:gap-4">
                {colPosts.map((post) => (
                  <WaterfallCard
                    key={post.id}
                    post={post}
                    forceBroken={forceBrokenMode}
                    onToggleLike={toggleLike}
                    onSelectPost={setSelectedPost}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* 底部自动加载更多触发器与 Loading 动画 */}
        <div
          ref={loaderRef}
          className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-neutral-500"
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-[#fe2c55] border-t-transparent rounded-full animate-spin" />
            <span>
              {isLoadingMore
                ? '正在加载更多灵感卡片...'
                : `已加载 ${posts.length} 条笔记 · 向下滚动自动加载更多`}
            </span>
          </div>
        </div>
      </main>

      {/* 卡片详情弹窗 */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-page-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <img
              src={
                forceBrokenMode || selectedPost.simulateBroken
                  ? FALLBACK_IMAGE_URL
                  : selectedPost.imageUrl
              }
              alt={selectedPost.title}
              className="w-full max-h-80 object-cover"
            />
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: selectedPost.authorColor }}
                    className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  >
                    {selectedPost.authorInitial}
                  </div>
                  <span className="text-sm font-semibold text-neutral-800">
                    {selectedPost.authorName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="text-neutral-400 hover:text-neutral-700 text-sm"
                >
                  ✕ 关闭
                </button>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {selectedPost.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 发布新笔记弹窗 */}
      {showPublishModal && (
        <div
          onClick={() => setShowPublishModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-page-fade"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handlePublishSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-neutral-900">发布小蓝书笔记</h2>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-600">笔记标题</label>
              <textarea
                rows={3}
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="分享你的生活灵感..."
                className="w-full rounded-xl border border-neutral-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fe2c55]/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">分类频道</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 p-2 text-xs"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">作者昵称</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="默认：灵感薯"
                  className="w-full rounded-xl border border-neutral-200 p-2 text-xs"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#fe2c55] hover:bg-[#e02449] text-white text-sm font-semibold shadow"
            >
              立即发布到瀑布流
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
