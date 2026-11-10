// Pure domain logic. No network, model, or clock side effects.
export const INTERVALS = [1,3,7,14,30,60];
export const DAY = 86400000;
export const KINDS = ['course','document','source','objective','task','attempt','correction','session','settings','issue'];
export function emptyState() { return Object.fromEntries(KINDS.map(k=>[k,[]])); }
export function dayKey(time) {return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin'}).format(new Date(time));}
export function effectiveAttempts(state) {
 const corrections = new Map([...state.correction].sort((a,b)=>a.at.localeCompare(b.at)).map(c=>[c.attemptId,c]));
 return state.attempt.map(a=>({...a,...(corrections.has(a.id)?{result:corrections.get(a.id).result}: {})})).sort((a,b)=>a.at.localeCompare(b.at)||a.id.localeCompare(b.id));
}
export function reviewIndex(state,attempts=effectiveAttempts(state)){const index=new Map();for(const a of attempts){const key=JSON.stringify([a.familyId,a.epoch,a.track]);if(!index.has(key))index.set(key,[]);index.get(key).push(a);}return index;}
/** @param {any} state @param {any} task @param {Map<string,any[]> | null} index */
export function reviewState(state, task, index=null) {
 // A revision of a solution starts its own evidence epoch; sibling variants share it.
 let step=0,due=null,lastDay='',last=null;
 const attempts=index?(index.get(JSON.stringify([task.familyId,task.epoch,task.track]))||[]):effectiveAttempts(state).filter(a=>a.familyId===task.familyId && a.epoch===task.epoch && a.track===task.track);
 for(const a of attempts){
   if(a.result==='skip'||a.result==='read'||a.result==='pending')continue;
   const qualified=a.result==='correct'&&!a.help&&!a.revealed&&a.confidence!=='guess';
   const day=dayKey(a.at);
   if(qualified && day!==lastDay){due=new Date(Date.parse(a.at)+INTERVALS[Math.min(step,5)]*DAY).toISOString();step=Math.min(step+1,6);lastDay=day;}
   else if(!qualified){ step=0; due=new Date(Date.parse(a.at)+DAY).toISOString();lastDay=day; }
   last=a;
 }
 return {step,due,last,independentDays:step};
}
export function plan(state, now, minutes=20, extra=false) {
 const seen=new Set();
 const attempts=effectiveAttempts(state);
 const history=reviewIndex(state,attempts);
 const today=dayKey(now);
 const used=new Set(attempts.filter(a=>dayKey(a.at)===today).map(a=>a.familyId));
 let seconds=Math.max(0,(minutes-1)*60);
 const ranked=state.task.filter(t=>t.status==='active'&&!used.has(t.familyId)).map(t=>{
 const r=reviewState(state,t,history),course=state.course.find(c=>c.id===t.courseId);
 const days=r.due?(Date.parse(now)-Date.parse(r.due))/DAY:null;
 const exam=course?.exam?Math.max(0,(Date.parse(course.exam+'T12:00:00Z')-Date.parse(now))/DAY):null;
 const never=!r.last;
 const priority=(days!==null?Math.max(-20,days)*3+40:5)+(exam!==null&&exam<30?30-exam:0)+(r.last&&r.last.result!=='correct'?20:0);
 const reason=never?'Neues Lernziel':days>=0?'Wiederholung fällig · '+(r.last.result==='correct'?'letzter Abruf gelungen':'noch einmal festigen'):'Freiwillige Vertiefung';
 return {task:t,review:r,priority,reason,eligible:never||days>=0||extra};
 }).filter(x=>x.eligible).sort((a,b)=>b.priority-a.priority||a.task.id.localeCompare(b.task.id));
 // A weekly coverage slot prevents exclusively exam-driven queues.
 const weekAgo=Date.parse(now)-7*DAY;
 const neglected=ranked.find(x=>!attempts.some(a=>a.courseId===x.task.courseId&&Date.parse(a.at)>weekAgo));
 if(neglected){ranked.splice(ranked.indexOf(neglected),1);ranked.unshift({...neglected,reason:neglected.reason+' · Wochenabdeckung'});}
 const selected=[];
 for(const x of ranked){
  if(seen.has(x.task.familyId)||x.task.seconds+30>seconds)continue;
  seen.add(x.task.familyId);seconds-=x.task.seconds+30;selected.push({id:x.task.id,reason:x.reason});
 }
 return {items:selected,uncovered:ranked.filter(x=>!seen.has(x.task.familyId)).length};
}
export function scoreChoice(task, selection) {
 const chosen=[...new Set(selection)].sort();
 return chosen.length===task.correct.length&&chosen.every((x,i)=>x===[...task.correct].sort()[i])?'correct':'wrong';
}
export function validateTask(t) {
 if(!t.prompt?.trim()||!t.solution?.trim()||!t.rubric?.trim())throw Error('Frage, Musterlösung und Bewertungskriterien sind erforderlich.');
 if(!['recall','single','multiple','apply','explain'].includes(t.type))throw Error('Unbekanntes Aufgabenformat.');
 if(!['recognize','recall','explain','apply'].includes(t.track))throw Error('Kompetenzspur fehlt.');
 if(!Number.isFinite(t.seconds)||t.seconds<20||t.seconds>1200)throw Error('Aufgabenzeit: 20 bis 1200 Sekunden.');
 if(t.type==='single'||t.type==='multiple'){
  if(!Array.isArray(t.options)||t.options.length<2||t.options.length>6||new Set(t.options.map(o=>o.id)).size!==t.options.length||t.options.some(o=>!o.text.trim()))throw Error('Zwei bis sechs eindeutige Auswahlantworten erforderlich.');
  if(!t.correct?.length||t.correct.some(id=>!t.options.some(o=>o.id===id))||(t.type==='single'&&t.correct.length!==1))throw Error('Korrekte Auswahl bitte prüfen.');
 }
 return t;
}
export function validateBackup(b){
 if(b?.format!=='lernraum'||b.schema!==1||!b.entities||!Array.isArray(b.files))throw Error('Kein gültiges Lernraum-Backup (Version 1).');
 for(const kind of KINDS){
 if(!Array.isArray(b.entities[kind])||b.entities[kind].length>100000)throw Error('Ungültige Datensammlung: '+kind);
 const ids=new Set();for(const e of b.entities[kind]){if(typeof e.id!=='string'||!e.id||ids.has(e.id))throw Error('Doppelte/fehlende ID: '+kind);ids.add(e.id);}
 }
 const s=b.entities;
 for(const t of s.task){validateTask(t);if(!s.source.some(x=>x.id===t.sourceId)||!s.objective.some(x=>x.id===t.objectiveId))throw Error('Aufgabenquelle oder Lernziel fehlt.');}
 for(const d of s.document){if(!s.course.some(c=>c.id===d.courseId)||!b.files.some(f=>f.hash===d.hash))throw Error('Modul oder Originaldatei fehlt.');}
 for(const x of s.source)if(!s.document.some(d=>d.id===x.documentId))throw Error('Dokumentbezug fehlt.');
 for(const t of s.task){if(!['draft','active','suspended','archived','superseded'].includes(t.status)||typeof t.familyId!=='string'||typeof t.epoch!=='string'||!s.course.some(c=>c.id===t.courseId))throw Error('Ungültiger Aufgabenstatus oder Modulbezug.');}
 for(const a of s.attempt){if(!s.task.some(t=>t.id===a.taskId)||!Number.isFinite(Date.parse(a.at))||!['correct','partial','wrong','skip','read','pending'].includes(a.result))throw Error('Aufgabenhistorie unvollständig oder ungültig.');}
 for(const c of s.correction)if(!s.attempt.some(a=>a.id===c.attemptId)||!Number.isFinite(Date.parse(c.at))||!['correct','partial','wrong','pending'].includes(c.result))throw Error('Korrekturbezug ungültig.');
 for(const session of s.session)if(!Array.isArray(session.items)||session.items.some(x=>!s.task.some(t=>t.id===x.id))||!Number.isInteger(session.index)||session.index<0||session.index>session.items.length)throw Error('Sitzung ungültig.');
 if(s.session.filter(x=>!x.completed).length>1)throw Error('Mehr als eine offene Sitzung.');
 for(const source of s.source)if(typeof source.text!=='string'||!Number.isInteger(source.page)||source.page<1)throw Error('Quellentext oder Seitenzahl ungültig.');
 return b;
}
export function textChunks(pages) {
 return pages.flatMap(p=>p.text.split(/\n\s*\n/).filter(x=>x.trim().length>35).flatMap(x=>{
 const parts=[];for(let i=0;i<x.length;i+=1200)parts.push({page:p.page,text:x.slice(i,i+1200).trim()});return parts;
 })).slice(0,100);
}
export function orderedOptions(task,sessionId){
 const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;return h>>>0;};
 return [...(task.options||[])].sort((a,b)=>hash(sessionId+a.id)-hash(sessionId+b.id));
}

