export default function SearchBar({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto flex items-center gap-2 px-3 py-2">
        <span className="font-bold text-lg" style={{ color: '#fe2c55' }}>
          小蓝书
        </span>
        <div className="flex-1 flex items-center gap-2 bg-[#f5f5f5] rounded-full px-3 py-1.5">
          <span>🔍</span>
          <input
            className="bg-transparent outline-none flex-1 text-sm"
            placeholder="搜索你感兴趣的内容"
          />
        </div>
        <button
          className="text-white text-sm rounded-full px-4 py-1.5"
          style={{ background: '#fe2c55' }}
          onClick={onRefresh}
        >
          发布
        </button>
      </div>
    </div>
  );
}
