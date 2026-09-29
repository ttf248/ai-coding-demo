import React, { useEffect } from 'react';
import CategoryBar from './components/CategoryBar';
import FeedGrid from './components/FeedGrid';
import SiteHeader from './components/SiteHeader';
import { useFeedStore } from './store/feedStore';
import {
  ArrowLeftIcon,
  CloseIcon,
  CommentIcon,
  FilledHeartIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
} from './components/Icons';

function formatLikes(value: number): string {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
}

const PostDetail: React.FC = () => {
  const { detailPost, closeDetail, toggleLike } = useFeedStore();

  useEffect(() => {
    if (!detailPost) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [detailPost, closeDetail]);

  if (!detailPost) return null;
  const post = detailPost;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={closeDetail}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
          <button
            onClick={closeDetail}
            aria-label="关闭"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
          >
            <ArrowLeftIcon size={20} className="hidden sm:block" />
            <CloseIcon size={20} className="sm:hidden" />
          </button>
          <span className="text-sm font-medium text-gray-700">笔记详情</span>
          <button
            aria-label="更多"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
          >
            <StarIcon size={18} />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="flex items-center gap-3 px-4 pt-4">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: post.authorColor }}
            >
              {post.authorInitial}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {post.authorName}
              </span>
              <span className="text-xs text-gray-400">
                {post.category === 'recommend'
                  ? '精选内容'
                  : `分类 · ${post.category}`}
              </span>
            </div>
            <button className="ml-auto rounded-full bg-primary px-3 py-1 text-xs font-medium text-white transition-all hover:bg-primary/90 active:scale-95">
              关注
            </button>
          </div>

          <div className="px-4 pt-4">
            <h2 className="text-lg font-semibold leading-snug text-gray-900">
              {post.title}
            </h2>
          </div>

          <div
            className="mx-4 mt-4 overflow-hidden rounded-xl"
            style={{ backgroundImage: post.gradient }}
          >
            <div
              role="img"
              aria-label={post.title}
              className="block w-full"
              style={{
                aspectRatio: '3 / 4',
                WebkitMaskImage: `url("data:image/svg+xml;utf8,${post.svg.replace(
                  /"/g,
                  "'",
                )}")`,
                maskImage: `url("data:image/svg+xml;utf8,${post.svg.replace(
                  /"/g,
                  "'",
                )}")`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
          </div>

          <div className="space-y-2 px-4 py-4 text-sm leading-relaxed text-gray-700">
            <p>
              这是一条来自小蓝书的瀑布流卡片详情示例。基于共享任务正文 v2
              实现，图文内容使用本地 mock 数据生成，刷新、搜索、筛选与懒加载均通过前端完成。
            </p>
            <p className="text-gray-500">
              编号 <span className="font-mono">{post.id}</span> ·
              分类 {post.category} · 高度 {post.height}px
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
          <button
            onClick={() => toggleLike(post.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition-all ${
              post.isLiked
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {post.isLiked ? <FilledHeartIcon size={16} /> : <HeartIcon size={16} />}
            <span className="font-medium tabular-nums">
              {formatLikes(post.likes)}
            </span>
          </button>
          <button className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-gray-600 transition-all hover:bg-gray-100">
            <CommentIcon size={16} />
            <span>评论</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-gray-600 transition-all hover:bg-gray-100">
            <ShareIcon size={16} />
            <span>分享</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-gray-900">
      <SiteHeader />
      <CategoryBar />
      <main className="animate-fade-in">
        <FeedGrid />
      </main>
      <PostDetail />
    </div>
  );
};

export default App;
