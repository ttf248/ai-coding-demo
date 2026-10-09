import {create} from 'zustand';
import {persist,createJSONStorage} from 'zustand/middleware';
import type {Note} from './mock';
type State={liked:string[];saved:string[];published:Note[];toggleLike:(id:string)=>void;toggleSave:(id:string)=>void;publish:(note:Note)=>void};
const safeStorage={getItem:(name:string)=>{try{return localStorage.getItem(name)}catch{return null}},setItem:(name:string,value:string)=>{try{localStorage.setItem(name,value)}catch{/* Private browsing may disable storage. */}},removeItem:(name:string)=>{try{localStorage.removeItem(name)}catch{}}};
export const useNotes=create<State>()(persist(set=>({liked:[],saved:[],published:[],toggleLike:id=>set(s=>({liked:s.liked.includes(id)?s.liked.filter(x=>x!==id):[...s.liked,id]})),toggleSave:id=>set(s=>({saved:s.saved.includes(id)?s.saved.filter(x=>x!==id):[...s.saved,id]})),publish:note=>set(s=>({published:[note,...s.published].slice(0,30)}))}),{name:'bluebook-sol-design-v1',storage:createJSONStorage(()=>safeStorage)}));
