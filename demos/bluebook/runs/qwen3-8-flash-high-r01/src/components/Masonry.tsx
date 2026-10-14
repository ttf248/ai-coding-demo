import { useLayoutEffect, useRef, useState } from "react";
import { MockPost } from "../data/mock";
import PostCard from "./PostCard";

const GAP = 10;
const EXTRA_H = 84; // 标题 + 作者行的大致高度

function columnCountFor(width: number): number {
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  return 2;
}

interface Props {
  posts: MockPost[];
}

/** 按已知图片比例做“最短列优先”的瀑布流分配：移动端 2 列、平板 3 列、桌面 4 列 */
export default function Masonry({ posts }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, count: 2 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth;
      setSize({ width, count: columnCountFor(width) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const colW =
    size.width > 0
      ? (size.width - GAP * (size.count - 1)) / size.count
      : (375 - 24 - GAP) / 2;

  const cols: { posts: MockPost[]; h: number[] }[] = Array.from(
    { length: size.count },
    () => ({ posts: [], h: [] }),
  );
  const heights = new Array(size.count).fill(0);
  for (const p of posts) {
    let c = 0;
    for (let i = 1; i < heights.length; i++)
      if (heights[i] < heights[c]) c = i;
    const imgPx = Math.round((p.imageHeight / 300) * colW);
    cols[c].posts.push(p);
    cols[c].h.push(imgPx);
    heights[c] += imgPx + EXTRA_H + GAP;
  }

  return (
    <div ref={ref} className="flex items-start" style={{ gap: GAP }}>
      {cols.map((col, i) => (
        <div
          key={i}
          className="flex min-w-0 flex-col"
          style={{ width: `${100 / size.count}%`, gap: GAP }}
        >
          {col.posts.map((p, j) => (
            <PostCard key={p.id} post={p} imagePx={col.h[j]} />
          ))}
        </div>
      ))}
    </div>
  );
}
