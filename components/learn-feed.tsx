'use client';
// Lernfeed im Reel-Stil (seit v0.4.0).
// Eine Karte füllt den Bildschirm. Antippen beantwortet, Hochwischen / Scrollen /
// Pfeiltaste wechselt zur nächsten Karte. Serien, kleine Belohnungsanimationen
// und Haptik sorgen für Tempo – die Lernregeln bleiben dabei unverändert:
// Überspringen zählt nicht als Erfolg, offene Antworten werden erst selbst bewertet.
import {useEffect, useMemo, useRef, useState} from 'react';
import {X, Check, ArrowUpRight, Leaf} from 'lucide-react';
import {orderedOptions, scoreChoice} from '../lib/core.mjs';

type Any = any;

const typeLabel: Any = {recall: 'Freier Abruf', single: 'Single-Choice', multiple: 'Multiple-Choice', apply: 'Anwendung', explain: 'Erklärkarte'};
const themes = ['moss', 'sky', 'sun', 'plum', 'coral', 'mint'];
const winLines = ['Sitzt!', 'Stark!', 'Genau so.', 'Treffer!', 'Läuft bei dir.', 'Sauber!'];
const SWIPE = 90;        // px, ab denen ein Wisch die Karte wechselt
const WHEEL = 140;       // aufsummierte Scroll-Distanz am Kartenende
const AUTO_MS = 1300;    // automatisches Weiter nach richtiger Auswahl

const buzz = (pattern: number | number[]) => {try {navigator.vibrate?.(pattern);} catch {}};
const store = {
  get: (k: string) => {try {return sessionStorage.getItem(k);} catch {return null;}},
  set: (k: string, v: string) => {try {sessionStorage.setItem(k, v);} catch {}},
};

