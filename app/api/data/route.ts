import {validatePackage} from '../../../lib/package.mjs';
import {identity,runtimeEnv,json,fail,snapshot,saveEntity,digest} from "../../../lib/server";
import {KINDS,plan,scoreChoice,validateTask,validateBackup,textChunks} from "../../../lib/core.mjs";
export async function GET(request:Request){try{const owner=await identity(request);return json(await snapshot(owner));}catch(e){return fail(e);}}
export async function POST(request:Request){try{
 const owner=await identity(request),{DB,BUCKET}=runtimeEnv();
 const raw=await request.text();if(raw.length>12*1024*1024)throw Error("Zu viele Daten in einer Anfrage.");
 const body=JSON.parse(raw),{command,payload:p={},id,revision}=body;
 if(typeof id!=="string"||id.length>100||!Number.isInteger(revision))throw Error("Ungültige Anfrage.");
 await DB.prepare("INSERT OR IGNORE INTO workspaces(owner,revision) VALUES (?,0)").bind(owner).run();
 if(await DB.prepare("SELECT id FROM commands WHERE owner=? AND id=?").bind(owner,id).first())return json({...await snapshot(owner),replayed:true});
 const snap=await snapshot(owner),s=snap.state;
 if(snap.revision!==revision)return json({error:"Änderungen auf einem anderen Gerät. Bitte aktualisieren."},409);
 const now=new Date().toISOString(),ops:D1PreparedStatement[]=[];
 const put=(kind:string,v:any)=>{ops.push(saveEntity(owner,kind,v));};
 const get=(kind:string,id:string)=>{const x=s[kind].find((x:any)=>x.id===id);if(!x)throw Error("Eintrag nicht gefunden: "+kind);return x;};
 const uid=()=>crypto.randomUUID();
 let notice="";
 if(command==="course"){
  if(!p.name?.trim()||p.name.length>120)throw Error("Bitte einen Modulnamen angeben.");
  if(p.exam&&!/^\d{4}-\d{2}-\d{2}$/.test(p.exam))throw Error("Prüfungsdatum ungültig.");
  put("course",{id:p.id?get("course",p.id).id:uid(),name:p.name.trim(),exam:p.exam||"",examType:p.examType||"Klausur"});
 }else if(command==="settings"){
  if(![5,10,20,30,45].includes(p.minutes))throw Error("Ungültiges Zeitbudget.");
  if(![0,5,10].includes(p.pauseEvery??5))throw Error("Ungültiger Pausentakt.");
  put("settings",{id:"main",minutes:p.minutes,pauseEvery:p.pauseEvery??5});
 }else if(command==="package"){
  const course=get("course",p.courseId),pack=validatePackage(p.package);
  const records:any[]=[];const put=(kind:string,v:any)=>records.push({kind,id:v.id,data:JSON.stringify(v)});
  if(!/^[a-f0-9]{64}$/.test(p.hash)||!await BUCKET.head(owner+"/"+p.hash))throw Error("Paketdatei fehlt.");
  const prior=s.document.find((d:any)=>d.courseId===course.id&&d.packageId===pack.packageId);
  if(prior){if(prior.hash!==p.hash)throw Error("Diese Paket-ID gehört bereits zu einer anderen Datei. Für Ergänzungen eine neue Paket-ID verwenden.");return json({...snap,notice:"Dieses Paket ist bereits importiert. Keine Duplikate erstellt."});}
  const docId=uid();put("document",{id:docId,rootId:docId,courseId:course.id,title:pack.title,topic:pack.topic||"",hash:p.hash,packageId:pack.packageId,version:1,at:now,pageCount:pack.tasks.length,status:"review",warnings:"KI-Aufgabenpaket: Quellenbelege und Lösungen fachlich prüfen. Originalunterlagen sind nicht in dieser JSON-Datei enthalten."});
  const objectives=new Map(),families=new Map();
  for(const t of pack.tasks){
   if(!objectives.has(t.objective)){const oid=uid();objectives.set(t.objective,oid);put("objective",{id:oid,courseId:course.id,label:t.objective});}
   if(!families.has(t.family))families.set(t.family,uid());
   const sourceId=uid();put("source",{id:sourceId,documentId:docId,page:t.page,position:pack.tasks.indexOf(t),text:t.sourceTitle+" · Seite "+t.page+"\n"+t.sourceQuote});
   put("task",{id:uid(),externalId:t.id,familyId:families.get(t.family),objectiveId:objectives.get(t.objective),epoch:docId,courseId:course.id,sourceId,type:t.type,track:t.track,prompt:t.prompt,solution:t.solution,rubric:t.rubric,options:t.options||[],correct:t.correct||[],seconds:t.seconds,status:p.activate?"active":"draft",version:1,previousId:null,generated:"chat-package",at:now,change:"Importiertes Aufgabenpaket"});
  }
  ops.push(DB.prepare("INSERT INTO entities(owner,kind,id,data) SELECT ?,json_extract(value, '$.kind'),json_extract(value, '$.id'),json_extract(value, '$.data') FROM json_each(?)").bind(owner,JSON.stringify(records)));
  notice=pack.tasks.length+" fertige Aufgaben importiert"+(p.activate?" und aktiviert.":". Unter Aufgaben prüfen und freigeben.");
 }else if(command==="import"){
  const course=get("course",p.courseId);
  if(!p.title?.trim()||!Array.isArray(p.pages)||p.pages.length>200)throw Error("Titel oder lesbare Seiten fehlen (max. 200 Seiten).");
  if(!/^[a-f0-9]{64}$/.test(p.hash)||!await BUCKET.head(owner+"/"+p.hash))throw Error("Originaldatei fehlt. Bitte erneut hochladen.");
  if(p.pages.some((x:any)=>typeof x.text!=="string"||!Number.isInteger(x.page)||x.page<1))throw Error("Seiten ungültig.");
  const content=p.pages.map((x:any)=>x.text).join("\n");
  if(content.trim().length<40)throw Error("Zu wenig lesbarer Text. Bitte Text einfügen; Bild-PDFs benötigen zuerst Texterkennung.");
  if(content.length>500000)throw Error("Bitte das Dokument in kleinere Abschnitte teilen.");
  const contentHash=await digest(new TextEncoder().encode(content.replace(/\s+/g," ").trim()));
  const duplicate=s.document.find((d:any)=>d.courseId===course.id&&(d.hash===p.hash||d.contentHash===contentHash));
  if(duplicate)return json({...snap,notice:"Bereits vorhanden: "+duplicate.title+". Es wurden keine Aufgaben vervielfacht."});
  const previous=p.previousId?get("document",p.previousId):null;
  if(previous&&previous.courseId!==course.id)throw Error("Version gehört zu einem anderen Modul.");
  const root=previous?.rootId||uid(),docId=uid();
  const doc={id:docId,rootId:root,previousId:previous?.id||null,courseId:course.id,title:p.title.trim().slice(0,160),topic:(p.topic||"").slice(0,120),hash:p.hash,contentHash,version:previous?Math.max(...s.document.filter((d:any)=>d.rootId===root).map((d:any)=>d.version))+1:1,at:now,pageCount:p.pages.length,status:"review",warnings:p.pages.some((x:any)=>x.text.trim().length<30)?"Einzelne Seiten ohne sicheren Text; Grafiken und Formeln bitte am Original prüfen.":"Extraktion ungeprüft: Reihenfolge, Formeln und Vollständigkeit am Original prüfen."};
  put("document",doc);
  const chunks=textChunks(p.pages);
  if(!chunks.length)throw Error("Keine geeigneten Textabschnitte. Bitte Text mit vollständigen Absätzen einfügen.");
  const existingSources=s.source.filter((x:any)=>s.document.find((d:any)=>d.id===x.documentId)?.rootId===root);
  const currentTexts=new Set(chunks.map((x:any)=>x.text.replace(/\s+/g," ").trim()));
  for(const source of existingSources.filter((x:any)=>x.documentId===previous?.id)){
   if(!currentTexts.has(source.text.replace(/\s+/g," ").trim()))for(const old of s.task.filter((t:any)=>t.sourceId===source.id&&t.status==="active"))put("task",{...old,status:"suspended",change:"Quelle geändert oder Abschnitt entfernt: bitte prüfen"});
  }
  let fresh=0,unchanged=0;
  for(const [index,chunk] of chunks.entries()){
    const normalized=chunk.text.replace(/\s+/g," ").trim();
    const same=existingSources.find((x:any)=>x.text.replace(/\s+/g," ").trim()===normalized);
    const sourceId=uid();put("source",{id:sourceId,documentId:docId,page:chunk.page,text:chunk.text,position:index});
    if(same){unchanged++;continue;}
    if(fresh>=8)continue;
    const oldSource=existingSources.find((x:any)=>x.documentId===previous?.id&&x.position===index);
    const oldTask=oldSource?s.task.filter((t:any)=>t.sourceId===oldSource.id&&t.status!=="superseded").at(-1):null;
    if(oldTask?.status==="active")put("task",{...oldTask,status:"suspended",change:"Neue Quelle wartet auf Prüfung"});
    const objectiveId=oldTask?.objectiveId||uid(),familyId=oldTask?.familyId||uid();
    if(!oldTask)put("objective",{id:objectiveId,courseId:course.id,label:(p.topic||doc.title)+" · Abschnitt "+(index+1)});
    put("task",{id:uid(),familyId,objectiveId,epoch:docId,courseId:course.id,sourceId,type:"recall",track:"recall",prompt:"Gib die Kernaussage aus „"+doc.title+"“, Abschnitt "+(index+1)+", in eigenen Worten wieder. Präzisiere diese Frage vor der Freigabe.",solution:chunk.text,rubric:"Die wesentlichen Aussagen des Quellenabschnitts sinngemäß wiedergeben. Fachbegriffe und Einschränkungen erhalten.",options:[],correct:[],seconds:90,status:"draft",version:oldTask?oldTask.version+1:1,previousId:oldTask?.id||null,generated:"extractive",at:now,change:previous?"Änderung / mögliche Abweichung: manuell vergleichen":"Neu"});
    fresh++;
  }
  notice=fresh+" quellenbasierte Entwürfe, "+unchanged+" unveränderte Abschnitte. Maximal 8 Entwürfe je Import; weitere Inhalte können manuell ergänzt werden.";
 }else if(command==="task"){
  const old=get("task",p.id);
  if(["superseded","archived"].includes(old.status))throw Object.assign(Error("Diese Version ist unveränderlich. Bitte die aktuelle Aufgabe öffnen."),{status:409});
  const source=get("source",p.sourceId||old.sourceId);
  const doc=get("document",source.documentId);
  const updated=validateTask({...old,prompt:String(p.prompt||"").slice(0,6000),solution:String(p.solution||"").slice(0,8000),rubric:String(p.rubric||"").slice(0,4000),type:p.type,track:p.track,seconds:Number(p.seconds),options:p.options||[],correct:p.correct||[],sourceId:source.id,status:p.publish?"active":"draft"});
  if(p.publish&&!p.confirmSource)throw Error("Bitte Quellenbezug und Lösung ausdrücklich prüfen.");
  if(old.status==="active"||old.status==="suspended"){
   updated.id=uid();updated.version=old.version+1;updated.previousId=old.id;
   updated.epoch=p.cosmetic&&old.solution===updated.solution&&old.rubric===updated.rubric&&old.track===updated.track&&old.type===updated.type&&old.sourceId===updated.sourceId?old.epoch:updated.id;
   put("task",{...old,status:"superseded"});
  }
  if(updated.previousId&&p.publish){
   const prev=get("task",updated.previousId);put("task",{...prev,status:"superseded"});
  }
  if(p.objectiveLabel?.trim())put("objective",{...get("objective",old.objectiveId),label:String(p.objectiveLabel).trim().slice(0,250)});
  put("task",updated);put("document",{...doc,status:"reviewed"});
 }else if(command==="newTask"){
  const base=get("task",p.id);
  put("task",{...base,id:uid(),previousId:null,version:1,status:"draft",prompt:"Neue Frage zu diesem Quellenabschnitt",type:p.variant?base.type:"apply",track:p.variant?base.track:"apply",familyId:p.variant?base.familyId:uid(),epoch:p.variant?base.epoch:uid(),solution:base.solution,seconds:p.variant?base.seconds:240,change:p.variant?"Neue Variante desselben Lernziels":"Manuell ergänzte Anwendung"});
 }else if(command==="deleteTask"){
  const t=get("task",p.id);if(t.status==="archived")return json({...snap,notice:"Die Aufgabe liegt bereits im Papierkorb."});put("task",{...t,status:"archived",deletedAt:now,previousStatus:t.status});
  for(const session of s.session.filter((x:any)=>!x.completed)){
   const items=[...session.items.slice(0,session.index),...session.items.slice(session.index).filter((x:any)=>x.id!==t.id)];
   put("session",{...session,items,completed:session.index>=items.length,finishedAt:session.index>=items.length?now:null});
  }
  notice="Aufgabe in den Papierkorb verschoben. Deine bisherigen Antworten bleiben erhalten.";
 }else if(command==="restoreTask"){
  const t=get("task",p.id);if(t.status!=="archived")throw Error("Diese Aufgabe liegt nicht im Papierkorb.");
  put("task",{...t,status:t.previousStatus||"draft",deletedAt:null});notice="Aufgabe wiederhergestellt.";
 }else if(command==="status"){
  const t=get("task",p.id);
  if(!["suspended","active","archived"].includes(p.status)||t.status==="draft"||t.status==="superseded")throw Error("Statuswechsel nicht möglich.");
  put("task",{...t,status:p.status});
 }else if(command==="report"){
  const t=get("task",p.id);put("issue",{id:uid(),taskId:t.id,text:(p.text||"Aufgabe prüfen").slice(0,2000),at:now});put("task",{...t,status:"suspended"});
 }else if(command==="start"){
  const minutes=Number(p.minutes);
  if(![5,10,20,30,45].includes(minutes))throw Error("Bitte Zeitbudget wählen.");
  const active=s.session.find((x:any)=>!x.completed);
  if(active)return json({...snap,notice:"Die bestehende Sitzung kann fortgesetzt werden."});
  const chosen=p.taskId?get("task",p.taskId):null;
  if(chosen&&chosen.status!=="active")throw Error("Bitte zuerst die Aufgabe freigeben.");
  const selected=chosen?{items:[{id:chosen.id,reason:"Bewusst gewählte Vertiefung · außerhalb des Tagesplans"}],uncovered:0}:plan(s,now,minutes,!!p.extra);
  if(!selected.items.length) return json({...snap,notice:"Für heute ist nichts Passendes mehr offen. Prüfe neue Entwürfe oder komme zur nächsten Wiederholung zurück."});
  put("session",{id:uid(),items:selected.items,index:0,startedAt:now,minutes,completed:false,uncovered:selected.uncovered});
 }else if(command==="finish"){
  const session=get("session",p.id);put("session",{...session,completed:true,finishedAt:now});
 }else if(command==="attempt"){
  if(s.attempt.some((a:any)=>a.id===id))return json({...snap,replayed:true});
  const t=get("task",p.taskId),session=get("session",p.sessionId);
  if(session.completed||session.items[session.index]?.id!==t.id)throw Object.assign(Error("Sitzung wurde bereits weitergeführt. Bitte aktualisieren."),{status:409});
  if(!["correct","partial","wrong","skip","read"].includes(p.result))throw Error("Bewertung fehlt.");
  let result=p.result;
  if(t.status!=="active")result="pending";
  else if(result!=="skip"&&t.type==="explain")result="read";
  else if(result!=="skip"&&(t.type==="single"||t.type==="multiple"))result=scoreChoice(t,p.selection||[]);
  if(result!=="skip"&&result!=="read"&&!p.revealed&&!String(p.answer||"").trim()&&!(p.selection||[]).length)throw Error("Bitte zuerst antworten oder bewusst die Lösung ansehen.");
  put("attempt",{id,taskId:t.id,objectiveId:t.objectiveId,familyId:t.familyId,epoch:t.epoch,track:t.track,courseId:t.courseId,sessionId:session.id,result,answer:String(p.answer||"").slice(0,10000),selection:p.selection||[],confidence:p.confidence||"unsure",help:!!p.help,revealed:!!p.revealed,at:now,clientAt:p.clientAt||now,seconds:Math.min(3600,Math.max(0,Number(p.seconds)||0)),assessment:t.type==="single"||t.type==="multiple"?"exact-choice":"self-rubric",scheduler:"rules-v1"});
  const index=session.index+1;let items=session.items;
  if(index>=items.length){const used=new Set(items.map((x:any)=>get("task",x.id).familyId));const next=plan({...s,task:s.task.filter((x:any)=>!used.has(x.familyId))},now,session.minutes,true);items=[...items,...next.items];}
  put("session",{...session,items,index,completed:index>=items.length,finishedAt:index>=items.length?now:null});
 }else if(command==="recover"){
  const t=get("task",p.taskId);
  if(typeof p.originalId!=="string")throw Error("Ursprüngliche Antwort-ID fehlt.");
  if(s.attempt.some((a:any)=>a.id===p.originalId))return json({...snap,notice:"Diese Antwort ist bereits gespeichert."});
  put("attempt",{id:p.originalId,taskId:t.id,objectiveId:t.objectiveId,familyId:t.familyId,epoch:t.epoch,track:t.track,courseId:t.courseId,sessionId:p.sessionId,result:"pending",answer:String(p.answer||"").slice(0,10000),selection:p.selection||[],confidence:p.confidence||"unsure",help:!!p.help,revealed:!!p.revealed,at:now,clientAt:p.clientAt,seconds:p.seconds||0,assessment:"recovered-conflict",scheduler:"rules-v1"});
  notice="Antwort als ungeklärten Versuch gesichert. Sie verändert keinen Wiederholungsabstand.";
 }else if(command==="correct"){
  const original=get("attempt",p.attemptId);if(["skip","read"].includes(original.result))throw Error("Überspringen und Lesen bleiben unverändert.");if(!["correct","partial","wrong","pending"].includes(p.result))throw Error("Ungültige Korrektur.");
  put("correction",{id:uid(),attemptId:p.attemptId,result:p.result,reason:String(p.reason||"Manuell korrigiert").slice(0,2000),at:now});
 }else if(command==="restore"){
  const b=validateBackup(p.backup);
  for(const f of b.files)if(!/^[a-f0-9]{64}$/.test(f.hash)||!await BUCKET.head(owner+"/"+f.hash))throw Error("Eine Originaldatei fehlt. Restore abgebrochen.");
  const count=KINDS.reduce((n,k)=>n+b.entities[k].length,0);
  if(count>100000)throw Error("Browser-Restore unterstützt maximal 100.000 Datensätze.");
  ops.push(DB.prepare("DELETE FROM entities WHERE owner=?").bind(owner));
  for(const kind of KINDS)ops.push(DB.prepare("INSERT INTO entities(owner,kind,id,data) SELECT ?,?,json_extract(value, '$.id'),value FROM json_each(?)").bind(owner,kind,JSON.stringify(b.entities[kind])));
  notice="Backup wiederhergestellt. Quellen und Lernereignisse wurden übernommen.";
 }else throw Error("Unbekannter Vorgang.");
 const guard=DB.prepare("INSERT INTO commands(owner,id,expected,created) VALUES (?,?,?,?)").bind(owner,id,revision,now);
 await DB.batch([guard,...ops]);
 return json({...await snapshot(owner),notice});
}catch(e){return fail(e);}}

