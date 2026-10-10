import { useEffect, useMemo, useState } from 'react';
import { useFeedStore } from '../store/useFeedStore';
import { AUTHORS, COMMENTS } from '../mock/data';
import { backToFeed } from '../router';
import { assetUrl, FALLBACK_IMAGE, formatCount, formatDate } from '../utils';
import Avatar from './Avatar';
import LikeButton from './LikeButton';
import { BackIcon, ChatIcon, CloseIcon, StarIcon } from './icons';

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

function DetailImage({ src, width, height, alt }: { src: string; width: number; height: number; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed ? FALLBACK_IMAGE : assetUrl(src)}
      alt={alt}
      onError={() => setFailed(true)}
      style={{ aspectRatio: `${width} / ${height}` }}
      className="block h-auto w-full bg-gray-100 md:h-full md:max-h-[86vh] md:object-contain md:[aspect-ratio:auto]"
    />
  );
}

export default function NoteDetail({ id }: { id: string }) {
  const items = useFeedStore((s) => s.items);
  const published = useFeedStore((s) => s.published);
  const showToast = useFeedStore((s) => s.showToast);
  const note = useMemo(() => useFeedStore.getState().getNote(id), [id, items, published]);
  const [following, setFollowing] = useState(false);
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && backToFeed();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const comments = useMemo(() => {
    const h = hash(id);
    const count = note?.published ? 0 : 3 + (h % 3);
    return Array.from({ length: count }, (_, i) => ({ author: AUTHORS[(h >>> (i * 3)) % AUTHORS.length], text: COMMENTS[(h + i * 5) % COMMENTS.length], likes: (h >>> i) % 90 }));
  }, [id, note?.published]);

  if (!note) {
    return (
      <div className="fixed inset-0 z-40 flex animate-fade-in flex-col items-center justify-center gap-3 bg-white text-gray-500">
        <p>笔记不存在或已被删除</p>
        <button type="button" onClick={backToFeed} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white">返回首页</button>
      </div>
    );
  }

  const follow = (
    <button
      type="button"
      onClick={() => setFollowing((v) => !v)}
      className={`ml-auto shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition active:scale-95 ${following ? 'bg-gray-100 text-gray-500' : 'bg-brand text-white'}`}
    >
      {following ? '已关注' : '关注'}
    </button>
  );

  return (
    <div className="fixed inset-0 z-40 animate-fade-in overflow-y-auto overscroll-contain bg-white md:bg-black/45 md:p-6" role="dialog" aria-modal="true" aria-label={note.title} onClick={(e) => e.target === e.currentTarget && backToFeed()}>
      <article className="mx-auto min-h-full bg-white md:flex md:min-h-0 md:max-w-5xl md:overflow-hidden md:rounded-2xl md:shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-black/5 bg-white/95 px-2 pb-2 backdrop-blur md:hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)' }}>
          <button type="button" onClick={backToFeed} aria-label="返回" className="rounded-full p-1.5 text-gray-700 active:bg-gray-100">
            <BackIcon />
          </button>
          <Avatar author={note.author} size={32} />
          <span className="truncate text-sm font-medium text-gray-800">{note.author.name}</span>
          {follow}
        </div>

        <div className="bg-gray-50 md:flex md:w-[58%] md:items-center md:justify-center">
          <DetailImage src={note.image} width={note.width} height={note.height} alt={note.title} />
        </div>

        <div className="flex flex-col md:max-h-[86vh] md:w-[42%]">
          <div className="hidden items-center gap-2 border-b border-black/5 px-5 py-4 md:flex">
            <Avatar author={note.author} size={36} />
            <span className="truncate font-medium text-gray-800">{note.author.name}</span>
            {follow}
            <button type="button" onClick={backToFeed} aria-label="关闭" className="ml-1 rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
              <CloseIcon size={20} />
            </button>
          </div>

          <div className="flex-1 px-4 py-4 md:overflow-y-auto md:px-5">
            <h1 className="text-lg font-semibold leading-snug text-gray-900">{note.title}</h1>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-7 text-gray-700">{note.desc}</p>
            <p className="mt-2 flex flex-wrap gap-x-2 text-[15px] text-[#13386c]">
              {note.tags.map((t) => <span key={t}>#{t}</span>)}
            </p>
            <p className="mt-3 text-xs text-gray-400">{note.published ? '刚刚' : formatDate(note.createdAt)} · 发布于小蓝书</p>

            <div className="mt-4 border-t border-black/5 pt-4">
              <h2 className="text-sm text-gray-500">共 {comments.length ? formatCount(note.comments || comments.length) : 0} 条评论</h2>
              {comments.length === 0 && <p className="py-6 text-center text-sm text-gray-400">还没有评论，快来抢沙发～</p>}
              <ul className="mt-3 space-y-4">
                {comments.map((c, i) => (
                  <li key={i} className="flex gap-2.5">
                    <Avatar author={c.author} size={30} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">{c.author.name}</p>
                      <p className="mt-0.5 text-sm text-gray-800">{c.text}</p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">♡ {c.likes}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sticky bottom-0 flex items-center gap-4 border-t border-black/5 bg-white px-4 py-2.5" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}>
            <button type="button" onClick={() => showToast('评论功能为演示占位')} className="h-9 min-w-0 flex-1 truncate rounded-full bg-gray-100 px-4 text-left text-sm text-gray-400">
              说点什么…
            </button>
            <LikeButton id={note.id} count={note.likes} size="lg" />
            <button
              type="button"
              aria-pressed={collected}
              onClick={() => {
                setCollected((v) => !v);
                showToast(collected ? '已取消收藏' : '已收藏');
              }}
              className={`inline-flex items-center gap-1 text-sm ${collected ? 'text-amber-400' : 'text-gray-500'}`}
            >
              <StarIcon filled={collected} />
              <span className="tabular-nums">{formatCount(note.collects + (collected ? 1 : 0))}</span>
            </button>
            <span className="inline-flex items-center gap-1 text-sm text-gray-500">
              <ChatIcon />
              <span className="tabular-nums">{formatCount(note.comments)}</span>
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
