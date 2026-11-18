import LazyLoad from 'react-lazyload'
import { fallback, type Note } from './data'
import { useFeed } from './store'
export function Heart({ note }: { note: Note }) {
  const liked = useFeed(s => !!s.liked[note.id]), toggle = useFeed(s => s.toggle)
  return <button className={'heart ' + (liked ? 'is-liked' : '')} aria-label={liked ? '取消点赞' : '点赞'} aria-pressed={liked} onClick={() => toggle(note.id)}>
    <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7"><path d="M20.5 4.9a5.4 5.4 0 0 0-8.5 1 5.4 5.4 0 0 0-8.5-1c-2.1 2.3-1.8 5.7.2 8.1l8.3 8 8.3-8c2-2.4 2.3-5.8.2-8.1Z"/></svg>
    {note.likes + Number(liked)}</button>
}
export function NoteCard({ note, open }: { note: Note, open: (n: Note) => void }) {
  return <article className="note-card">
    <button className="block w-full text-left" onClick={() => open(note)}>
      <div className="photo" style={{ aspectRatio: note.ratio }}><LazyLoad once offset={350} height="100%" resize><img src={note.photo} alt={note.title} onError={e => { e.currentTarget.src = fallback }} /></LazyLoad></div>
      <h2 className="my-2 line-clamp-2 px-3 text-sm font-semibold leading-snug md:text-base">{note.title}</h2>
    </button>
    <div className="flex items-center justify-between gap-1 px-3 pb-3 text-xs text-neutral-600"><span className="flex min-w-0 items-center gap-1.5"><img className="h-6 w-6 rounded-full object-cover" alt="" src={note.avatar || fallback}/><span className="truncate">{note.author}</span></span><Heart note={note}/></div>
  </article>
}
