/** 加载中的骨架卡片，高度可变化以贴合瀑布流排版 */
export function SkeletonCard({ height = 220 }: { height?: number }) {
  return (
    <div className="mb-2 break-inside-avoid overflow-hidden rounded-card bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:mb-3">
      <div className="skeleton w-full" style={{ height }} />
      <div className="space-y-2 p-2.5 sm:p-3">
        <div className="skeleton h-3.5 w-full rounded" />
        <div className="skeleton h-3.5 w-2/3 rounded" />
        <div className="flex items-center gap-2 pt-1">
          <div className="skeleton h-6 w-6 rounded-full" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}
