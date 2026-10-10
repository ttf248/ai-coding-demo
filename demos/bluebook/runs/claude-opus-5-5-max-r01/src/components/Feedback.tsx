import { useEffect, useState } from 'react';
import { useFeedStore } from '../store/useFeedStore';
import { ArrowUpIcon } from './icons';

export function Toast() {
  const toast = useFeedStore((s) => s.toast);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed left-1/2 top-28 z-[60] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 px-4 py-2 text-sm text-white shadow-lg transition duration-300 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}
    >
      {toast?.text}
    </div>
  );
}

export function BackToTop({ hidden }: { hidden: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="回到顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-card-hover transition duration-300 active:scale-90 md:right-8 ${show && !hidden ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
    >
      <ArrowUpIcon />
    </button>
  );
}
