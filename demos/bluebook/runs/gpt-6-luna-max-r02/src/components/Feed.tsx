import { useEffect, useMemo, useRef } from 'react';
import PostCard from './PostCard';
import { useFeed } from '../store';

export default function Feed() {
  const posts = useFeed((s) => s.posts), query = useFeed((s) => s.query), category = useFeed((s) => s.category), following = useFeed((s) => s.following), loading = useFeed((s) => s.loading), loadMore = useFeed((s) => s.loadMore);
  const sentinel = useRef<HTMLDivElement>(null), touchY = useRef(0);
  const visible = useMemo(() => posts.filter((post) => (category === '推荐' || category === '关注' || post.category === category) && (!query || `${post.title}${post.author}${post.category}`.toLowerCase().includes(query.toLowerCase())) && (!following || ['林间慢镜头', '花房日记', '海风来信'].includes(post.author))), [posts, category, query, following]);
  useEffect(() => { const node = sentinel.current; if (!node) return; const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) void loadMore(); }, { rootMargin: '500px' }); observer.observe(node); return () => observer.disconnect(); }, [loadMore]);
  const categories = ['推荐', '关注', '旅行', '美食', '生活', '手作', '摄影', '阅读'];
  return <main onTouchStart={(e) => { touchY.current = e.touches[0].clientY; }} onTouchEnd={(e) => { if (window.scrollY === 0 && e.changedTouches[0].clientY - touchY.current > 86) window.dispatchEvent(new Event('bluebook:refresh')); }}>
    <div className="category-bar flex items-center overflow-x-auto">{categories.map((item) => <button key={item} className={`category-chip flex-shrink-0 ${category === item ? 'active' : ''}`} onClick={() => { useFeed.getState().setCategory(item); useFeed.getState().setFollowing(item === '关注'); }}>{item}{item === '关注' && <span className="tiny-dot" />}</button>)}</div>
    <div className="feed-heading"><div><p className="eyebrow">SLOW LIVING · DAILY PICKS</p><h1>{category === '关注' ? '熟悉的人，新的日常' : '把喜欢的生活收集起来'}</h1></div><button className="refresh-button" onClick={() => window.dispatchEvent(new Event('bluebook:refresh'))}>↻ <span>刷新</span></button></div>
    {visible.length ? <div className="masonry columns-2 md:columns-3 xl:columns-4">{visible.map((post) => <PostCard key={post.id} post={post} />)}</div> : <div className="empty-state"><span>⌕</span><b>暂时没有找到内容</b><p>换一个关键词，看看新的灵感。</p></div>}
    <div ref={sentinel} className="load-sentinel">{loading && <div className="loading"><span /><span /><span /><small>正在发现更多灵感</small></div>}{!loading && posts.length >= 24 && <span>今天的灵感先看到这里</span>}</div>
  </main>;
}
