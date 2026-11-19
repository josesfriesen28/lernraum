'use client';
// Lernpool: Auswahl, aus welchen Fächern bzw. Themen die Lerneinheit Aufgaben zieht (seit v0.11.0).
import {useMemo,useState} from 'react';
import {SlidersHorizontal} from 'lucide-react';
type Any=any;

export function shortCourse(name:string){const m=/^(B\d+|English)/i.exec(name||'');return m?(m[1].toLowerCase()==='english'?'Englisch':m[1]):(name||'Modul').split(' ').slice(0,2).join(' ');}

/** Themen (Pakete) je Modul mit Anzahl aktiver Aufgaben. */
export function poolTree(state:Any){
 return state.course.map((c:Any)=>{
  const tasks=state.task.filter((t:Any)=>t.courseId===c.id&&t.status==='active');
  const packs=new Map<string,{key:string,title:string,count:number}>();
  for(const t of tasks)if(t.packageId){const key='pkg:'+c.id+':'+t.packageId;if(!packs.has(key)){const doc=state.document.filter((d:Any)=>d.courseId===c.id&&d.packageId===t.packageId).sort((a:Any,b:Any)=>b.version-a.version)[0];packs.set(key,{key,title:(doc?.title||t.packageId).replace(/^(B\d|EN|Englisch|English)\s*·\s*/i,''),count:0});}packs.get(key)!.count++;}
  return {id:c.id,name:c.name,short:shortCourse(c.name),count:tasks.length,packs:[...packs.values()].sort((a,b)=>a.key.localeCompare(b.key,'de',{numeric:true}))};
 }).filter((c:Any)=>c.count>0);
}

export default function PoolPicker({state,pool,busy,onChange}:{state:Any;pool:string[];busy:boolean;onChange:(pool:string[])=>void}){
 const tree=useMemo(()=>poolTree(state),[state]);
 const [open,Open]=useState<string|null>(null);
 if(!tree.length)return null;
 const all=!pool.length;
 const mode=(c:Any)=>pool.includes(c.id)?'all':c.packs.some((p:Any)=>pool.includes(p.key))?'some':'none';
 const withoutCourse=(c:Any)=>pool.filter(k=>k!==c.id&&!c.packs.some((p:Any)=>p.key===k));
 function toggleCourse(c:Any){const m=mode(c);onChange(m==='none'?[...withoutCourse(c),c.id]:withoutCourse(c));}
 function togglePack(c:Any,key:string){
  const m=mode(c);let chosen=m==='all'||all?c.packs.map((p:Any)=>p.key):c.packs.filter((p:Any)=>pool.includes(p.key)).map((p:Any)=>p.key);
  chosen=chosen.includes(key)?chosen.filter((k:string)=>k!==key):[...chosen,key];
  const base=all?tree.filter((x:Any)=>x.id!==c.id).map((x:Any)=>x.id):withoutCourse(c);
  onChange(chosen.length===c.packs.length?[...base,c.id]:[...base,...chosen]);
 }
 const count=all?tree.reduce((n:number,c:Any)=>n+c.count,0):tree.reduce((n:number,c:Any)=>{const m=mode(c);return n+(m==='all'?c.count:m==='some'?c.packs.filter((p:Any)=>pool.includes(p.key)).reduce((k:number,p:Any)=>k+p.count,0):0);},0);
 return <section className="card pool" aria-label="Lernpool">
  <div className="section-head"><h2><SlidersHorizontal size={18}/> Lernpool</h2><span className="tiny-label">{count} AUFGABEN</span></div>
  <p className="quiet">Wähle, aus welchen Fächern deine nächste Lerneinheit Fragen zieht.</p>
  <div className="pool-chips" role="group" aria-label="Fächer">
   <button className={'pool-chip'+(all?' on':'')} aria-pressed={all} disabled={busy} onClick={()=>onChange([])}>Alle Fächer</button>
   {tree.map((c:Any)=>{const m=all?'none':mode(c);return <button key={c.id} className={'pool-chip'+(m==='all'?' on':m==='some'?' part':'')} aria-pressed={m!=='none'} disabled={busy} title={c.name} onClick={()=>toggleCourse(c)}>{c.short}<small>{m==='some'?'Teil':c.count}</small></button>;})}
  </div>
  {tree.map((c:Any)=>c.packs.length>1&&<details key={c.id} className="pool-topics" open={open===c.id} onToggle={(e:Any)=>e.currentTarget.open?Open(c.id):open===c.id&&Open(null)}>
   <summary>Themen in {c.short} wählen</summary>
   {c.packs.map((p:Any)=>{const on=all||pool.includes(c.id)||pool.includes(p.key);return <label key={p.key} className="pool-topic"><input type="checkbox" checked={on} disabled={busy} onChange={()=>togglePack(c,p.key)}/><span>{p.title}</span><small>{p.count}</small></label>;})}
  </details>)}
 </section>;
}
