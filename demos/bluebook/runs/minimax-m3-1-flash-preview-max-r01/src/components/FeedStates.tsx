import { Spinner } from "./Icons";

export function LoadingMore() {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-[12px] text-neutral-400">
      <Spinner className="h-4 w-4 animate-spin-slow text-brand" />
      <span>正在加载更多…</span>
    </div>
  );
}

export function FeedEnd() {
  return (
    <div className="flex items-center justify-center gap-3 py-7 text-[12px] text-neutral-400">
      <span className="h-px w-10 bg-neutral-200" />
      <span>已经到底啦</span>
      <span className="h-px w-10 bg-neutral-200" />
    </div>
  );
}

export function EmptyState({ keyword }: { keyword: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-20 text-center">
      <p className="text-[14px] font-medium text-neutral-600">
        没有找到「{keyword}」
      </p>
      <p className="text-[12px] text-neutral-400">
        换个关键词试试，或清空搜索框回到瀑布流
      </p>
    </div>
  );
}
