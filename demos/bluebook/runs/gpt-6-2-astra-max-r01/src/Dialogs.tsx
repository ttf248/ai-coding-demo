import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { fallback, photo, type Note } from './data'
import { Heart } from './NoteCard'
import { useFeed } from './store'
export function Modal({ title, close, children }: { title: string, close: () => void, children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const d = ref.current!; d.showModal(); return () => d.close() }, [])
  return <dialog ref={ref} className="modal" aria-label={title} onCancel={close} onClick={e => { if (e.target === e.currentTarget) close() }}>
    <div className="flex items-center justify-between border-b p-4"><strong>{title}</strong><button autoFocus aria-label="关闭" onClick={close}>✕</button></div>{children}
  </dialog>
}
export function Detail({ note, close }: { note: Note, close: () => void }) {
  return <Modal title="笔记详情" close={close}><img className="max-h-[48vh] w-full bg-stone-100 object-contain" src={note.photo} onError={e => {e.currentTarget.src = fallback}} alt={note.title}/>
    <div className="space-y-3 p-5"><span className="text-sm text-berry">{note.category}</span><h2 className="text-xl font-bold">{note.title}</h2><p>{note.body}</p><div className="flex justify-between text-sm"><span>{note.author}</span><Heart note={note}/></div></div></Modal>
}
export function Compose({ close }: { close: () => void }) {
  const publish = useFeed(s => s.publish), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget), file = data.get('image') as File, title = String(data.get('title')).trim()
    if (!title || !file?.size) { setError('请选择图片并填写标题'); return }
    setBusy(true)
    const url = URL.createObjectURL(file), img = new Image(); img.src = url
    try {
      await img.decode()
      publish({ id: 'local-' + Date.now(), photo: url, ratio: img.naturalWidth/img.naturalHeight, title, category: String(data.get('category')), body: String(data.get('body')), author:'我', avatar:photo('portrait'), likes:0 })
      close(); window.scrollTo({ top:0, behavior:'smooth' })
    } catch { URL.revokeObjectURL(url); setError('这张图片无法读取，请选择其他图片'); setBusy(false) }
  }
  return <Modal title="发布笔记" close={close}><form className="compose" onSubmit={submit}><label>封面图片<input name="image" type="file" accept="image/*" required/></label><label>标题<input name="title" maxLength={64} required placeholder="给笔记起个名字"/></label><label>分类<select name="category">{['日常','旅行','建筑','咖啡','自然'].map(x=><option key={x}>{x}</option>)}</select></label><label>正文<textarea name="body" rows={3} placeholder="记录你看到的风景…"/></label>{error && <p role="alert">{error}</p>}<button className="publish" disabled={busy}>发布笔记</button></form></Modal>
}
