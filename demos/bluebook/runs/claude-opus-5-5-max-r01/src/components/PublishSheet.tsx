import { useEffect, useState, type FormEvent } from 'react';
import { useFeedStore } from '../store/useFeedStore';
import { CATEGORIES, IMAGES } from '../mock/data';
import { assetUrl } from '../utils';
import { CloseIcon } from './icons';

export default function PublishSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const publish = useFeedStore((s) => s.publish);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const image = IMAGES[imageIndex];
  const categoryLabel = CATEGORIES.find((c) => c.id === image.category)?.label;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('请填写标题');
      return;
    }
    publish({ title: title.trim(), desc: desc.trim() || '分享一张喜欢的图片～', image, category: image.category });
    setTitle('');
    setDesc('');
    setError('');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-black/45 md:items-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-label="发布笔记"
        className="max-h-[92vh] w-full animate-sheet-up overflow-y-auto rounded-t-2xl bg-white p-4 md:max-w-lg md:rounded-2xl md:p-6"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">发布笔记</h2>
          <button type="button" onClick={onClose} aria-label="关闭" className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
            <CloseIcon size={20} />
          </button>
        </div>
        <p className="mb-2 text-sm text-gray-500">选择图片 · 已选「{categoryLabel}」</p>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {IMAGES.map((m, i) => (
            <button
              key={m.file}
              type="button"
              onClick={() => setImageIndex(i)}
              aria-label={`选择图片 ${i + 1}`}
              aria-pressed={i === imageIndex}
              className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-1 transition ${i === imageIndex ? 'ring-brand' : 'ring-transparent opacity-80'}`}
            >
              <img src={assetUrl(m.file)} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        <label className="mt-4 block">
          <span className="sr-only">标题</span>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            maxLength={40}
            placeholder="填写标题会有更多赞哦～"
            className="w-full border-b border-gray-200 py-2 text-base font-medium outline-none placeholder:text-gray-400 focus:border-brand"
          />
        </label>
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-brand">{error}</span>
          <span className="text-gray-400">{title.length}/40</span>
        </div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="添加正文"
          className="mt-2 w-full resize-none rounded-lg bg-gray-50 p-3 text-base outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-brand/30"
        />
        <button type="submit" className="mt-4 h-11 w-full rounded-full bg-brand text-base font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98]">
          发布笔记
        </button>
      </form>
    </div>
  );
}
