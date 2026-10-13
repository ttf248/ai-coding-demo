/**
 * 本地兜底图：直接内联 SVG，不依赖网络。
 * 只有外链图片加载失败时才会用到。
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <rect width="120" height="90" fill="#f0f0f2"/>
  <g fill="none" stroke="#c9c9cf" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="40" y="28" width="40" height="34" rx="4"/>
    <path d="M44 54l9-9 7 7 6-6 10 10"/>
  </g>
  <circle cx="53" cy="39" r="3.2" fill="#c9c9cf"/>
</svg>`;

export const FALLBACK_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export function formatLikes(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
