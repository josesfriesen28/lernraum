// XP und Abzeichen (seit v0.11.0).
//
// XP werden nicht gespeichert, sondern immer aus den Antworten berechnet.
// Dadurch stimmen sie nach einem Sync-Code auf jedem Gerät überein und lassen
// sich nicht doppelt zählen. Gespeichert werden nur gekaufte Abzeichen
// (Datensatz-Art „badge“); ihr Preis wird vom verdienten XP-Stand abgezogen.
import {effectiveAttempts, dayKey} from './core.mjs';

export const XP_RULES = [
  ['Richtig beantwortet', 10],
  ['… ohne Hilfe und ohne Lösung vorab', 2],
  ['Teilweise richtig', 5],
  ['Versucht, aber noch nicht richtig', 2],
  ['Erklärkarte gelesen', 1],
  ['Tagesziel: 10 bewertete Antworten an einem Tag', 20],
];

const rated = a => ['correct', 'partial', 'wrong'].includes(a.result);

export function attemptXp(a) {
  if (a.result === 'correct') return 10 + (!a.help && !a.revealed ? 2 : 0);
  if (a.result === 'partial') return 5;
  if (a.result === 'wrong') return 2;
  if (a.result === 'read') return 1;
  return 0;
}

/** Stufe L braucht insgesamt 25·L·(L−1) XP: 0, 50, 150, 300, 500, … */
export const levelStart = level => 25 * level * (level - 1);
export function levelOf(earned) {let l = 1; while (levelStart(l + 1) <= earned) l++; return l;}
export const LEVEL_NAMES = ['Neugierig', 'Lernend', 'Dranbleibend', 'Vertiefend', 'Verknüpfend', 'Souverän', 'Prüfungsfest', 'Expertin/Experte', 'Mentor*in', 'Legende'];
export const levelName = l => LEVEL_NAMES[Math.min(l, LEVEL_NAMES.length) - 1];

function streakDays(days) {
  // längste Folge aufeinanderfolgender Lerntage
  const sorted = [...days].sort();
  let best = 0, run = 0, prev = null;
  for (const d of sorted) {
    const t = Date.parse(d + 'T12:00:00Z');
    run = prev !== null && Math.round((t - prev) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run); prev = t;
  }
  return best;
}

