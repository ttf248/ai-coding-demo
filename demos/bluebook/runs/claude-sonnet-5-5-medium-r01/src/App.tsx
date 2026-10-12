import { useCallback, useEffect, useMemo, useState } from 'react'
import DetailPage from './components/DetailPage'
import Header from './components/Header'
import Loading from './components/Loading'
import Waterfall from './components/Waterfall'
import { useBottomSentinel, usePullToRefresh } from './hooks'
import { useFeedStore } from './store/useFeedStore'

export default function App() {
  const items = useFeedStore((s) => s.items)
  const query = useFeedStore((s) => s.query)
  const loading = useFeedStore((s) => s.loading)
  const refreshing = useFeedStore((s) => s.refreshing)
  const hasMore = useFeedStore((s) => s.hasMore)
  const selected = useFeedStore((s) => s.selected)
  const init = useFeedStore((s) => s.init)
  const loadMore = useFeedStore((s) => s.loadMore)
  const refresh = useFeedStore((s) => s.refresh)
  const select = useFeedStore((s) => s.select)
  const [toast, setToast] = useState('')

  useEffect(() => {
    init()
  }, [init])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((p) => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
  }, [items, query])

  const { pull, busy } = usePullToRefresh(refresh)
  const sentinel = useBottomSentinel(loadMore, [loadMore, items.length, loading, hasMore, refreshing])

  const publish = useCallback(() => {
    setToast('发布功能为演示占位，暂未实现')
    window.setTimeout(() => setToast(''), 1800)
  }, [])
  const close = useCallback(() => select(null), [select])

  return (
    <div className="min-h-screen animate-fade-in bg-page">
      <Header onPublish={publish} />

      <div
        className="pointer-events-none fixed left-0 right-0 z-20 flex justify-center transition-transform"
        style={{ top: 'calc(56px + env(safe-area-inset-top))', transform: `translateY(${pull - 40}px)`, opacity: pull > 4 || busy ? 1 : 0 }}
        aria-live="polite"
      >
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs text-gray-500 shadow">
          <span className={`h-4 w-4 rounded-full border-2 border-brand/30 border-t-brand ${busy || refreshing ? 'animate-spin' : ''}`} />
          {busy || refreshing ? '正在刷新…' : pull >= 42 ? '松开刷新' : '下拉刷新'}
        </div>
      </div>

      <main
        className="mx-auto max-w-[1280px] px-2 pb-8 pt-2 tablet:px-5 tablet:pt-4"
        style={{ transform: pull ? `translateY(${pull}px)` : undefined, transition: pull ? 'none' : 'transform 0.25s', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {visible.length === 0 ? (
          <p className="py-20 text-center text-sm text-gray-400">没有找到相关内容，换个关键词试试</p>
        ) : (
          <Waterfall items={visible} onOpen={select} />
        )}

        <div ref={sentinel} className="h-px" />
        {(loading || refreshing) && <Loading text={refreshing ? '正在刷新…' : '加载中…'} />}
        {!hasMore && !loading && <p className="py-6 text-center text-xs text-gray-400">— 已经到底啦 —</p>}
      </main>

      {selected && <DetailPage post={selected} onClose={close} />}

      {toast && (
        <div className="fixed bottom-10 left-1/2 z-[60] -translate-x-1/2 animate-fade-in rounded-full bg-black/75 px-4 py-2 text-sm text-white">
          {toast}
        </div>
      )}
    </div>
  )
}
