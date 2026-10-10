import type { CategoryId, Note, PageResult } from '../types';
import { makeNote, parseNoteId } from './data';

export const PAGE_SIZE = 20;
/** Each feed (category + refresh seed) has a finite mock pool so "no more content" can be reached. */
export const FEED_SIZE = 120;

const pools = new Map<string, Note[]>();
function feedPool(feed: CategoryId, seed: number): Note[] {
  const key = `${feed}:${seed}`;
  let list = pools.get(key);
  if (!list) {
    list = Array.from({ length: FEED_SIZE }, (_, i) => makeNote(feed, seed, i));
    pools.set(key, list);
  }
  return list;
}

export function matchesQuery(note: Note, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [note.title, note.desc, note.author.name, ...note.tags].some((s) => s.toLowerCase().includes(q));
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Simulated paginated API with network latency. */
export async function fetchNotes(params: { feed: CategoryId; seed: number; page: number; query?: string; pageSize?: number }): Promise<PageResult> {
  const { feed, seed, page, query = '', pageSize = PAGE_SIZE } = params;
  await delay(450 + Math.random() * 450);
  const all = feedPool(feed, seed);
  const list = query ? all.filter((n) => matchesQuery(n, query)) : all;
  const start = page * pageSize;
  return { items: list.slice(start, start + pageSize), hasMore: start + pageSize < list.length, total: list.length };
}

export function findMockNote(id: string): Note | null {
  const parsed = parseNoteId(id);
  return parsed ? makeNote(parsed.feed, parsed.seed, parsed.index) : null;
}