/** Kennzahlen für XP und Freischaltbedingungen. */
export function stats(state) {
  const attempts = effectiveAttempts(state);
  const tasks = new Map(state.task.map(t => [t.id, t]));
  const courses = new Map(state.course.map(c => [c.id, c.name]));
  const perDay = new Map();
  let earned = 0, correct = 0, run = 0, bestRun = 0, early = false, late = false, apply = 0, exam = 0;
  const byCourse = {b2: 0, b3: 0, en: 0};
  for (const a of attempts) {
    earned += attemptXp(a);
    if (rated(a)) {const d = dayKey(a.at); perDay.set(d, (perDay.get(d) || 0) + 1);}
    if (a.result === 'correct') {
      correct++; run++; bestRun = Math.max(bestRun, run);
      const t = tasks.get(a.taskId), name = courses.get(a.courseId) || '';
      if (/^B2\b/.test(name)) byCourse.b2++; else if (/^B3\b/.test(name)) byCourse.b3++; else if (/^English/i.test(name)) byCourse.en++;
      if (t?.type === 'apply') apply++;
      if (t?.packageId && /probeklausur/i.test(t.packageId)) exam++;
    } else if (rated(a)) run = 0;
    if (rated(a) || a.result === 'read') {
      const hour = Number(new Intl.DateTimeFormat('de-DE', {hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/Berlin'}).format(new Date(a.at)));
      if (hour < 8) early = true;
      if (hour >= 22) late = true;
    }
  }
  const goalDays = [...perDay.values()].filter(n => n >= 10).length;
  earned += goalDays * 20;
  const days = new Set([...perDay.keys()]);
  return {earned, correct, bestRun, early, late, apply, exam, byCourse, goalDays, learnDays: days.size, streak: streakDays(days), level: levelOf(earned)};
}

export const BADGES = [
  {id: 'keimling', icon: '🌱', name: 'Keimling', price: 25, text: 'Der Anfang ist gemacht.'},
  {id: 'durchstarter', icon: '🔥', name: 'Durchstarter', price: 50, text: 'An 3 Tagen gelernt.', need: s => s.learnDays >= 3, progress: s => [s.learnDays, 3]},
  {id: 'fruehervogel', icon: '🐦', name: 'Früher Vogel', price: 75, text: 'Vor 8 Uhr gelernt.', need: s => s.early},
  {id: 'nachteule', icon: '🦉', name: 'Nachteule', price: 75, text: 'Nach 22 Uhr gelernt.', need: s => s.late},
  {id: 'buecherwurm', icon: '📚', name: 'Bücherwurm', price: 120, text: '50 richtige Antworten.', need: s => s.correct >= 50, progress: s => [s.correct, 50]},
  {id: 'bwl', icon: '💼', name: 'BWL-Kenner', price: 150, text: '25 richtige Antworten in B2.', need: s => s.byCourse.b2 >= 25, progress: s => [s.byCourse.b2, 25]},
  {id: 'medien', icon: '📡', name: 'Medienkenner', price: 150, text: '25 richtige Antworten in B3.', need: s => s.byCourse.b3 >= 25, progress: s => [s.byCourse.b3, 25]},
  {id: 'english', icon: '🗣️', name: 'Business Talker', price: 150, text: '25 richtige Antworten in Englisch.', need: s => s.byCourse.en >= 25, progress: s => [s.byCourse.en, 25]},
  {id: 'rechner', icon: '🧮', name: 'Rechenkünstler', price: 200, text: '10 Anwendungsaufgaben richtig gelöst.', need: s => s.apply >= 10, progress: s => [s.apply, 10]},
  {id: 'klausur', icon: '📝', name: 'Klausurheld', price: 250, text: '15 Probeklausur-Aufgaben richtig.', need: s => s.exam >= 15, progress: s => [s.exam, 15]},
  {id: 'treffsicher', icon: '🎯', name: 'Treffsicher', price: 250, text: '15 richtige Antworten in Folge.', need: s => s.bestRun >= 15, progress: s => [s.bestRun, 15]},
  {id: 'woche', icon: '📅', name: 'Wochenserie', price: 300, text: '7 Lerntage in Folge.', need: s => s.streak >= 7, progress: s => [s.streak, 7]},
  {id: 'hundert', icon: '💯', name: 'Hunderter', price: 400, text: '100 richtige Antworten.', need: s => s.correct >= 100, progress: s => [s.correct, 100]},
  {id: 'krone', icon: '👑', name: 'Prüfungsfest', price: 600, text: 'Stufe 7 erreicht.', need: s => s.level >= 7, progress: s => [s.level, 7]},
  {id: 'legende', icon: '🏆', name: 'Lernraum-Legende', price: 1000, text: 'Stufe 10 erreicht.', need: s => s.level >= 10, progress: s => [s.level, 10]},
];
export const badgeById = id => BADGES.find(b => b.id === id);

/** XP-Stand inklusive ausgegebener XP für gekaufte Abzeichen. */
export function xpSummary(state) {
  const s = stats(state);
  const owned = (state.badge || []).filter(b => badgeById(b.id));
  const spent = owned.reduce((n, b) => n + badgeById(b.id).price, 0);
  const level = s.level, from = levelStart(level), to = levelStart(level + 1);
  return {...s, spent, balance: Math.max(0, s.earned - spent), owned: owned.map(b => b.id), featured: owned.find(b => b.featured)?.id || null, levelName: levelName(level), levelFrom: from, levelTo: to};
}

/** Prüft, ob ein Abzeichen gekauft werden darf; gibt sonst den Grund zurück. */
export function canBuy(state, id) {
  const b = badgeById(id), x = xpSummary(state);
  if (!b) return 'Unbekanntes Abzeichen.';
  if (x.owned.includes(id)) return 'Dieses Abzeichen hast du schon.';
  if (b.need && !b.need(x)) return 'Noch nicht freigeschaltet: ' + b.text;
  if (x.balance < b.price) return `Dafür fehlen dir noch ${b.price - x.balance} XP.`;
  return '';
}
