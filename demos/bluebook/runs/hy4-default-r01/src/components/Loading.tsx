interface LoadingProps {
  label?: string;
}

export function Loading({ label = "正在加载更多内容…" }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-[12px] text-slate-400">
      <span className="spinner inline-block h-4 w-4 rounded-full border-2 border-brand/25 border-t-brand" />
      <span>{label}</span>
    </div>
  );
}
