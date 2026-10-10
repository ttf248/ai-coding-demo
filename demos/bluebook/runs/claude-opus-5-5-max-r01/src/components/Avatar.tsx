import type { Author } from '../types';

/** Text avatar: first character of the nickname on the author's colour. */
export default function Avatar({ author, size = 24 }: { author: Author; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white ring-2 ring-white"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.46), background: `linear-gradient(135deg, ${author.color}, ${author.color}cc)` }}
      aria-hidden="true"
    >
      {Array.from(author.name)[0]}
    </span>
  );
}
