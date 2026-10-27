import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
import LazyLoad from 'react-lazyload';
import { useFeed, type Post } from './store';

const Fallback = () => <div className="image-fallback">小蓝书<br /><span>记录生活的灵感</span></div>;

function PostCard({ post, onOpen }: { post: Post; onOpen: (post: Post) => void }) {
  const liked = useFeed((state) => state.liked.has(post.id));
  const toggleLike = useFeed((state) => state.toggleLike);
  const [failed, setFailed] = useState(false);
  return (
    <article className="post-card group" onClick={() => onOpen(post)}>
      <div className="post-image-wrap">
        {failed ? <Fallback /> : (
          <LazyLoad once offset={180} scrollContainer={() => document.querySelector('.feed-scroll')} placeholder={<div className="image-skeleton" />}>
            <img className="post-image" src={post.image} alt={post.title} onError={() => setFailed(true)} />
          </LazyLoad>
        )}
        <span className="image-tag">{post.tag}</span>
      </div>
      <div className="post-copy">
        <h2 className="line-clamp-2">{post.title}</h2>
        <div className="post-meta">
          <div className="author"><img src={post.avatar} alt="" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Crect width=%2240%22 height=%2240%22 fill=%22%23e8e5e2%22/%3E%3Ccircle cx=%2220%22 cy=%2215%22 r=%227%22 fill=%22%23aaa%22/%3E%3Cpath d=%22M6 38c1-10 7-15 14-15s13 5 14 15%22 fill=%22%23aaa%22/%3E%3C/svg%3E'; }} /><span>{post.author}</span></div>
          <button className={`like ${liked ? 'liked' : ''}`} aria-label="点赞" onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}><span className={liked ? 'heart pop' : 'heart'}>{liked ? '♥' : '♡'}</span><span>{(post.likes + (liked ? 1 : 0)).toLocaleString()}</span></button>
        </div>
      </div>
    </article>
  );
}

function PublishModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="publish-modal"><div className="modal-head"><div><span className="eyebrow">SHARE A MOMENT</span><h2>发布一篇笔记</h2></div><button className="close" onClick={onClose}>×</button></div>
      <label className="upload-zone"><input type="file" accept="image/*" multiple /><span className="upload-icon">＋</span><b>添加图片或视频</b><small>记录那些想分享的生活片段</small></label>
      <input className="title-input" placeholder="填写标题，会有更多人看见" maxLength={40} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="这一刻，你想说些什么？" />
      <div className="modal-bottom"><span>{text.length}/1000　# 添加话题</span><button onClick={onClose}>暂存草稿</button><button className="publish" onClick={onClose}>发布笔记</button></div>
    </section>
  </div>;
}

function Detail({ post, onClose }: { post: Post; onClose: () => void }) {
  const liked = useFeed((state) => state.liked.has(post.id));
  const toggleLike = useFeed((state) => state.toggleLike);
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="detail-modal"><button className="close detail-close" onClick={onClose}>×</button><img src={post.image} alt={post.title} /><div className="detail-copy"><div className="author"><img src={post.avatar} alt="" /><span>{post.author}</span><button>关注</button></div><h2>{post.title}</h2><p>把平凡的日子认真收好，偶尔回看，也会发现一路上有很多温柔的小事。</p><div className="detail-replies">评论　<span>还没有评论，来聊两句吧</span></div><button className={`detail-like ${liked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>{liked ? '♥ 已喜欢' : '♡ 喜欢'}　{post.likes.toLocaleString()}</button></div></section></div>;
}

export default function App() {
  const posts = useFeed((state) => state.posts);
  const query = useFeed((state) => state.query);
  const setQuery = useFeed((state) => state.setQuery);
  const loading = useFeed((state) => state.loading);
  const loadMore = useFeed((state) => state.loadMore);
  const refresh = useFeed((state) => state.refresh);
  const sentinel = useRef<HTMLDivElement>(null);
  const touchY = useRef(0);
  const [publish, setPublish] = useState(false);
  const [detail, setDetail] = useState<Post | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? posts.filter((post) => `${post.title} ${post.author} ${post.tag}`.toLowerCase().includes(q)) : posts;
  }, [posts, query]);
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) void loadMore(); }, { rootMargin: '420px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);
  const onTouchStart = (event: TouchEvent<HTMLElement>) => { if (event.currentTarget.scrollTop === 0) touchY.current = event.touches[0].clientY; };
  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const delta = event.changedTouches[0].clientY - touchY.current;
    if (touchY.current && delta > 75 && event.currentTarget.scrollTop === 0 && !refreshing) {
      setRefreshing(true); void refresh().finally(() => setRefreshing(false));
    }
    touchY.current = 0;
  };
  return <div className="app-shell min-h-screen bg-[#f5f5f5] text-[#252728]">
    <header className="topbar sticky top-0 z-40 flex items-center bg-white"><a className="logo" href="#top" aria-label="小蓝书首页">小蓝书<span>BLUEBOOK</span></a>
      <form className="search" onSubmit={(e) => e.preventDefault()}><span className="search-icon">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索你感兴趣的内容" /><button aria-label="清空搜索" type="button" onClick={() => setQuery('')}>{query ? '×' : '⌕'}</button></form>
      <button className="publish-button" onClick={() => setPublish(true)}><span>＋</span> 发布笔记</button>
    </header>
    <div className="categorybar sticky z-30 flex items-center bg-white"><button className="selected">发现</button><button>推荐</button><button>旅行</button><button>穿搭</button><button>美食</button><button>居家</button><button>摄影</button><span className="category-extra">生活的灵感，在这里发生</span></div>
    <main className="feed-scroll overflow-auto" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={`refresh-indicator ${refreshing || loading ? 'visible' : ''}`}><span className="spinner" />{refreshing ? '正在为你刷新' : '正在加载新灵感'}</div>
      <section className="feed-grid mx-auto" aria-label="生活灵感瀑布流">{visible.map((post) => <PostCard key={post.id} post={post} onOpen={setDetail} />)}</section>
      {query && visible.length === 0 && <div className="empty">没有找到相关内容，换个词试试。</div>}
      {!query && <div ref={sentinel} className="load-more">{loading ? <><span className="spinner" /> 正在发现更多灵感…</> : '继续向下，遇见更多生活'}</div>}
    </main>
    {publish && <PublishModal onClose={() => setPublish(false)} />}
    {detail && <Detail post={detail} onClose={() => setDetail(null)} />}
  </div>;
}
