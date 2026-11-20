import React, { useEffect, useMemo, useState } from "react";
import { NoteItem } from "../data/mockNotes";
import { NoteCard } from "./NoteCard";

interface MasonryGridProps {
  notes: NoteItem[];
}

function getColumnCount(width: number): number {
  if (width >= 1024) return 4; // 桌面端四列
  if (width >= 640) return 3;  // 平板三列
  return 2;                    // 移动端两列
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ notes }) => {
  const [cols, setCols] = useState<number>(() =>
    typeof window !== "undefined" ? getColumnCount(window.innerWidth) : 2
  );

  useEffect(() => {
    const onResize = () => setCols(getColumnCount(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 按估计列高度均衡分配卡片，避免不同高度图片出现单列过长
  const columns = useMemo(() => {
    const buckets: NoteItem[][] = Array.from({ length: cols }, () => []);
    const heights = new Array<number>(cols).fill(0);
    for (const note of notes) {
      let minIdx = 0;
      for (let i = 1; i < cols; i++) {
        if (heights[i] < heights[minIdx]) minIdx = i;
      }
      buckets[minIdx].push(note);
      heights[minIdx] += note.aspectRatio + 0.38;
    }
    return buckets;
  }, [notes, cols]);

  return (
    <div
      className="grid gap-2.5 sm:gap-4 items-start"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-2.5 sm:gap-4 min-w-0">
          {colItems.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ))}
    </div>
  );
};
