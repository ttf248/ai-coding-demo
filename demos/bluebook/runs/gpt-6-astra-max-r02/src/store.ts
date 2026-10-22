import {create} from 'zustand';
import {notes,Note} from './mock';
type State={items:Note[];query:string;category:string;liked:Set<string>;loading:boolean;hasMore:boolean;page:number;view:'discover'|'liked';custom:Note[];load:()=>Promise<void>;filter:(query:string,category:string,view?:State['view'])=>void;refresh:()=>void;toggle:(id:string)=>void;publish:(note:Note)=>void};
let generation=0;
function storedLikes(){try{return new Set<string>(JSON.parse(localStorage.getItem('bluebook-likes')||'[]'))}catch{return new Set<string>()}}
function source(s:State){return [...s.custom,...notes].filter(n=>(s.category==='推荐'||n.category===s.category)&&(!s.query||[n.title,n.author,n.category].join(' ').toLowerCase().includes(s.query.toLowerCase()))&&(s.view!=='liked'||s.liked.has(n.id)))}
export const useFeed=create<State>((set,get)=>({items:notes.slice(0,20),query:'',category:'推荐',liked:storedLikes(),loading:false,hasMore:true,page:1,view:'discover',custom:[],
 load:async()=>{const s=get();if(s.loading||!s.hasMore)return;const token=generation;set({loading:true});await new Promise(r=>setTimeout(r,550));if(token!==generation)return;const current=get(),all=source(current),count=(current.page+1)*20;set({items:all.slice(0,count),page:current.page+1,hasMore:all.length>count,loading:false})},
 filter:(query,category,view=get().view)=>{generation++;set({query,category,view,page:1,loading:false});const all=source(get());set({items:all.slice(0,20),hasMore:all.length>20})},
 refresh:()=>{generation++;const token=generation;set({loading:true});setTimeout(()=>{if(token!==generation)return;const all=source(get());set({items:all.slice(0,20),page:1,hasMore:all.length>20,loading:false})},650)},
 toggle:id=>{const liked=new Set(get().liked);liked.has(id)?liked.delete(id):liked.add(id);set({liked});try{localStorage.setItem('bluebook-likes',JSON.stringify([...liked]))}catch{}if(get().view==='liked')get().filter(get().query,get().category)},
 publish:note=>{set({custom:[note,...get().custom]});get().filter('','推荐','discover')}
}));
