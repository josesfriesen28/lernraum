import {validateTask} from './core.mjs';
export function validatePackage(p){
 if(p?.format!=='lernraum-package'||p.version!==1)throw Error('Erwartet wird ein Lernraum-Aufgabenpaket Version 1.');
 for(const key of ['packageId','title'])if(typeof p[key]!=='string'||!p[key].trim()||p[key].length>200)throw Error('Paket-ID oder Titel fehlt.');
 if(!Array.isArray(p.tasks)||!p.tasks.length||p.tasks.length>500)throw Error('Ein Paket muss 1 bis 500 Aufgaben enthalten.');
 const ids=new Set();
 p.tasks.forEach((t,i)=>{const fail=m=>{throw Error('Aufgabe '+(i+1)+': '+m);};
 for(const k of ['id','objective','family','sourceTitle','sourceQuote'])if(typeof t[k]!=='string'||!t[k].trim())fail(k+' fehlt.');
 if(ids.has(t.id))fail('Doppelte Aufgaben-ID.');ids.add(t.id);
 if(!Number.isInteger(t.page)||t.page<1)fail('Seite muss eine positive Zahl sein.');
 for(const k of ['prompt','solution','rubric','sourceQuote'])if(typeof t[k]!=='string'||t[k].length>12000)fail(k+' ungültig oder zu lang.');
 validateTask(t);
 if(['single','multiple'].includes(t.type)&&t.track!=='recognize')fail('Auswahlaufgaben benötigen recognize.');
 });return p;
}
