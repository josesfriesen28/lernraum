// Geräteübergreifender Abgleich ohne Server (seit v0.10.0).
//
// Ein Sync-Code enthält den Lernfortschritt eines Profils zu den mitgelieferten
// bzw. importierten Aufgabenpaketen (Antworten, Korrekturen, gelöschte Aufgaben,
// Einstellungen, Prüfungstermine) – verschlüsselt mit dem Profil-Passwort.
// Auf dem anderen Gerät wird er mit dem dortigen Stand zusammengeführt, nicht
// überschrieben. Aufgaben werden über Paket-ID + Aufgaben-ID wiedergefunden.

export const SYNC_PREFIX = 'LR1.';
const ITER = 150000;
const MAX_ATTEMPTS = 50000;

/** Kurzer Inhaltsfingerabdruck einer Aufgabenversion (FNV-1a). */
export function taskSig(t) {
  const s = [t.type, t.track, t.prompt, t.solution, JSON.stringify(t.options || []), JSON.stringify(t.correct || [])].join('\u0001');
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0;}
  return h.toString(36);
}
const keyOf = t => t.packageId && t.externalId ? t.packageId + '/' + t.externalId : null;

/** Fortschritt eines Zustands als Sync-Inhalt (ohne Inhalte der Aufgaben). */
export function buildSync(state, name) {
  const tasks = new Map(state.task.map(t => [t.id, t]));
  const attempts = [];
  let skipped = 0;
  for (const a of state.attempt) {
    const t = tasks.get(a.taskId), key = t && keyOf(t);
    if (!key) {skipped++; continue;}
    attempts.push({id: a.id, key, sig: taskSig(t), result: a.result, answer: String(a.answer || '').slice(0, 400), selection: a.selection || [], confidence: a.confidence, help: !!a.help, revealed: !!a.revealed, at: a.at, clientAt: a.clientAt, seconds: a.seconds || 0, assessment: a.assessment});
  }
  const ids = new Set(attempts.map(a => a.id));
  const corrections = state.correction.filter(c => ids.has(c.attemptId)).map(c => ({id: c.id, attemptId: c.attemptId, result: c.result, reason: c.reason, at: c.at}));
  const statuses = state.task.filter(t => keyOf(t) && (t.status === 'archived' || t.status === 'suspended')).map(t => ({key: keyOf(t), sig: taskSig(t), status: t.status}));
  const exams = state.course.filter(c => c.exam).map(c => ({course: c.name, exam: c.exam}));
  const s = state.settings.find(x => x.id === 'main');
  return {format: 'lernraum-sync', v: 1, name: String(name || '').slice(0, 60), exportedAt: new Date().toISOString(), attempts, corrections, statuses, exams, settings: s ? {minutes: s.minutes, pauseEvery: s.pauseEvery} : null, badges: (state.badge || []).map(b => ({id: b.id, at: b.at})), skipped};
}

export function validateSync(p) {
  if (p?.format !== 'lernraum-sync' || p.v !== 1) throw Error('Kein gültiger Lernraum-Sync-Code.');
  for (const k of ['attempts', 'corrections', 'statuses', 'exams']) if (!Array.isArray(p[k])) throw Error('Sync-Code unvollständig.');
  if (p.attempts.length > MAX_ATTEMPTS) throw Error('Sync-Code zu groß.');
  for (const a of p.attempts) {
    if (typeof a.id !== 'string' || !a.id || a.id.length > 100 || typeof a.key !== 'string' || a.key.length > 400 || !Number.isFinite(Date.parse(a.at))) throw Error('Sync-Code enthält ungültige Antworten.');
    if (!['correct', 'partial', 'wrong', 'skip', 'read', 'pending'].includes(a.result)) throw Error('Sync-Code enthält ungültige Bewertungen.');
  }
  for (const c of p.corrections) if (typeof c.id !== 'string' || typeof c.attemptId !== 'string' || !['correct', 'partial', 'wrong', 'pending'].includes(c.result)) throw Error('Sync-Code enthält ungültige Korrekturen.');
  for (const s of p.statuses) if (typeof s.key !== 'string' || !['archived', 'suspended'].includes(s.status)) throw Error('Sync-Code enthält ungültige Status.');
  if (p.badges !== undefined && (!Array.isArray(p.badges) || p.badges.length > 200 || p.badges.some(b => typeof b?.id !== 'string' || b.id.length > 60))) throw Error('Sync-Code enthält ungültige Abzeichen.');
  return p;
}

