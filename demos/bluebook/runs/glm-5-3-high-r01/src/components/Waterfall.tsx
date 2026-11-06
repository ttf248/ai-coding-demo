import { useEffect, useMemo, useState } from "react";
import NoteCard from "./NoteCard";
import { useFeed } from "../store";
import type { Note } from "../types";

function useColumns(notes: Note[]) {
  const [count, setCount] = useState(() =>
    typeof window === "undefined"
      ? 4
      : window.innerWidth < 640
        ? 2
        : window.innerWidth < 1024
          ? 3
          : 4
  );

  useEffect(() => {
    const onResize = () =>
      setCount(
        window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4
      );
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 贪心：把卡片放进"当前最矮"的列，利用已知宽高比估算列高
  return useMemo(() => {
    const cols: Note[][] = Array.from({ length: count }, () => []);
    const heights = new Array(count).fill(0);
    for (const n of notes) {
      let k = 0;
      for (let i = 1; i < count; i++) if (heights[i] < heights[k]) k = i;
      cols[k].push(n);
      heights[k] += 1 / n.ratio + 0.35;
    }
    return cols;
  }, [notes, count]);
}

export default function Waterfall() {
  const notes = useFeed((s) => s.notes);
  const cols = useColumns(notes);
  return (
    <div className="flex items-start gap-2 px-2 pt-1">
      {cols.map((col, i) => (
        <div key={i} className="min-w-0 flex-1">
          {col.map((n) => (
            <div key={n.id} className="animate-fade-in-up">
              <NoteCard note={n} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
