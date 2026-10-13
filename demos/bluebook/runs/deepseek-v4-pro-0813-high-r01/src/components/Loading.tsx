export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
      <div className="spinner" />
      <span className="text-xs">加载中…</span>
    </div>
  )
}
