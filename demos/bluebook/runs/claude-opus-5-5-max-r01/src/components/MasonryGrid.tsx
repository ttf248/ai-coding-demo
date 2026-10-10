import { useEffect, useMemo } from 'react';
import { forceCheck } from '../lazyload';
import type { Note } from '../types';
import NoteCard from './NoteCard';

// Approximate height of the text block under the image, relative to the column width.
const TEXT_BLOCK = 0.36;

/**
 * Greedy shortest-column distribution using the known image aspect ratios.
 * It is deterministic, so appending items never moves the cards that are already placed.
 */
export function distribute(items: Note[], columns: number): Note[][] {
  const cols: Note[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);
  for (const item of items) {
    let target = 0;
    for (let c = 1; c < columns; c++) if (heights[c] < heights[target] - 1e-6) target = c;
    cols[target].push(item);
    heights[target] += item.height / item.width + TEXT_BLOCK;
  }
  return cols;
}

export default function MasonryGrid({ items, columns }: { items: Note[]; columns: number }) {
  const cols = useMemo(() => distribute(items, columns), [items, columns]);
  // Cards that move or appear without a scroll event still need react-lazyload to re-check visibility.
  useEffect(() => {
    const id = requestAnimationFrame(() => forceCheck());
    return () => cancelAnimationFrame(id);
  }, [cols]);
  return (
    <div className="flex items-start gap-2 md:gap-3 lg:gap-4" data-columns={columns}>
      {cols.map((col, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col gap-2 md:gap-3 lg:gap-4">
          {col.map((note) => <NoteCard key={note.id} note={note} />)}
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ columns }: { columns: number }) {
  const ratios = [1.3, 0.9, 1.5, 1.1, 1.0, 1.4, 1.2, 0.8, 1.35, 1.05, 1.25, 0.95];
  const cols = Array.from({ length: columns }, (_, c) => ratios.filter((_, i) => i % columns === c).slice(0, 3));
  return (
    <div className="flex items-start gap-2 md:gap-3 lg:gap-4" aria-hidden="true">
      {cols.map((col, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col gap-2 md:gap-3 lg:gap-4">
          {col.map((r, j) => (
            <div key={j} className="overflow-hidden rounded-card bg-white shadow-card">
              <div className="skeleton w-full" style={{ paddingBottom: `${r * 100}%` }} />
              <div className="space-y-2 p-2.5">
                <div className="skeleton h-3.5 w-11/12 rounded" />
                <div className="skeleton h-3.5 w-2/3 rounded" />
                <div className="flex items-center gap-1.5 pt-1">
                  <div className="skeleton h-6 w-6 rounded-full" />
                  <div className="skeleton h-3 w-16 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
