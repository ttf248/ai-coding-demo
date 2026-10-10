export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const FALLBACK_IMAGE = assetUrl('images/fallback.svg');

/** 1234 -> 1234, 12345 -> 1.2万 */
export function formatCount(n: number): string {
  if (n < 10000) return String(n);
  const w = n / 10000;
  return `${w >= 10 ? Math.round(w) : w.toFixed(1).replace(/\.0$/, '')}万`;
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')}`;
}
