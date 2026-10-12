import { useEffect, useRef, useState } from 'react'

/** 移动端 2 列，平板（≥768px）3 列，桌面（≥1100px）4 列 */
export function useColumns(): number {
  const calc = () => (window.innerWidth >= 1100 ? 4 : window.innerWidth >= 768 ? 3 : 2)
  const [cols, setCols] = useState(calc)
  useEffect(() => {
    const onResize = () => setCols(calc())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return cols
}

/** 滚动到底部（哨兵元素进入视口）时触发 */
export function useBottomSentinel(onHit: () => void, deps: unknown[]) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onHit()
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

/** 下拉刷新：页面位于顶部时向下拖动超过阈值触发；同时支持触摸与鼠标 */
export function usePullToRefresh(onRefresh: () => Promise<void>, threshold = 70) {
  const [pull, setPull] = useState(0)
  const [busy, setBusy] = useState(false)
  const start = useRef<number | null>(null)
  const pullRef = useRef(0)
  const busyRef = useRef(false)
  const cb = useRef(onRefresh)
  cb.current = onRefresh

  useEffect(() => {
    const begin = (y: number) => {
      if (busyRef.current || window.scrollY > 0) return
      start.current = y
    }
    const move = (y: number, e?: Event) => {
      if (start.current === null || busyRef.current) return
      const dy = y - start.current
      if (dy <= 0) {
        pullRef.current = 0
        setPull(0)
        return
      }
      if (window.scrollY > 0) {
        start.current = null
        return
      }
      if (e && e.cancelable) e.preventDefault()
      pullRef.current = Math.min(110, dy * 0.5)
      setPull(pullRef.current)
    }
    const end = async () => {
      if (start.current === null) return
      start.current = null
      if (pullRef.current >= threshold * 0.6) {
        busyRef.current = true
        setBusy(true)
        setPull(48)
        await cb.current()
        busyRef.current = false
        setBusy(false)
      }
      pullRef.current = 0
      setPull(0)
    }
    const ts = (e: TouchEvent) => begin(e.touches[0].clientY)
    const tm = (e: TouchEvent) => move(e.touches[0].clientY, e)
    const ms = (e: MouseEvent) => {
      if (e.button === 0) begin(e.clientY)
    }
    const mm = (e: MouseEvent) => {
      if (e.buttons === 1) move(e.clientY)
    }
    window.addEventListener('touchstart', ts, { passive: true })
    window.addEventListener('touchmove', tm, { passive: false })
    window.addEventListener('touchend', end)
    window.addEventListener('touchcancel', end)
    window.addEventListener('mousedown', ms)
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', end)
    return () => {
      window.removeEventListener('touchstart', ts)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend', end)
      window.removeEventListener('touchcancel', end)
      window.removeEventListener('mousedown', ms)
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup', end)
    }
  }, [threshold])

  return { pull, busy }
}
