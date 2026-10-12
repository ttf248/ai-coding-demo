export default function Loading({ text = '加载中…' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400" role="status" data-testid="loading">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
      {text}
    </div>
  )
}
