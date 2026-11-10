// Local integration test only. Never targets production. Restores the original test workspace.
import assert from 'node:assert/strict';
import {emptyState,reviewState} from '../lib/core.mjs';
const base='http://127.0.0.1:5173';
let state,revision;let passed=0;
async function req(path,options={},auth=true){const r=await fetch(base+path,{...options,headers:{...(auth?{cookie:'__sites_local_auth=1'}:{}),...options.headers}});let d;try{d=await r.json();}catch{d={};}return {r,d};}
async function read(){const {r,d}=await req('/api/data');assert.equal(r.status,200);({state,revision}=d);return d;}
async function command(command,payload,id=crypto.randomUUID(),expected=revision){const {r,d}=await req('/api/data',{method:'POST',headers:{'content-type':'application/json',origin:base},body:JSON.stringify({id,revision:expected,command,payload})});assert.equal(r.status,200,JSON.stringify(d));if(d.state)({state,revision}=d);return {d,id};}
function check(label,fn){fn();passed++;console.log('PASS '+label);}
async function upload(text){const form=new FormData();form.set('file',new File([text],'test.txt',{type:'text/plain'}));const {r,d}=await req('/api/file',{method:'POST',body:form});assert.equal(r.status,200,JSON.stringify(d));return d;}
let original=await read();
const backupOf=s=>({format:'lernraum',schema:1,entities:s,files:[...new Set(s.document.map(d=>d.hash))].map(hash=>({hash}))});
try{
 check('Unauthenticated API rejected',()=>{});assert.equal((await req('/api/data',{},false)).r.status,401);
 const forged=await req('/api/data',{headers:{'oai-authenticated-user-id':'victim','oai-authenticated-user-email':'x@example.com'}},false);assert.equal(forged.r.status,401);
 await command('restore',{backup:backupOf(emptyState())});
 await command('settings',{minutes:20,pauseEvery:10});check('Adjustable break preference is persisted',()=>assert.equal(state.settings[0].pauseEvery,10));
 await command('course',{name:'TEST · Kommunikationsgrundlagen',exam:'2026-12-01',examType:'Mündliche Prüfung'});const courseId=state.course[0].id;
 const text='Kommunikation hat eine Inhalts- und eine Beziehungsebene. Die Beziehungsebene beeinflusst, wie der Inhalt verstanden wird.\n\nFeedback sollte konkret, beobachtbar und auf ein veränderbares Verhalten bezogen sein. Eine pauschale Bewertung hilft weniger als eine genaue Beschreibung.';
 const file=await upload(text);assert.equal((await upload(text)).hash,file.hash);
 const payload={courseId,title:'TEST · Vorlesung',topic:'Kommunikation',hash:file.hash,pages:[{page:1,text}]};await command('import',payload);
 check('Upload produces two sourced drafts',()=>{assert.equal(state.task.length,2);assert.equal(state.document.length,1);assert.equal(state.source.length,2);});
 const before=state.task.length;await command('import',payload);check('Duplicate upload is idempotent',()=>assert.equal(state.task.length,before));
 const sameContent=await upload(text.replace(/ /g,'  '));await command('import',{...payload,hash:sameContent.hash,pages:[{page:1,text:text.replace(/ /g,'  ')}]});check('Whitespace-normalized duplicate is detected',()=>assert.equal(state.task.length,before));
 for(const t of [...state.task])await command('task',{...t,prompt:t.id===state.task[0].id?'Welche zwei Ebenen hat Kommunikation?':'Wie sollte Feedback gestaltet sein?',publish:true,confirmSource:true});
 await command('start',{minutes:20});const session=state.session.find(x=>!x.completed);const task=state.task.find(t=>t.id===session.items[0].id);
 const payloadA={taskId:task.id,sessionId:session.id,result:'correct',answer:'Inhalt und Beziehung',confidence:'sure',help:false,revealed:false,seconds:30};const answer=await command('attempt',payloadA);const revisionAfter=revision;await command('attempt',payloadA,answer.id,0);
 check('Network replay does not duplicate answer',()=>{assert.equal(state.attempt.length,1);assert.equal(revision,revisionAfter);});
 const reopened=await read();check('Reopening recovers session progress',()=>assert.equal(reopened.state.session[0].index,1));
 await command('attempt',{taskId:session.items[1].id,sessionId:session.id,result:'skip'});check('Skip is preserved without success',()=>{assert.equal(state.attempt.find(a=>a.taskId===session.items[1].id).result,'skip');assert.equal(reviewState(state,state.task.find(t=>t.id===session.items[1].id)).step,0);});
 const document=state.document[0];const changed=text.replace('beeinflusst, wie der Inhalt verstanden wird','prägt das Verständnis; der Kontext ist zusätzlich zu beachten');const file2=await upload(changed);await command('import',{...payload,hash:file2.hash,previousId:document.id,pages:[{page:1,text:changed}]});
 check('Version update keeps history and avoids unchanged duplicates',()=>{assert.equal(state.document.length,2);assert.equal(state.task.length,3);assert.equal(state.attempt.length,2);assert.equal(state.task.find(t=>t.id===state.task.find(x=>x.status==='draft').previousId).status,'suspended');});
 const changedTask=state.task.find(t=>t.status==='draft');await command('task',{...changedTask,publish:true,confirmSource:true});check('Published changed source starts a new evidence epoch',()=>{assert.equal(reviewState(state,changedTask).step,0);assert.equal(state.attempt.length,2);});
 // Exercise all explicit task formats and manual targeted practice.
 const baseTask=state.task.find(t=>t.status==='active');
 for(const type of ['single','multiple','explain','apply']){
  await command('newTask',{id:baseTask.id});const draft=state.task.find(t=>t.status==='draft');
  await command('task',{...draft,type,track:type==='apply'?'apply':type==='explain'?'explain':'recognize',options:[{id:'a',text:'A'},{id:'b',text:'B'},{id:'c',text:'C'}],correct:type==='multiple'?['a','c']:['a'],publish:true,confirmSource:true});
  await command('start',{minutes:45,taskId:draft.id});const sess=state.session.find(x=>!x.completed);
  await command('attempt',{taskId:draft.id,sessionId:sess.id,result:'correct',selection:type==='single'?['a']:type==='multiple'?['a']:[],answer:type==='apply'?'Eigene Anwendung':'',confidence:'sure',revealed:type==='explain'});
  const a=state.attempt.find(a=>a.taskId===draft.id);check('Format '+type+' records the intended result',()=>assert.equal(a.result,type==='multiple'?'wrong':type==='explain'?'read':'correct'));
 }
 const immutable=state.task.find(t=>t.status==='superseded');
 const invalidEdit=await req('/api/data',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({command:'task',payload:{...immutable,publish:true,confirmSource:true},id:crypto.randomUUID(),revision})});check('Superseded versions cannot be overwritten',()=>assert.equal(invalidEdit.r.status,409));
 const packageTask={id:'q1',objective:'Paket-Ziel',family:'pkg-f',sourceTitle:'TEST-Quelle',sourceQuote:'Kommunikation umfasst Inhalte und Beziehungen.',page:1,prompt:'Welche Ebenen?',solution:'Inhalt und Beziehung',rubric:'Beide nennen',type:'recall',track:'recall',seconds:60,options:[],correct:[]};
 const pkg={format:'lernraum-package',version:1,packageId:'integration-package',title:'Testpaket',tasks:Array.from({length:500},(_,i)=>({...packageTask,id:'q'+i,family:'f'+i}))};
 const pf=await upload(JSON.stringify(pkg));const countBefore=state.task.length;await command('package',{courseId,package:pkg,hash:pf.hash,activate:true});check('500 complete package tasks imported',()=>assert.equal(state.task.length,countBefore+500));await command('package',{courseId,package:pkg,hash:pf.hash,activate:true});check('Package duplicate creates no tasks',()=>assert.equal(state.task.length,countBefore+500));
 await command('start',{minutes:5});const feed=state.session.find(x=>!x.completed),initial=feed.items.length;for(let i=0;i<initial;i++)await command('attempt',{taskId:feed.items[i].id,sessionId:feed.id,result:'skip'});check('Feed appends next batch without repeating families',()=>{const x=state.session.find(x=>x.id===feed.id);assert.ok(x.items.length>initial);assert.equal(new Set(x.items.map(i=>state.task.find(t=>t.id===i.id).familyId)).size,x.items.length);});await command('finish',{id:feed.id});
 const deleteTarget=state.task.find(t=>t.status==='active');const historyBefore=state.attempt.length;await command('start',{minutes:5,taskId:deleteTarget.id});await command('deleteTask',{id:deleteTarget.id});check('Deleting active task removes it from open sessions and preserves history',()=>{assert.equal(state.task.find(t=>t.id===deleteTarget.id).status,'archived');assert.ok(!state.session.filter(s=>!s.completed).some(s=>s.items.slice(s.index).some(x=>x.id===deleteTarget.id)));assert.equal(state.attempt.length,historyBefore);});await command('restoreTask',{id:deleteTarget.id});check('Trash restore preserves active status',()=>assert.equal(state.task.find(t=>t.id===deleteTarget.id).status,'active'));
 const saved=backupOf(state);await command('course',{name:'Temporary'});await command('restore',{backup:saved});check('Atomic backup restore recovers all entities',()=>assert.deepEqual(Object.fromEntries(Object.entries(state).map(([k,v])=>[k,v.sort((a,b)=>a.id.localeCompare(b.id))])),Object.fromEntries(Object.entries(saved.entities).map(([k,v])=>[k,v.sort((a,b)=>a.id.localeCompare(b.id))]))));
 const raceRev=revision;const request=(id,name)=>req('/api/data',{method:'POST',headers:{'content-type':'application/json',origin:base},body:JSON.stringify({command:'course',payload:{name},id,revision:raceRev})});const race=await Promise.all([request(crypto.randomUUID(),'Concurrent A'),request(crypto.randomUUID(),'Concurrent B')]);check('Concurrent writes use a revision guard',()=>assert.deepEqual(race.map(x=>x.r.status).sort(),[200,409]));await read();
 const foreign=await req('/api/data',{method:'POST',headers:{'content-type':'application/json',origin:'https://foreign.example'},body:JSON.stringify({command:'course',payload:{name:'Blocked'},id:crypto.randomUUID(),revision})});check('Foreign origins rejected',()=>assert.equal(foreign.r.status,403));
 check('Private source download is protected',()=>{});assert.equal((await req('/api/file?hash='+file.hash,{},false)).r.status,401);
 const b=await req('/api/file?hash='+file.hash);assert.equal(b.r.status,200);
 console.log(`${passed} integration checks passed.`);
}finally{await read();await command('restore',{backup:backupOf(original.state)});console.log('Original local test workspace restored.');}
