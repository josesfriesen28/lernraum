'use client';
// XP-Übersicht und Abzeichen-Shop (seit v0.11.0).
import {useMemo} from 'react';
import {Trophy} from 'lucide-react';
import {BADGES,XP_RULES,xpSummary,canBuy} from '../lib/rewards.mjs';
type Any=any;

export function XpBar({x}:{x:Any}){
 const span=x.levelTo-x.levelFrom,pos=Math.min(span,x.earned-x.levelFrom);
 return <div className="xp-bar" role="progressbar" aria-label="Fortschritt zur nächsten Stufe" aria-valuemin={0} aria-valuemax={span} aria-valuenow={pos}><span style={{width:(100*pos/span)+'%'}}/></div>;
}

export default function Rewards({state,busy,act}:{state:Any;busy:boolean;act:(c:string,p:Any)=>Promise<Any>}){
 const x=useMemo(()=>xpSummary(state),[state]);
 return <>
  <div className="page-head"><div><p className="eyebrow">LERNEN LOHNT SICH</p><h1>XP & Abzeichen</h1><p>Jede Antwort bringt XP. Tausche sie gegen Abzeichen, die du dir verdient hast.</p></div></div>
  <section className="card level-card">
   <div className="level-badge" aria-hidden="true">{x.level}</div>
   <div className="level-text"><p className="tiny-label">STUFE {x.level} · {x.levelName.toUpperCase()}</p><h2>{x.balance} XP <small>verfügbar</small></h2><XpBar x={x}/><p className="quiet">{x.earned} XP gesammelt · noch {x.levelTo-x.earned} XP bis Stufe {x.level+1}{x.spent?` · ${x.spent} XP in Abzeichen`:''}</p></div>
  </section>
  <div className="stats"><div><strong>{x.correct}</strong><span>richtige Antworten</span></div><div><strong>{x.streak}</strong><span>Lerntage in Folge (Rekord)</span></div><div><strong>{x.owned.length}/{BADGES.length}</strong><span>Abzeichen</span></div></div>
  <section className="card"><div className="section-head"><h2><Trophy size={18}/> Abzeichen-Shop</h2><span className="tiny-label">{x.balance} XP</span></div>
   <div className="badge-grid">{BADGES.map(b=>{const owned=x.owned.includes(b.id),why=owned?'':canBuy(state,b.id),locked=!owned&&!!b.need&&!b.need(x),prog=b.progress?b.progress(x):null;
    return <article key={b.id} className={'badge-card'+(owned?' owned':locked?' locked':'')}>
     <div className="badge-icon" aria-hidden="true">{b.icon}</div>
     <h3>{b.name}</h3><p>{b.text}</p>
     {locked&&prog&&<div className="xp-bar small" aria-label={`${Math.min(prog[0],prog[1])} von ${prog[1]}`}><span style={{width:Math.min(100,100*prog[0]/prog[1])+'%'}}/></div>}
     {owned?<button className={x.featured===b.id?'soft chosen':'soft'} disabled={busy||x.featured===b.id} onClick={()=>act('feature',{badge:b.id})}>{x.featured===b.id?'Wird angezeigt':'Am Profil zeigen'}</button>
      :<button className="primary" disabled={busy||!!why} title={why} onClick={()=>act('buy',{badge:b.id})}>{locked?'🔒 ':''}{b.price} XP</button>}
    </article>;})}</div>
   <p className="quiet">Gesperrte Abzeichen werden frei, sobald du die Bedingung erfüllst. Danach kannst du sie mit XP kaufen.</p>
  </section>
  <section className="card"><h2>So bekommst du XP</h2><ul className="xp-rules">{XP_RULES.map(([t,n])=><li key={t as string}><span>{t}</span><b>+{n} XP</b></li>)}</ul>
   <p className="quiet">XP werden aus deinen gespeicherten Antworten berechnet. Mit dem Sync-Code nimmst du sie und deine Abzeichen auf andere Geräte mit. Nachträgliche Korrekturen im Verlauf ändern auch die XP.</p></section>
 </>;
}
