export default function LoadingMore({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-[13px] text-[#8a8f99]">
      <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-primary/30 border-t-primary" />
      <span>正在加载更多…</span>
    </div>
  );
}
