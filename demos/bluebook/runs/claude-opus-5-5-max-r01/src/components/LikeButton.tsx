import { useState, type MouseEvent } from 'react';
import { useFeedStore } from '../store/useFeedStore';
import { formatCount } from '../utils';
import { HeartIcon } from './icons';

interface Props {
  id: string;
  count: number;
  size?: 'sm' | 'lg';
}

export default function LikeButton({ id, count, size = 'sm' }: Props) {
  const liked = useFeedStore((s) => !!s.liked[id]);
  const toggleLike = useFeedStore((s) => s.toggleLike);
  // Changing the key remounts the icon so the pop animation restarts on every click.
  const [pops, setPops] = useState(0);
  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    toggleLike(id);
    setPops((n) => n + 1);
  };
  const lg = size === 'lg';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={liked}
      aria-label={liked ? '取消点赞' : '点赞'}
      className={`-m-1.5 inline-flex shrink-0 items-center gap-1 rounded-full p-1.5 transition-colors ${liked ? 'text-brand' : 'text-gray-500 hover:text-gray-700'} ${lg ? 'text-sm' : 'text-xs'}`}
    >
      <HeartIcon key={pops} size={lg ? 24 : 16} filled={liked} className={pops ? 'animate-heart-pop' : undefined} />
      <span className="tabular-nums">{formatCount(count + (liked ? 1 : 0))}</span>
    </button>
  );
}
