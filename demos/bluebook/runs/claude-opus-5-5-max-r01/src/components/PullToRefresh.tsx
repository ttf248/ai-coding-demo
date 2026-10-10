import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDownIcon } from './icons';

const THRESHOLD = 64;
const MAX_PULL = 110;
const HOLD = 52;

type Phase = 'idle' | 'pulling' | 'ready' | 'refreshing';

/** Touch pull-to-refresh at the top of the page; the indicator grows above the content. */
export default function PullToRefresh({ onRefresh, disabled, children }: { onRefresh: () => Promise<void>; disabled: boolean; children: ReactNode }) {
  const [distance, setDistance] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [dragging, setDragging] = useState(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;

  useEffect(() => {
    if (disabled) return;
    let startX = 0, startY = 0, tracking = false, pulling = false, current = 0;
    const onStart = (e: TouchEvent) => {
      if (phaseRef.current === 'refreshing' || window.scrollY > 0 || e.touches.length !== 1) return;
      tracking = true;
      pulling = false;
      current = 0;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (!tracking) return;
      const dy = e.touches[0].clientY - startY, dx = e.touches[0].clientX - startX;
      if (!pulling) {
        if (dy < 0 || Math.abs(dx) > Math.abs(dy) || window.scrollY > 0) {
          tracking = false;
          return;
        }
        if (dy < 6) return;
        pulling = true;
        setDragging(true);
      }
      if (e.cancelable) e.preventDefault();
      current = Math.min(MAX_PULL, Math.max(0, dy) * 0.5);
      setDistance(current);
      setPhase(current >= THRESHOLD ? 'ready' : 'pulling');
    };
    const onEnd = async () => {
      if (!tracking) return;
      tracking = false;
      if (!pulling) return;
      pulling = false;
      setDragging(false);
      if (current >= THRESHOLD) {
        setPhase('refreshing');
        setDistance(HOLD);
        try {
          await refreshRef.current();
        } finally {
          setPhase('idle');
          setDistance(0);
        }
      } else {
        setPhase('idle');
        setDistance(0);
      }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [disabled]);

  const label = phase === 'refreshing' ? '正在刷新…' : phase === 'ready' ? '松开立即刷新' : '下拉刷新';
  return (
    <>
      <div
        className="flex items-end justify-center overflow-hidden"
        style={{ height: distance, transition: dragging ? 'none' : 'height .3s ease' }}
        data-ptr-phase={phase}
        aria-hidden={phase === 'idle'}
      >
        <div className="flex h-12 items-center gap-2 text-xs text-gray-500">
          {phase === 'refreshing' ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand/25 border-t-brand" />
          ) : (
            <ArrowDownIcon className={`text-brand transition-transform duration-200 ${phase === 'ready' ? 'rotate-180' : ''}`} />
          )}
          <span>{label}</span>
        </div>
      </div>
      {children}
    </>
  );
}
