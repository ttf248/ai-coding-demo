import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { forceCheck } from 'react-lazyload'
import { useFeed } from './store'
import { NoteCard } from './NoteCard'
import { Detail, Compose } from './Dialogs'
import type { Note } from './data'
import './style.css'
function App() {
  const feed = useFeed(), [detail, setDetail] = useState<Note|null>(null), [compose,setCompose] = useState(false)
  const [count,setCount] = useState(4), [loading,setLoading] = useState(false), [pull,setPull] = useState(0)
  const bottom = useRef<HTMLDivElement>(null), touchY = useRef<number|null>(null)
  const matches = feed.notes.filter(n => (feed.category === '推荐' || n.category === feed.category) && (n.title+n.author+n.body+n.category).includes(feed.query.trim()))
  const shown = matches.slice(0,feed.limit)
  const columns: Note[][] = Array.from({ length:count }, () => []), heights = Array(count).fill(0)
  for (const n of shown) { const i=heights.indexOf(Math.min(...heights)); columns[i].push(n); heights[i]+=1/n.ratio+.34 }
  useEffect(() => {
    const resize=()=>setCount(innerWidth>=1100?4:innerWidth>=680?3:2)
    resize(); window.addEventListener('resize',resize); return ()=>window.removeEventListener('resize',resize)
  },[])
  useEffect(() => {
    if (!bottom.current || shown.length >= matches.length) { setLoading(false); return }
    let timer: number | undefined
    const watcher=new IntersectionObserver(([e])=>{
      if (e.isIntersecting && timer===undefined) {
        setLoading(true); timer=window.setTimeout(()=>{feed.more();setLoading(false)},420)
      }
    },{rootMargin:'150px'})
    watcher.observe(bottom.current); return ()=>{watcher.disconnect();clearTimeout(timer)}
  },[feed.query,feed.category,feed.limit,matches.length,shown.length,feed.more])
  useEffect(()=>{forceCheck()},[count,feed.limit,feed.category,feed.query,feed.notes])
  return <div onTouchStart={e=>{touchY.current=window.scrollY<=0?e.touches[0].clientY:null}} onTouchMove={e=>{if(touchY.current!==null)setPull(Math.max(0,e.touches[0].clientY-touchY.current))}} onTouchEnd={()=>{if(pull>64)feed.refresh();touchY.current=null;setPull(0)}} onTouchCancel={()=>{touchY.current=null;setPull(0)}}>
    <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur"><div className="shell topbar"><a className="logo" href="./">小蓝书</a><label className="search"><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg><input type="search" aria-label="搜索笔记" value={feed.query} placeholder="搜索你感兴趣的内容" onChange={e=>feed.setFilter(feed.category,e.target.value)}/></label><button className="publish" onClick={()=>setCompose(true)}>＋ 发布</button></div></header>
    <main className="shell pb-12"><section className="flex items-end justify-between gap-2 pb-4 pt-7 md:pt-10"><div><p className="text-xs font-semibold tracking-widest text-neutral-500">城市采集簿</p><h1 className="mt-1 text-3xl font-bold tracking-tight md:text-5xl">发现灵感<span className="text-berry">.</span></h1></div><button className="text-sm text-neutral-600" onClick={feed.refresh}>↻ 换一批</button></section>
    <nav aria-label="笔记分类" className="mb-5 flex flex-wrap gap-1.5">{['推荐','日常','旅行','建筑','咖啡','自然'].map(c=><button key={c} className="chip" aria-pressed={c===feed.category} onClick={()=>feed.setFilter(c,feed.query)}>{c}</button>)}</nav>
    {pull>16 && <div className="pb-3 text-center text-sm">{pull>64?'松开刷新':'下拉刷新'}</div>}
    <div className="feed" style={{gridTemplateColumns:'repeat('+count+',minmax(0,1fr))'}}>{columns.map((col,i)=><div key={i} className="space-y-3 md:space-y-5">{col.map(n=><NoteCard key={n.id} note={n} open={setDetail}/>)}</div>)}</div>
    <div ref={bottom} className="py-8 text-center text-sm text-neutral-500" role="status">{loading?<><i className="spinner"/> 正在加载</>:!matches.length?'没有匹配的笔记，试试其他关键词。':shown.length>=matches.length?'已经看完这些笔记了':''}</div></main>
    {detail && <Detail note={detail} close={()=>setDetail(null)}/>} {compose && <Compose close={()=>setCompose(false)}/>}
  </div>
}
createRoot(document.getElementById('root')!).render(<App/>)
