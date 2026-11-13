import { useState } from "react";
import LazyLoad from "react-lazyload";
import type { Note } from "../data/mock";
import Avatar from "./Avatar";
import LikeButton from "./LikeButton";

interface NoteCardProps {
  note: Note;
  liked: boolean;
  likeDelta: number;
  onToggleLike: () => void;
}

const BASE = import.meta.env.BASE_URL;

export default function NoteCard({ note, liked, likeDelta, onToggleLike }: NoteCardProps) {
  const [failed, setFailed] = useState(false);
  const [pressed, setPressed] = useState(false);
  const src = failed ? `${BASE}images/fallback.svg` : `${BASE}${note.image}`;

  return (
    <article
      className={`card-press animate-fade-in overflow-hidden rounded-card bg-white shadow-sm ${pressed ? "scale-[0.97]" : ""}`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <LazyLoad height={note.imageHeight} offset={200} once>
        <img
          src={src}
          alt={note.title}
          width={400}
          height={note.imageHeight}
          loading="lazy"
          className="block w-full object-cover"
          style={{ height: "auto", aspectRatio: `400 / ${note.imageHeight}` }}
          onError={() => setFailed(true)}
        />
      </LazyLoad>
      <div className="p-2.5">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-neutral-800">
          {note.title}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <Avatar name={note.author} color={note.avatarColor} size={24} />
            <span className="truncate text-xs text-neutral-500">{note.author}</span>
          </div>
          <LikeButton liked={liked} count={note.likes + likeDelta} onToggle={onToggleLike} />
        </div>
      </div>
    </article>
  );
}