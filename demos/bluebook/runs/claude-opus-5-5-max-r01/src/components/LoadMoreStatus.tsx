interface Props {
  status: 'idle' | 'loading' | 'refreshing' | 'error';
  hasMore: boolean;
  error: string | null;
  empty: boolean;
  onRetry: () => void;
}

export function LoadingDots({ label = '正在加载' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-gray-400" role="status">
      <span className="inline-flex gap-1">
        {[0, 1, 2].map((i) => (
          <i key={i} className="block h-2 w-2 animate-dot-bounce rounded-full bg-brand" style={{ animationDelay: `${i * 0.16}s` }} />
        ))}
      </span>
      {label}
    </span>
  );
}

/** Footer below the waterfall: loading animation, retry, or the end-of-feed note. */
export default function LoadMoreStatus({ status, hasMore, error, empty, onRetry }: Props) {
  let content = null;
  if (status === 'error') {
    content = (
      <button type="button" onClick={onRetry} className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 active:scale-95">
        {error ?? '加载失败'}，重试
      </button>
    );
  } else if (status === 'loading') {
    content = <LoadingDots />;
  } else if (!hasMore && !empty) {
    content = <span className="text-xs text-gray-400">— 已经到底啦，去别的频道看看吧 —</span>;
  }
  return <div className="flex h-16 items-center justify-center" data-load-state={status === 'loading' ? 'loading' : hasMore ? 'more' : 'end'}>{content}</div>;
}
