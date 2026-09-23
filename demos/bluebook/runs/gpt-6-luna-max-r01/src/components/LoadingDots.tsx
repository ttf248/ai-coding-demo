interface LoadingDotsProps {
  label?: string;
  compact?: boolean;
}

export default function LoadingDots({ label = '正在加载更多灵感', compact = false }: LoadingDotsProps) {
  return (
    <div className={`loading-dots flex items-center justify-center gap-3 text-[13px] text-[#a09da5] ${compact ? 'gap-2' : ''}`} role="status" aria-live="polite">
      <span className="flex items-center gap-1" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>{label}</span>
    </div>
  );
}
