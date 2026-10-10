import { memo, type KeyboardEvent } from 'react';
import type { Note } from '../types';
import { openNote } from '../router';
import Avatar from './Avatar';
import LazyImage from './LazyImage';
import LikeButton from './LikeButton';

function NoteCard({ note }: { note: Note }) {
  const open = () => openNote(note.id);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  };
  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={note.title}
      onClick={open}
      onKeyDown={onKeyDown}
      data-note-id={note.id}
      className="animate-fade-in cursor-pointer select-none overflow-hidden rounded-card bg-white shadow-card transition duration-200 ease-out [-webkit-tap-highlight-color:transparent] hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand active:translate-y-0 active:scale-[0.97] active:shadow-card"
    >
      <LazyImage src={note.image} width={note.width} height={note.height} alt={note.title} />
      <div className="px-2.5 pb-2.5 pt-2">
        <h3 className="line-clamp-2 text-[14px] font-medium leading-5 text-gray-900">
          {note.published && <span className="mr-1 rounded bg-brand-soft px-1 py-px align-[1px] text-[10px] font-semibold text-brand">我的</span>}
          {note.title}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <Avatar author={note.author} size={24} />
            <span className="truncate text-xs text-gray-500">{note.author.name}</span>
          </div>
          <LikeButton id={note.id} count={note.likes} />
        </div>
      </div>
    </article>
  );
}

export default memo(NoteCard);
