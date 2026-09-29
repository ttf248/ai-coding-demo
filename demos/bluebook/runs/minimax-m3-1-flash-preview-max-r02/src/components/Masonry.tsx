import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const GAP = 8;
/** 卡片底部信息区固定高度：两行标题 + 一行作者/点赞。 */
const META_HEIGHT = 96;

interface Props<T> {
  items: T[];
  getKey: (item: T) => string;
  /** 宽高比（宽 / 高），用于在图片加载前就算出卡片高度。 */
  getRatio: (item: T) => number;
  renderItem: (item: T, width: number) => ReactNode;
  className?: string;
}

/**
 * 绝对定位瀑布流：按容器宽度换算列数（2 / 3 / 4），
 * 每张卡片放进当前最矮的一列，高度由 mock 数据的宽高比直接算出，
 * 因此图片未加载时布局就已经确定，不会出现跳动。
 */
export default function Masonry<T>({ items, getKey, getRatio, renderItem, className = "" }: Props<T>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      setWidth((prev) => (Math.abs(prev - next) > 1 ? next : prev));
    });
    observer.observe(node);
    setWidth(node.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    if (!width) return { height: 0, columnWidth: 0, nodes: [] as Array<{ item: T; x: number; y: number; width: number }> };
    const columns = width < 640 ? 2 : width < 1024 ? 3 : 4;
    const columnWidth = (width - GAP * (columns - 1)) / columns;
    const heights = new Array<number>(columns).fill(0);
    const nodes = items.map((item) => {
      let target = 0;
      for (let i = 1; i < columns; i += 1) if (heights[i] < heights[target]) target = i;
      const imageHeight = columnWidth / getRatio(item);
      const x = target * (columnWidth + GAP);
      const y = heights[target];
      heights[target] = y + imageHeight + META_HEIGHT + GAP;
      return { item, x, y, width: columnWidth };
    });
    return { height: Math.max(...heights, 0), columnWidth, nodes };
  }, [items, width, getRatio]);

  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ height: layout.height }}>
      {layout.nodes.map(({ item, x, y, width: w }) => (
        <div key={getKey(item)} className="absolute" style={{ transform: `translate3d(${x}px, ${y}px, 0)`, width: w }}>
          {renderItem(item, w)}
        </div>
      ))}
    </div>
  );
}
