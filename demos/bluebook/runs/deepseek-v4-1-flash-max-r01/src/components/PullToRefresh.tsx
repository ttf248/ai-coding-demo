import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useFeedStore } from "../store";
import Spinner from "./Spinner";

const THRESHOLD = 70;
const MAX_PULL = 110;

/** 应用内下拉刷新：页面在顶部时下拉超过阈值即触发 refresh() */
export default function PullToRefresh({ children }: { children: ReactNode }) {
  const refresh = useFeedStore((s) => s.refresh);
  const refreshing = useFeedStore((s) => s.refreshing);
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pullRef = useRef(0);
  pullRef.current = pull;

  const atTop = () => (window.scrollY || document.documentElement.scrollTop || 0) <= 0;

  /* 触摸（移动端）：必须用原生非 passive 监听，否则 preventDefault 无效 */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      startY.current = atTop() ? e.touches[0].clientY : null;
    };
    const onMove = (e: TouchEvent) => {
      if (startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0 && atTop()) {
        if (e.cancelable) e.preventDefault();
        setPull(Math.min(MAX_PULL, dy * 0.5));
      } else if (dy <= 0) {
        startY.current = null;
        setPull(0);
      }
    };
    const onEnd = () => {
      if (pullRef.current >= THRESHOLD) refresh();
      startY.current = null;
      setPull(0);
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [refresh]);

  /* 指针（鼠标拖动，同样可验证） */
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    startY.current = atTop() ? e.clientY : null;
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || startY.current == null) return;
    const dy = e.clientY - startY.current;
    if (dy > 0 && atTop()) setPull(Math.min(MAX_PULL, dy * 0.5));
    else if (dy <= 0) {
      startY.current = null;
      setPull(0);
    }
  };
  const onPointerUp = () => {
    if (startY.current == null) return;
    if (pull >= THRESHOLD) refresh();
    startY.current = null;
    setPull(0);
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ touchAction: "pan-y" }}
    >
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-150"
        style={{ height: refreshing ? 46 : pull }}
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-xs text-gray-500 h-11">
          <Spinner className={refreshing ? "" : "border-gray-200 border-t-gray-400"} />
          {refreshing ? "正在刷新…" : pull >= THRESHOLD ? "松开立即刷新" : "下拉刷新"}
        </div>
      </div>
      {children}
    </div>
  );
}
