export const Loading = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="w-6 h-6 border-2 border-redbook/20 border-t-redbook rounded-full spinner" />
      <span className="text-gray-500 text-sm">加载中...</span>
    </div>
  )
}
