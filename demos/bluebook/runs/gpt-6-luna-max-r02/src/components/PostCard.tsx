import LazyLoad from 'react-lazyload';
import type { SyntheticEvent } from 'react';
import type { Post } from '../data';
import { useFeed } from '../store';

export default function PostCard({ post }: { post: Post }) {
  const liked = useFeed((s) => s.likes.has(post.id)), toggleLike = useFeed((s) => s.toggleLike);
  const failed = (event: SyntheticEvent<HTMLImageElement>) => { event.currentTarget.style.opacity = '0'; event.currentTarget.parentElement?.classList.add('image-fallback'); };
  return <article className="post-card"><button className="image-wrap" aria-label={`打开：${post.title}`}><LazyLoad height={210} offset={180} once><img src={post.image} alt={post.title} onError={failed} style={{ aspectRatio: post.ratio }} /><span className="image-shade" /><span className="save-label">收藏灵感</span></LazyLoad></button><div className="post-copy"><h2>{post.title}</h2><div className="post-meta"><span className="author"><i style={{ background: post.color }}>{post.initials}</i><span>{post.author}</span></span><button className={`like-button ${liked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)} aria-label={liked ? '取消点赞' : '点赞'}><span className="heart">♥</span><span>{(post.likes + Number(liked)).toLocaleString()}</span></button></div></div></article>;
}