/** Führt einen Sync-Inhalt in den Zustand `next` (wird verändert) zusammen. */
export function mergeSync(next, p, now = new Date().toISOString()) {
  const byKey = new Map();
  for (const t of next.task) {const k = keyOf(t); if (k) {if (!byKey.has(k)) byKey.set(k, []); byKey.get(k).push(t);}}
  const current = k => (byKey.get(k) || []).filter(t => t.status !== 'superseded').sort((a, b) => String(b.at).localeCompare(String(a.at)))[0];
  const withSig = (k, sig) => (byKey.get(k) || []).find(t => taskSig(t) === sig);
  const have = new Set(next.attempt.map(a => a.id));
  let added = 0, older = 0, missing = 0;
  for (const a of p.attempts) {
    if (have.has(a.id)) continue;
    const exact = withSig(a.key, a.sig), t = exact || current(a.key);
    if (!t) {missing++; continue;}
    // Antworten zu einer älteren Fassung bleiben im Verlauf, zählen aber nicht für den Wiederholungsplan.
    const epoch = exact ? t.epoch : 'sync-alt-' + a.sig;
    if (!exact) older++;
    next.attempt.push({id: a.id, taskId: t.id, objectiveId: t.objectiveId, familyId: t.familyId, epoch, track: t.track, courseId: t.courseId, sessionId: 'sync', result: a.result, answer: String(a.answer || ''), selection: Array.isArray(a.selection) ? a.selection.slice(0, 6) : [], confidence: a.confidence || 'unsure', help: !!a.help, revealed: !!a.revealed, at: a.at, clientAt: a.clientAt || a.at, seconds: Math.min(3600, Math.max(0, Number(a.seconds) || 0)), assessment: a.assessment || 'synced', scheduler: 'rules-v1'});
    have.add(a.id); added++;
  }
  const corrIds = new Set(next.correction.map(c => c.id));
  let corrected = 0;
  for (const c of p.corrections) if (!corrIds.has(c.id) && have.has(c.attemptId)) {next.correction.push({id: c.id, attemptId: c.attemptId, result: c.result, reason: String(c.reason || 'Korrektur (Sync)').slice(0, 2000), at: c.at}); corrected++;}
  let changed = 0;
  for (const s of p.statuses) {
    const t = current(s.key);
    if (!t || (s.sig && taskSig(t) !== s.sig)) continue;
    if (s.status === 'archived' && t.status !== 'archived') {Object.assign(t, {previousStatus: t.status, status: 'archived', deletedAt: now}); changed++;}
    else if (s.status === 'suspended' && t.status === 'active') {t.status = 'suspended'; changed++;}
  }
  for (const e of p.exams) {const c = next.course.find(c => c.name === e.course); if (c && !c.exam && /^\d{4}-\d{2}-\d{2}$/.test(e.exam)) c.exam = e.exam;}
  if (p.settings && !next.settings.some(x => x.id === 'main') && [5, 10, 20, 30, 45].includes(p.settings.minutes)) next.settings.push({id: 'main', minutes: p.settings.minutes, pauseEvery: [0, 5, 10].includes(p.settings.pauseEvery) ? p.settings.pauseEvery : 5});
  // Gekaufte Abzeichen gelten auf allen Geräten (XP werden aus den Antworten berechnet).
  let badges = 0;
  next.badge ||= [];
  for (const b of p.badges || []) if (!next.badge.some(x => x.id === b.id) && /^[a-z0-9-]+$/.test(b.id)) {next.badge.push({id: b.id, at: Number.isFinite(Date.parse(b.at)) ? b.at : now, featured: false}); badges++;}
  return {added, older, missing, corrected, changed, badges};
}

// ---------- Verschlüsselung (Web Crypto, läuft im Browser und in Node) ----------
const enc = new TextEncoder(), dec = new TextDecoder();
function b64url(bytes) {let s = ''; for (let i = 0; i < bytes.length; i += 8192) s += String.fromCharCode(...bytes.subarray(i, i + 8192)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');}
function unb64url(s) {const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)); return Uint8Array.from(b, c => c.charCodeAt(0));}
async function pipe(bytes, stream) {return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());}
async function aesKey(password, salt) {
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256'}, base, {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']);
}
/** Passwort-Prüfwert für ein lokales Profil (Salt hex, Ergebnis hex). */
export async function passwordVerifier(password, saltHex) {
  const salt = Uint8Array.from(saltHex.match(/../g).map(h => parseInt(h, 16)));
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256'}, base, 256));
  return [...bits].map(b => b.toString(16).padStart(2, '0')).join('');
}
export async function encodeSync(payload, password) {
  let body = enc.encode(JSON.stringify(payload)), flag = 0;
  if (typeof CompressionStream === 'function') {body = await pipe(body, new CompressionStream('gzip')); flag = 1;}
  const plain = new Uint8Array(body.length + 1); plain[0] = flag; plain.set(body, 1);
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({name: 'AES-GCM', iv}, await aesKey(password, salt), plain));
  const all = new Uint8Array(28 + cipher.length); all.set(salt); all.set(iv, 16); all.set(cipher, 28);
  return SYNC_PREFIX + b64url(all);
}
export async function decodeSync(code, password) {
  const clean = String(code || '').replace(/\s+/g, '');
  if (!clean.startsWith(SYNC_PREFIX)) throw Error('Das ist kein Lernraum-Sync-Code (er beginnt mit „LR1.“).');
  let all; try {all = unb64url(clean.slice(SYNC_PREFIX.length));} catch {throw Error('Sync-Code ist beschädigt oder unvollständig kopiert.');}
  if (all.length < 45) throw Error('Sync-Code ist unvollständig.');
  let plain;
  try {plain = new Uint8Array(await crypto.subtle.decrypt({name: 'AES-GCM', iv: all.slice(16, 28)}, await aesKey(password, all.slice(0, 16)), all.slice(28)));}
  catch {throw Error('Passwort falsch oder Sync-Code unvollständig kopiert.');}
  let body = plain.slice(1);
  if (plain[0] === 1) {
    if (typeof DecompressionStream !== 'function') throw Error('Dieser Browser kann den Sync-Code nicht entpacken. Bitte Browser aktualisieren.');
    body = await pipe(body, new DecompressionStream('gzip'));
  }
  return validateSync(JSON.parse(dec.decode(body)));
}
