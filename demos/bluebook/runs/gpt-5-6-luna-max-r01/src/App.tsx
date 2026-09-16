import {
  type FormEvent,
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LazyLoad from "react-lazyload";

type Post = {
  id: number;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  image: string;
  topic: string;
  height: "short" | "medium" | "tall";
};

const image = (id: number) => `${import.meta.env.BASE_URL}images/${id}.jpg`;
const topics = ["全部", "城市漫游", "居家灵感", "一人食", "穿搭", "旅行"];

const seedPosts: Post[] = [
  ["雨后去看一场城市的晚霞", "林檎", "LM", 1280, 1, "城市漫游", "tall"],
  ["一盏灯，把夜晚变成自己的房间", "Mori", "MO", 932, 2, "居家灵感", "medium"],
  ["周末的奶油蘑菇意面", "小满食记", "SM", 2480, 3, "一人食", "short"],
  ["亚麻衬衫的三种松弛穿法", "Rita", "RI", 761, 4, "穿搭", "tall"],
  ["沿着海岸线慢慢走，不赶下一班车", "南枝", "NZ", 3100, 5, "旅行", "medium"],
  ["给出租屋加一点木头和绿色", "阿禾", "AH", 543, 6, "居家灵感", "tall"],
  ["咖啡店窗边的位置永远留给晴天", "Coco", "CO", 1900, 7, "城市漫游", "short"],
  ["今天也要好好吃饭呀", "橘子汽水", "JS", 841, 8, "一人食", "medium"],
  ["旅行箱里最值得带的五件小物", "慢慢游", "MY", 622, 1, "旅行", "tall"],
  ["灰蓝色，是秋天的情绪滤镜", "小麦", "XM", 1260, 2, "穿搭", "short"],
  ["把阳台变成十分钟阅读角", "木子", "MZ", 416, 3, "居家灵感", "medium"],
  ["巷子尽头的面包店八点刚出炉", "Baker 07", "B7", 2980, 4, "城市漫游", "tall"],
  ["番茄、罗勒和一张旧唱片", "食光切片", "SG", 733, 5, "一人食", "short"],
  ["去山里住两晚，带上这份清单", "未完旅程", "WJ", 1090, 6, "旅行", "medium"],
  ["不费力的黑白配色", "Nina", "NI", 568, 7, "穿搭", "tall"],
  ["留一面墙，给还没发生的故事", "白噪音", "BY", 334, 8, "居家灵感", "medium"],
  ["晚风里散步的 4 个小路线", "街角观察员", "JG", 1800, 1, "城市漫游", "short"],
  ["砂锅里咕嘟咕嘟的冬阴功", "今天吃什么", "JC", 920, 2, "一人食", "tall"],
  ["把假期穿在身上", "云朵衣橱", "YD", 1440, 3, "穿搭", "medium"],
  ["一场没有计划的周五出发", "即刻远方", "KF", 2100, 4, "旅行", "tall"],
  ["花瓶里只放一枝花也很好看", "Yuki", "YU", 427, 5, "居家灵感", "short"],
  ["城市高架下的黄昏色块", "拾光者", "SG", 876, 6, "城市漫游", "medium"],
  ["十分钟做好一碗热汤面", "厨房边角", "CF", 1520, 7, "一人食", "short"],
  ["针织衫的温柔层次", "Mia", "MI", 643, 8, "穿搭", "tall"],
  ["把海风装进透明玻璃瓶", "海边邮局", "HB", 2340, 1, "旅行", "medium"],
  ["一张桌子的日常收纳", "住在当下", "ZD", 512, 2, "居家灵感", "short"],
  ["黄昏时分的红砖街区", "散步地图", "SB", 1180, 3, "城市漫游", "tall"],
  ["给自己做一份周日晚餐", "独食日记", "DS", 808, 4, "一人食", "medium"],
  ["白 T 恤也可以有很多表情", "衣橱实验室", "YC", 710, 5, "穿搭", "short"],
  ["住进一间有天窗的小屋", "去看云", "QY", 3650, 6, "旅行", "tall"],
  ["窗帘拉开，春天就进来了", "小房间计划", "XF", 488, 7, "居家灵感", "medium"],
  ["夜骑经过的蓝色便利店", "城市夜航", "CY", 955, 8, "城市漫游", "short"],
].map(([title, author, avatar, likes, imageId, topic, height], index) => ({
  id: index + 1,
  title: title as string,
  author: author as string,
  avatar: avatar as string,
  likes: likes as number,
  image: image(imageId as number),
  topic: topic as string,
  height: height as Post["height"],
}));

function Icon({ name }: { name: "search" | "plus" | "heart" | "bookmark" | "close" | "spark" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    heart: <path d="M20.8 8.7c0 5.1-8.8 10.1-8.8 10.1S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />,
    bookmark: <path d="M6 4.7A1.7 1.7 0 0 1 7.7 3h8.6A1.7 1.7 0 0 1 18 4.7V21l-6-3.5L6 21Z" />,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    spark: <><path d="m12 3-1.3 5.7L5 10l5.7 1.3L12 17l1.3-5.7L19 10l-5.7-1.3Z" /><path d="m19 16-.6 2.4L16 19l2.4.6L19 22l.6-2.4Z" /></>,
  };
  return <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function PostCard({ post, liked, activeLike, onLike, onOpen }: {
  post: Post;
  liked: boolean;
  activeLike: boolean;
  onLike: () => void;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <article className="post-card" onClick={onOpen}>
      <div className={`post-image post-image-${post.height}`}>
        <LazyLoad once offset={420} height={140} placeholder={<div className="image-skeleton" />}>
          {failed ? (
            <div className="image-fallback"><Icon name="spark" /><span>小蓝书记录中</span></div>
          ) : (
            <img src={post.image} alt={post.title} loading="lazy" onError={() => setFailed(true)} />
          )}
        </LazyLoad>
        <button className={`image-save ${liked ? "is-saved" : ""}`} type="button" aria-label="收藏" onClick={(event) => { event.stopPropagation(); onLike(); }}>
          <Icon name="bookmark" />
        </button>
      </div>
      <div className="post-copy">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span className="avatar">{post.avatar}</span>
          <span className="author">{post.author}</span>
          <button className={`like-button ${liked ? "is-liked" : ""} ${activeLike ? "like-pop" : ""}`} type="button" onClick={(event) => { event.stopPropagation(); onLike(); }} aria-label={liked ? "取消点赞" : "点赞"}>
            <Icon name="heart" />
            <span>{post.likes + (liked ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("全部");
  const [visible, setVisible] = useState(20);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(seedPosts);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [activeLike, setActiveLike] = useState<number | null>(null);
  const [selected, setSelected] = useState<Post | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const refreshStart = useRef<number | null>(null);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const topicMatch = activeTopic === "全部" || post.topic === activeTopic;
      const queryMatch = !normalized || `${post.title}${post.author}${post.topic}`.toLowerCase().includes(normalized);
      return topicMatch && queryMatch;
    });
  }, [activeTopic, posts, query]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  useEffect(() => {
    setVisible(20);
  }, [activeTopic, query]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) loadMore();
    }, { rootMargin: "260px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    window.setTimeout(() => {
      setVisible((current) => Math.min(current + 8, filtered.length));
      setLoading(false);
    }, 560);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (window.scrollY < 20) refreshStart.current = event.clientY;
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (refreshStart.current !== null && event.clientY - refreshStart.current > 70) {
      setRefreshing(true);
      window.setTimeout(() => {
        setPosts((current) => [...current].sort(() => Math.random() - 0.5));
        setRefreshing(false);
        setToast("已刷新，看看新的灵感");
      }, 650);
    }
    refreshStart.current = null;
  }

  function toggleLike(id: number) {
    setLiked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setActiveLike(id);
    window.setTimeout(() => setActiveLike(null), 420);
  }

  function publish(event: FormEvent) {
    event.preventDefault();
    const title = draftTitle.trim();
    if (!title) return;
    const post: Post = { id: Date.now(), title, author: "今天的我", avatar: "我", likes: 0, image: image(8), topic: "居家灵感", height: "medium" };
    setPosts((current) => [post, ...current]);
    setDraftTitle("");
    setPublishOpen(false);
    setToast("笔记已发布");
  }

  return (
    <div className="app-shell" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <header className="topbar">
        <div className="brand"><span className="brand-mark">小</span><span>小蓝书</span><small>BLUEBOOK</small></div>
        <div className="search-wrap">
          <Icon name="search" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索你感兴趣的内容" aria-label="搜索" />
          {query && <button type="button" className="clear-search" onClick={() => setQuery("")}><Icon name="close" /></button>}
        </div>
        <button className="publish-button" type="button" onClick={() => setPublishOpen(true)}><Icon name="plus" /><span>发布</span></button>
      </header>

      <main>
        <section className="hero-row">
          <div>
            <p className="eyebrow"><span className="live-dot" /> DAILY NOTE · 09.16</p>
            <h1>今天，发现一点<br /><em>让你心动的东西。</em></h1>
          </div>
          <div className="hero-note"><Icon name="spark" /><span>分享生活<br />也收藏灵感</span></div>
        </section>
        <nav className="topic-nav" aria-label="主题筛选">
          {topics.map((topic) => <button key={topic} className={activeTopic === topic ? "active" : ""} type="button" onClick={() => setActiveTopic(topic)}>{topic}</button>)}
        </nav>

        {refreshing && <div className="refresh-indicator"><span className="spinner" /> 正在找新的灵感</div>}
        <section className="feed" aria-live="polite">
          {shown.map((post) => <PostCard key={post.id} post={post} liked={liked.has(post.id)} activeLike={activeLike === post.id} onLike={() => toggleLike(post.id)} onOpen={() => setSelected(post)} />)}
        </section>
        <div ref={sentinel} className="load-sentinel">
          {loading && <><span className="spinner" /> 正在加载更多</>}
          {!loading && hasMore && <button type="button" className="load-button" onClick={loadMore}>继续发现 <span>↓</span></button>}
          {!loading && !hasMore && <span>今天先看到这里 · 明天见</span>}
        </div>
      </main>

      <footer className="bottom-note"><span>小蓝书</span><span>把平凡日子，收藏成喜欢。</span><span>↗</span></footer>

      {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><div className="detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="关闭"><Icon name="close" /></button>
        <div className="detail-image"><img src={selected.image} alt="" /></div>
        <div className="detail-copy"><p className="eyebrow">{selected.topic} · NOTE {String(selected.id).padStart(2, "0")}</p><h2>{selected.title}</h2><p>记录这一刻的光线、味道和心情。喜欢的生活，值得被认真收藏。</p><div className="detail-author"><span className="avatar">{selected.avatar}</span><b>{selected.author}</b><button type="button" onClick={() => toggleLike(selected.id)} className={liked.has(selected.id) ? "is-liked" : ""}><Icon name="heart" /> {selected.likes + (liked.has(selected.id) ? 1 : 0)}</button></div></div>
      </div></div>}

      {publishOpen && <div className="modal-backdrop" role="presentation" onClick={() => setPublishOpen(false)}><form className="publish-modal" onSubmit={publish} onClick={(event) => event.stopPropagation()}><div className="modal-heading"><div><p className="eyebrow">NEW NOTE</p><h2>分享今天的灵感</h2></div><button className="modal-close inline" type="button" onClick={() => setPublishOpen(false)} aria-label="关闭"><Icon name="close" /></button></div><label>标题<input autoFocus value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="写下这一刻…" /></label><div className="publish-preview"><Icon name="spark" /><span>这条笔记会出现在「居家灵感」</span></div><button className="submit-button" type="submit">发布笔记 <span>↗</span></button></form></div>}
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </div>
  );
}
