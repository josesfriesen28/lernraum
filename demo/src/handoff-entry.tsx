import React from 'react';
import {createRoot} from 'react-dom/client';
import Lernraum from '../../components/lernraum';
import {emptyState,plan,scoreChoice} from '../../lib/core.mjs';
import {validatePackage} from '../../lib/package.mjs';
const uid=()=>crypto.randomUUID();
const key='lernraum-standalone-demo-v2';
let s:any=emptyState(),revision=0,files:any={};
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){s=saved.state;files=saved.files;revision=saved.revision;}}catch{}
if(!s.course.length){s.course.push({id:'demo',name:'BEISPIEL · Kommunikation',exam:'',examType:'Klausur'});s.document.push({id:'doc',rootId:'doc',courseId:'demo',title:'Beispielmaterial',hash:'demo',version:1,pageCount:1,at:new Date().toISOString(),warnings:'Erfundene Testdaten; keine Studienquelle.'});s.source.push({id:'src',documentId:'doc',text:'Hilfreiches Feedback beschreibt beobachtbares Verhalten, seine Wirkung und eine konkrete Bitte.',page:1,position:0});s.objective.push({id:'obj',courseId:'demo',label:'Hilfreiches Feedback'});const demoTasks:any[]=[
 {type:'single',prompt:'Welche Formulierung ist hilfreiches Feedback?',options:['„Du bist immer so unorganisiert.“','„In der Präsentation fehlten zwei Folien; dadurch kam der Teil zu kurz. Kannst du sie ergänzen?“','„Das war irgendwie nicht so gut.“','„Mach es einfach besser.“'],correct:[1]},
 {type:'recall',prompt:'Was kennzeichnet hilfreiches Feedback?'},
 {type:'multiple',prompt:'Welche Bestandteile gehören zu hilfreichem Feedback? (mehrere richtig)',options:['Beobachtbares Verhalten','Wirkung des Verhaltens','Eine konkrete Bitte','Eine Bewertung der Persönlichkeit'],correct:[0,1,2]},
 {type:'explain',prompt:'Kurz lesen: Warum Ich-Botschaften wirken'},
 {type:'single',prompt:'Was beschreibt „beobachtbares Verhalten“ am besten?',options:['Eine Vermutung über Absichten','Eine konkrete, überprüfbare Handlung','Ein allgemeines Urteil','Eine Charaktereigenschaft'],correct:[1]},
 {type:'apply',prompt:'Fiktiver Fall: Ein Teammitglied schickt Protokolle regelmäßig zu spät. Formuliere eine konkrete Bitte.'},
 {type:'single',prompt:'Wann ist Feedback am wirksamsten?',options:['Möglichst zeitnah zum Ereignis','Erst im Jahresgespräch','Nur schriftlich und anonym','Nur wenn es gefordert wird'],correct:[0]},
 {type:'multiple',prompt:'Welche Aussagen sind Ich-Botschaften? (mehrere richtig)',options:['„Ich habe mir Sorgen gemacht.“','„Du nervst.“','„Mir fehlt noch der Überblick.“','„Man macht das so nicht.“'],correct:[0,2]},
 {type:'recall',prompt:'Warum hilft eine genaue Verhaltensbeschreibung?'},
 {type:'single',prompt:'Was ist das Ziel einer konkreten Bitte?',options:['Schuld zuweisen','Eine umsetzbare nächste Handlung vereinbaren','Die Diskussion beenden','Recht behalten'],correct:[1]},
];
demoTasks.forEach((d,i)=>{const options=(d.options||[]).map((text:string,k:number)=>({id:'o'+k,text}));s.task.push({id:'demo-'+i,courseId:'demo',objectiveId:'obj',sourceId:'src',familyId:'family-'+i,epoch:'demo',status:'active',version:1,type:d.type,track:['single','multiple'].includes(d.type)?'recognize':d.type==='apply'?'apply':d.type==='explain'?'explain':'recall',prompt:d.prompt,solution:d.type==='explain'?'Ich-Botschaften beschreiben die eigene Wahrnehmung statt die andere Person zu bewerten. Das senkt Abwehr und macht das Gespräch über das Verhalten leichter. (Erfundene Beispielkarte.)':s.source[0].text,rubric:'Beobachtbares Verhalten, Wirkung und konkrete Bitte benennen.',seconds:d.type==='apply'?120:45,options,correct:(d.correct||[]).map((k:number)=>'o'+k)});});files.demo={text:s.source[0].text,type:'text/plain'};}
const save=()=>{try{localStorage.setItem(key,JSON.stringify({state:s,files,revision}));}catch{throw Error('Lokaler Browserspeicher voll oder nicht verfügbar. Bitte Daten exportieren.');}};
const snapshot=()=>({state:s,revision});
const response=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
window.fetch=async(input:any,init:any={})=>{try{const url=new URL(String(input),'https://demo.local');if(url.pathname==='/api/file'){if(init.method==='POST'){const file=init.body.get('file');const text=await file.text();const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');files[hash]={text,type:file.type};save();return response({hash});}const f=files[url.searchParams.get('hash')!];return f?new Response(f.text,{headers:{'content-type':f.type}}):response({error:'Datei fehlt in der Demo.'},404);}
if(url.pathname!=='/api/data')return response({error:'In der lokalen Demo nicht verfügbar.'},404);
if(init.method!=='POST')return response(snapshot());const {command,payload:p={},id,revision:expected}=JSON.parse(init.body);if(expected!==revision)return response({error:'Bitte aktualisieren.'},409);const get=(k:string,id:string)=>{const x=s[k].find((x:any)=>x.id===id);if(!x)throw Error('Eintrag fehlt');return x;};const put=(k:string,x:any)=>{s[k]=s[k].filter((v:any)=>v.id!==x.id);s[k].push(x);};const now=new Date().toISOString();
if(command==='course')put('course',{...p,id:p.id||uid()});
else if(command==='settings')put('settings',{...p,id:'main'});
else if(command==='package'){const pack=validatePackage(p.package);if(s.document.some((d:any)=>d.packageId===pack.packageId&&d.courseId===p.courseId))return response({...snapshot(),notice:'Paket bereits vorhanden.'});const doc=uid();put('document',{id:doc,rootId:doc,courseId:p.courseId,hash:p.hash,packageId:pack.packageId,title:pack.title,version:1,pageCount:pack.tasks.length,at:now});const families:any={};for(const t of pack.tasks){const source=uid(),obj=uid();put('source',{id:source,documentId:doc,page:t.page,text:t.sourceQuote,position:0});put('objective',{id:obj,courseId:p.courseId,label:t.objective});put('task',{...t,id:uid(),courseId:p.courseId,sourceId:source,objectiveId:obj,familyId:families[t.family]|| (families[t.family]=uid()),epoch:doc,status:p.activate?'active':'draft',version:1});}}
else if(command==='start'){if(!s.session.some((x:any)=>!x.completed)){const selected=p.taskId?{items:[{id:p.taskId,reason:'Gezielte Übung'}],uncovered:0}:plan(s,now,p.minutes,true);if(selected.items.length)put('session',{id:uid(),...selected,index:0,minutes:p.minutes,startedAt:now,completed:false});else return response({...snapshot(),notice:'Für heute keine weiteren Aufgaben. Importiere ein Paket oder übe eine Aufgabe gezielt.'});}}
else if(command==='attempt'){if(!s.attempt.some((a:any)=>a.id===id)){const t=get('task',p.taskId),sess=get('session',p.sessionId);if(sess.completed||sess.items[sess.index]?.id!==t.id)throw Error('Sitzung schon weitergeführt.');put('attempt',{...p,id,at:now,taskId:t.id,familyId:t.familyId,epoch:t.epoch,track:t.track,courseId:t.courseId,selection:p.selection||[],result:p.result==='skip'?'skip':t.type==='explain'?'read':['single','multiple'].includes(t.type)?scoreChoice(t,p.selection):p.result});sess.index++;if(sess.index>=sess.items.length){const used=new Set(sess.items.map((x:any)=>get('task',x.id).familyId));sess.items.push(...plan({...s,task:s.task.filter((x:any)=>!used.has(x.familyId))},now,sess.minutes,true).items);}sess.completed=sess.index>=sess.items.length;}}
else if(command==='finish')get('session',p.id).completed=true;
else if(command==='deleteTask'){const t=get('task',p.id);t.previousStatus=t.status;t.status='archived';for(const x of s.session.filter((x:any)=>!x.completed)){x.items=[...x.items.slice(0,x.index),...x.items.slice(x.index).filter((v:any)=>v.id!==t.id)];x.completed=x.index>=x.items.length;}}
else if(command==='restoreTask'){const t=get('task',p.id);t.status=t.previousStatus||'draft';}
else if(command==='status')get('task',p.id).status=p.status;
else if(command==='report'){get('task',p.id).status='suspended';put('issue',{id:uid(),taskId:p.id,text:p.text,at:now});}
else if(command==='correct')put('correction',{...p,id:uid(),at:now});
else if(command==='task')put('task',{...get('task',p.id),...p,status:p.publish?'active':'draft'});
else if(command==='newTask'){const t=get('task',p.id);put('task',{...t,id:uid(),status:'draft',familyId:p.variant?t.familyId:uid(),prompt:'Neue Frage zur Quelle'});}
else if(command==='restore')s=p.backup.entities;
else throw Error('Diese Funktion benötigt das vollständige Backend. Die HTML-Demo unterstützt JSON-Aufgabenpakete; PDF-/Textextraktion bitte im vollständigen Programm testen.');
revision++;save();return response(snapshot());}catch(e:any){return response({error:e.message},400);}};
createRoot(document.getElementById('root')!).render(<Lernraum user={{id:'html-demo',name:'Demo'}}/>);
