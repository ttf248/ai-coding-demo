import { useEffect, useMemo, useRef, useState } from "react";
import type { Note } from "../types";
import {
  GRID_GAP,
  cardWidthFor,
  columnsForWidth,
  estimateCardHeight,
} from "../lib/layout";
import NoteCard from "./NoteCard";

interface Props {
  notes: Note[];
}

export default function WaterfallGrid({ notes }: Props) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = useState(0);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => setMeasured(el.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const containerWidth =
    measured > 0
      ? measured
      : typeof window !== "undefined"
        ? window.innerWidth - 24
        : 360;

  const columns = columnsForWidth(containerWidth);
  const cardWidth = cardWidthFor(containerWidth, columns);

  // 最短列优先：保证每张卡片都接到当前最矮的一列，视觉上才是真正的瀑布流
  const buckets = useMemo(() => {
    const cols: Note[][] = Array.from({ length: columns }, () => []);
    const heights = new Array<number>(columns).fill(0);
    for (const note of notes) {
      let target = 0;
      for (let i = 1; i < columns; i += 1) {
        if (heights[i] < heights[target]) target = i;
      }
      cols[target].push(note);
      heights[target] += estimateCardHeight(note, cardWidth) + GRID_GAP;
    }
    return cols;
  }, [notes, columns, cardWidth]);

  return (
    <div ref={gridRef} className="flex w-full" style={{ gap: GRID_GAP }}>
      {buckets.map((bucket, index) => (
        <div
          key={index}
          className="flex min-w-0 flex-1 flex-col"
          style={{ gap: GRID_GAP }}
        >
          {bucket.map((note) => (
            <NoteCard key={note.id} note={note} width={cardWidth} />
          ))}
        </div>
      ))}
    </div>
  );
}