const courseColors = ['#2f7d5b', '#3b6fb5', '#b5652f', '#8a4fb0', '#b0435a', '#2f8a8a'];
/** Fach der Karte: Kürzel (z. B. „B2“) + Name, Farbe je Fach. */
export function courseInfo(state: Any, courseId: string) {
  const c = state.course.find((x: Any) => x.id === courseId);
  if (!c) return null;
  const name = String(c.name || '');
  const m = name.match(/^([A-Z]{1,3}\d+(?:\.\d+)?)\s*[·:\-–]?\s*(.*)$/);
  const short = m ? m[1] : /^english/i.test(name) ? 'EN' : name.split(/\s+/)[0].slice(0, 6);
  const rest = m ? m[2] : name;
  let h = 0; for (const ch of c.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const idx = [...state.course].sort((a: Any, b: Any) => String(a.name).localeCompare(String(b.name))).findIndex((x: Any) => x.id === c.id);
  return {short, rest, name, color: courseColors[(idx >= 0 ? idx : h) % courseColors.length]};
}
function CourseTag({info}: Any) {
  if (!info) return null;
  return <div className="reel-course" style={{'--cc': info.color} as Any} title={info.name}><b>{info.short}</b><span>{info.rest}</span></div>;
}

function Figure({source, open}: Any) {
  if (!source?.image && !source?.url) return null;
  return <figure className="reel-figure">
    {source.image && open && <a href={new URL('content/' + source.image, document.baseURI).href} target="_blank" rel="noreferrer" aria-label="Schaubild groß öffnen"><img src={new URL('content/' + source.image, document.baseURI).href} alt="Schaubild (nachgezeichnet)" loading="lazy"/></a>}
    {source.url && <figcaption><a href={source.url} target="_blank" rel="noreferrer">Original-Folie ansehen (Moodle, S. {source.page}) <ArrowUpRight size={14}/></a></figcaption>}
  </figure>;
}

export default function LearnFeed({userId, task: t, session, state, busy, error, onDismissError, onAnswer, onClose, onFinish, onReport}: Any) {
  const every = state.settings[0]?.pauseEvery ?? 5;
  const key = 'lernraum:answer:' + userId + ':' + session.id + ':' + t.id;
  const streakKey = 'lernraum:streak:' + session.id;
  const doneKey = 'lernraum:done:' + session.id;
  const choice = ['single', 'multiple'].includes(t.type);
  const explain = t.type === 'explain';
  const theme = themes[session.index % themes.length];
  const source = state.source.find((x: Any) => x.id === t.sourceId);
  const doc = state.document.find((x: Any) => x.id === source?.documentId);
  const nextTask = state.task.find((x: Any) => x.id === session.items[session.index + 1]?.id);
  const options = useMemo(() => choice ? orderedOptions(t, session.id) : [], [t, session.id, choice]);

  const [a, A] = useState<Any>({answer: '', selection: [], confidence: 'unsure', help: false, revealed: false, shown: false, started: Date.now()});
  const [ready, Ready] = useState(false);
  const [pause, Pause] = useState(every > 0 && session.index > 0 && session.index % every === 0);
  const [rating, Rating] = useState('');
  const [streak, Streak] = useState(() => Number(store.get(streakKey) || 0));
  const [done] = useState(() => Number(store.get(doneKey) || 0));
  const [fx, Fx] = useState<'' | 'win' | 'miss'>('');
  const [toast, Toast] = useState('');
  const [hint, Hint] = useState('');
  const [drag, Drag] = useState(0);
  const [leaving, Leaving] = useState(false);
  const [auto, Auto] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const advancing = useRef(false);
  const touch = useRef<{y: number; t: number; armed: boolean} | null>(null);
  const wheel = useRef({sum: 0, at: 0});
  const autoTimer = useRef<number | undefined>(undefined);
  const wheelReset = useRef<number | undefined>(undefined);
  const goRef = useRef<(r?: string) => boolean>(() => false);
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);

  // Antwortentwurf pro Karte merken (Wiederaufnahme nach Neuladen).
  useEffect(() => {try {const saved = localStorage.getItem(key); if (saved) A(JSON.parse(saved));} catch {} Ready(true);}, [key]);
  useEffect(() => {if (ready) try {localStorage.setItem(key, JSON.stringify(a));} catch {}}, [a, ready, key]);
  useEffect(() => {store.set(streakKey, String(streak));}, [streak, streakKey]);
  // Nach dem Abgleich das Feedback ins Bild holen.
  useEffect(() => {
    if (!a.shown || !ready) return;
    const el = bodyRef.current, fb = el?.querySelector('.reel-feedback') as HTMLElement | null;
    if (el && fb && fb.offsetTop + 60 > el.scrollTop + el.clientHeight) el.scrollTo({top: Math.max(0, fb.offsetTop - 90), behavior: reduced ? 'auto' : 'smooth'});
  }, [a.shown, ready, reduced]);
  // Hintergrundseite festhalten, solange der Feed offen ist.
  useEffect(() => {const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => {document.body.style.overflow = prev;};}, []);
  useEffect(() => () => {window.clearTimeout(autoTimer.current); window.clearTimeout(wheelReset.current);}, []);
  useEffect(() => {if (!toast) return; const id = window.setTimeout(() => Toast(''), 1600); return () => window.clearTimeout(id);}, [toast]);
  useEffect(() => {if (!hint) return; const id = window.setTimeout(() => Hint(''), 2200); return () => window.clearTimeout(id);}, [hint]);

  const needsRating = a.shown && !choice && !explain && !rating;
  const verdict = choice && a.shown ? scoreChoice(t, a.selection) : '';

  function cancelAuto() {if (autoTimer.current) {window.clearTimeout(autoTimer.current); autoTimer.current = undefined; Auto(false);}}

  function celebrate(win: boolean) {
    Fx(win ? 'win' : 'miss');
    if (win) {
      const next = streak + 1;
      Streak(next);
      buzz(18);
      if ([3, 5, 10, 15, 20, 30, 50].includes(next)) Toast(next + 'er-Serie 🔥');
      else Toast(winLines[(session.index + next) % winLines.length]);
    } else {
      Streak(0);
      buzz([12, 50, 12]);
    }
  }

  // Auswahl prüfen. Bei Single-Choice passiert das direkt beim Antippen.
  function reveal(selection = a.selection) {
    if (a.shown || busy) return;
    const has = choice ? selection.length > 0 : a.answer.trim().length > 0;
    A({...a, selection, shown: true, revealed: !has});
    if (!choice || !has) return;
    const win = scoreChoice(t, selection) === 'correct';
    celebrate(win);
    if (win && !reduced && !source?.image) {Auto(true); autoTimer.current = window.setTimeout(() => {autoTimer.current = undefined; Auto(false); goRef.current();}, AUTO_MS);}
  }

  function pick(id: string) {
    if (a.shown || busy) return;
    buzz(6);
    if (t.type === 'single') return reveal([id]);
    A({...a, selection: a.selection.includes(id) ? a.selection.filter((x: string) => x !== id) : [...a.selection, id]});
  }

  async function commit(result: string) {
    advancing.current = true;
    const ok = await onAnswer({...a, taskId: t.id, sessionId: session.id, result, clientAt: new Date().toISOString(), seconds: (Date.now() - a.started) / 1000});
    if (ok) {
      try {localStorage.removeItem(key);} catch {}
      store.set(doneKey, String(done + 1));
    } else {
      advancing.current = false; Leaving(false); Drag(0);
    }
  }

  // Zur nächsten Karte. Liefert false, wenn noch etwas fehlt.
  function go(selfRating = rating) {
    if (busy || advancing.current) return false;
    cancelAuto();
    if (pause) {Pause(false); Drag(0); return true;}
    let result: string;
    if (!a.shown && !explain) result = 'skip';
    else if (explain) result = 'read';
    else if (choice) result = verdict || 'wrong';
    else if (selfRating) result = selfRating;
    else {
      Hint('Erst ehrlich bewerten – dann geht’s weiter.'); buzz([8, 40, 8]); Drag(0);
      return false;
    }
    if (result === 'skip') Streak(0);
    Leaving(true);
    window.setTimeout(() => commit(result), reduced ? 0 : 240);
    return true;
  }

  goRef.current = go;

  function rate(r: string) {
    if (busy || advancing.current) return;
    Rating(r);
    celebrate(r === 'correct');
    window.setTimeout(() => goRef.current(r), reduced ? 0 : 450);
  }

  // Ist der Karteninhalt bis unten gelesen?
  const atEnd = () => {const el = bodyRef.current; return !el || el.scrollTop + el.clientHeight >= el.scrollHeight - 4;};

  function onTouchStart(e: React.TouchEvent) {
    cancelAuto();
    const target = e.target as HTMLElement;
    if (target.closest('textarea,input,select')) {touch.current = null; return;}
    touch.current = {y: e.touches[0].clientY, t: Date.now(), armed: atEnd()};
  }
  function onTouchMove(e: React.TouchEvent) {
    const s = touch.current; if (!s) return;
    const dy = s.y - e.touches[0].clientY;
    if (!s.armed) {if (dy > 0 && atEnd()) {s.armed = true; s.y = e.touches[0].clientY;} return;}
    Drag(Math.max(0, dy));
  }
  function onTouchEnd() {
    const s = touch.current; touch.current = null; if (!s || !s.armed) {Drag(0); return;}
    const fast = drag > 40 && drag / Math.max(1, Date.now() - s.t) > 0.6;
    if (drag > SWIPE || fast) go(); else Drag(0);
  }
  function onWheel(e: React.WheelEvent) {
    cancelAuto();
    if (e.deltaY <= 0) {wheel.current.sum = 0; return;}
    if (!atEnd()) return;
    const now = Date.now();
    if (now - wheel.current.at > 400) wheel.current.sum = 0;
    wheel.current.at = now;
    wheel.current.sum += e.deltaY;
    Drag(Math.min(SWIPE, wheel.current.sum / 2));
    window.clearTimeout(wheelReset.current);
    wheelReset.current = window.setTimeout(() => {if (!advancing.current) Drag(0); wheel.current.sum = 0;}, 300);
    if (wheel.current.sum > WHEEL) {wheel.current.sum = 0; if (!go()) Drag(0);}
  }

  // Tastatur: ↓/Leertaste weiter, 1–6 Auswahl, Enter prüfen, Esc schließen.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing = (e.target as HTMLElement)?.closest?.('textarea,input,select');
      if (e.key === 'Escape') {onClose(); return;}
      if (typing) {if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) reveal(); return;}
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {e.preventDefault(); go(); return;}
      if (e.key === 'Enter') {if (!a.shown) reveal(); else go(); return;}
      const n = Number(e.key);
      if (choice && n >= 1 && n <= options.length) pick(options[n - 1].id);
      if (needsRating && n >= 1 && n <= 3) rate(['wrong', 'partial', 'correct'][n - 1]);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const progress = Math.min(100, (session.index / Math.max(1, session.items.length)) * 100);
  const lift = leaving ? 0 : Math.min(drag, 220);
  const cardStyle: Any = leaving ? undefined : {transform: `translateY(${-lift}px) rotate(${-lift / 60}deg)`, transition: drag ? 'none' : undefined};
  const peekStyle: Any = {transform: `translateY(${18 - lift / 12}px) scale(${Math.min(1, 0.93 + lift / 3000)})`, opacity: Math.min(1, 0.55 + lift / 300)};
  const footerText = pause ? 'Wischen, wenn du bereit bist'
    : needsRating ? 'Wie war deine Antwort?'
    : !a.shown && !explain ? 'Hochwischen = überspringen (zählt nicht)'
    : 'Hochwischen für die nächste Karte';

  return (
    <section className={`reel theme-${theme}`} role="dialog" aria-label="Lernfeed" onWheel={onWheel} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <header className="reel-top">
        <button className="reel-icon" aria-label="Später fortsetzen" onClick={onClose}><X size={22}/></button>
        <div className="reel-progress" aria-label={`Karte ${session.index + 1} von ${session.items.length}`}><span style={{width: progress + '%'}}/></div>
        <div className={'reel-streak' + (streak >= 3 ? ' hot' : '') + (fx === 'win' ? ' bump' : '')} title="Richtige Antworten in Folge" key={streak}>
          <span aria-hidden="true">🔥</span>{streak}
        </div>
      </header>

      <div className="reel-stack">
        {!pause && <article className="reel-card peek" style={peekStyle} aria-hidden="true">
          {nextTask && <CourseTag info={courseInfo(state, nextTask.courseId)}/>}
          <span className="reel-chip">{nextTask ? typeLabel[nextTask.type] : 'Gleich mehr'}</span>
          <h2>{nextTask?.prompt || 'Nächste Karte wird geladen …'}</h2>
        </article>}

        <article className={'reel-card current' + (leaving ? ' leaving' : '') + (fx ? ' fx-' + fx : '')} style={cardStyle} key={pause ? 'pause' : t.id}>
          {fx === 'win' && <div className="burst" aria-hidden="true">{Array.from({length: 14}, (_, i) => <i key={i} style={{'--a': (i * 360 / 14) + 'deg', '--d': (60 + (i % 3) * 28) + 'px'} as Any}/>)}</div>}
          {toast && <div className="reel-toast" role="status">{toast}</div>}

          <div className="reel-body" ref={bodyRef} onScroll={cancelAuto}>
            {pause ? (
              <div className="reel-pause">
                <Leaf size={42}/>
                <h1>Kurz durchatmen.</h1>
                <p>{done} Karten geschafft. Blick in die Ferne, Schultern lockern – dann weiterwischen.</p>
                <button className="reel-main" onClick={() => go()}>Weiter geht’s</button>
              </div>
            ) : <>
              <CourseTag info={courseInfo(state, t.courseId)}/>
              <div className="reel-meta">
                <span className="reel-chip">{typeLabel[t.type]}</span>
                <span>Karte {session.index + 1}{done ? ` · ${done} geschafft` : ''}</span>
              </div>
              {t.status !== 'active' && <p className="reel-warn">Diese Version wurde geändert oder ausgesetzt. Der Versuch wird als ungeklärt gespeichert.</p>}
              <h1 className="reel-q">{t.prompt}</h1>

              {explain && <div className="reel-explain preserve">{t.solution}</div>}
              {explain && <Figure source={source} open/>}

              {choice && <>
                <p className="reel-instr">{t.type === 'multiple' ? 'Alle richtigen antippen, dann prüfen.' : 'Tippe die richtige Antwort.'}</p>
                <div className="reel-options">
                  {options.map((o: Any, i: number) => {
                    const picked = a.selection.includes(o.id), right = t.correct.includes(o.id);
                    const cls = !a.shown ? (picked ? 'picked' : '') : right ? 'right' : picked ? 'wrong' : 'dim';
                    return <button key={o.id} className={'reel-option ' + cls} style={{'--i': i} as Any} disabled={busy || a.shown} aria-pressed={picked} onClick={() => pick(o.id)}>
                      <span className="key">{i + 1}</span><span>{o.text}</span>{a.shown && right && <Check size={18}/>}
                    </button>;
                  })}
                </div>
              </>}

              {!choice && !explain && <textarea className="reel-input" rows={4} value={a.answer} disabled={a.shown || busy} placeholder="In eigenen Worten – Stichpunkte reichen." onChange={e => A({...a, answer: e.target.value})}/>}

              {!a.shown && !explain && <div className="reel-row">
                <button className={'reel-pill' + (a.confidence === 'guess' ? ' on' : '')} onClick={() => A({...a, confidence: a.confidence === 'guess' ? 'unsure' : 'guess'})} aria-pressed={a.confidence === 'guess'}>🎲 Ich rate</button>
                <button className={'reel-pill' + (a.help ? ' on' : '')} onClick={() => A({...a, help: true})}>Quelle als Hilfe</button>
              </div>}
              {a.help && !a.shown && <div className="reel-source"><p>{source?.text}</p><Figure source={source} open/><small>Hilfe ist für diesen Versuch vermerkt.</small></div>}

              {a.shown && !explain && <div className={'reel-feedback ' + (verdict || 'open')}>
                <p className="reel-verdict">{choice ? (verdict === 'correct' ? 'Richtig!' : 'Knapp daneben – so ist’s richtig:') : a.revealed ? 'Lösung (ohne eigene Antwort angesehen)' : 'Vergleiche mit der Musterlösung'}</p>
                <div className="preserve">{t.solution}</div>
                {t.rubric && !choice && <div className="reel-rubric"><b>Worauf es ankommt</b><p className="preserve">{t.rubric}</p></div>}
                <Figure source={source} open/>
                {doc && !source?.url && <a href={'/api/file?hash=' + doc.hash + '#page=' + source?.page} target="_blank" rel="noreferrer">{doc.title} · S. {source?.page} <ArrowUpRight size={14}/></a>}
              </div>}

              <div className="reel-small">
                <button onClick={() => onReport(t.id)} disabled={busy}>Frage fehlerhaft</button>
                <button onClick={onFinish} disabled={busy}>Für heute beenden</button>
              </div>
            </>}
          </div>

          {!pause && <div className="reel-actions">
            {needsRating ? <div className={'reel-rate' + (hint ? ' nudge' : '')}>
              <button onClick={() => rate('wrong')} disabled={busy}>Noch nicht</button>
              <button onClick={() => rate('partial')} disabled={busy}>Teilweise</button>
              <button className="good" onClick={() => rate('correct')} disabled={busy}>Richtig <Check size={17}/></button>
            </div>
            : !a.shown && !choice && !explain ? <button className="reel-main" disabled={busy} onClick={() => reveal()}>{a.answer.trim() ? 'Abgleichen' : 'Lösung ansehen'}</button>
            : !a.shown && t.type === 'multiple' ? <button className="reel-main" disabled={busy || !a.selection.length} onClick={() => reveal()}>Prüfen</button>
            : a.shown || explain ? <button className={'reel-main' + (auto ? ' auto' : '')} disabled={busy} onClick={() => go()}>{busy ? 'Speichert …' : 'Weiter'} <span aria-hidden="true">↑</span></button>
            : null}
            {error ? <p className="reel-hint err" role="alert" onClick={onDismissError}>{error}</p>
              : <p className="reel-hint" aria-live="polite">{hint || footerText}</p>}
          </div>}
        </article>
      </div>
    </section>
  );
}
