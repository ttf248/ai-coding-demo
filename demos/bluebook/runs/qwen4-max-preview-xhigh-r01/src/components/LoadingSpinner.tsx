export default function LoadingSpinner({ label = "加载中…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-5 text-sm text-neutral-400" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {label}
    </div>
  );
}