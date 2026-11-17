import test from 'node:test'; import assert from 'node:assert/strict';
import {createLocalApi, memoryStorage} from '../lib/local-api.mjs';
import {buildSync, encodeSync, decodeSync, passwordVerifier} from '../lib/sync.mjs';

async function device() {
  const api = createLocalApi(memoryStorage()); let state, revision;
  const req = async (path, opt = {}) => {const r = await api.handle(new URL(path, 'http://x'), opt); return {r, d: await r.json()};};
  const cmd = async (command, payload) => {const {r, d} = await req('/api/data', {method: 'POST', body: JSON.stringify({id: crypto.randomUUID(), revision, command, payload})}); assert.equal(r.status, 200, JSON.stringify(d)); ({state, revision} = d); return d;};
  const upload = async text => {const f = new FormData(); f.set('file', new File([text], 'p.json', {type: 'application/json'})); return (await req('/api/file', {method: 'POST', body: f})).d.hash;};
  ({state, revision} = (await req('/api/data')).d);
  return {cmd, upload, get state() {return state;}, async attempt(id, extra = {}) {return cmd('attempt', {taskId: id, ...extra});}};
}
const task = (id, prompt) => ({id, objective: 'Ziel', family: 'f-' + id, sourceTitle: 'Skript', sourceQuote: 'Zitat', page: 1, prompt, solution: 'Lösung ' + id, rubric: 'Kriterium', type: 'recall', track: 'recall', seconds: 60, options: [], correct: []});
const pack = (tasks) => ({format: 'lernraum-package', version: 1, packageId: 'kurs-thema', title: 'Thema', course: 'Kurs', tasks});
async function install(dev, p) {
  if (!dev.state.course.length) await dev.cmd('course', {name: 'Kurs'});
  const text = JSON.stringify(p); const hash = await dev.upload(text);
  await dev.cmd('package', {courseId: dev.state.course[0].id, package: p, hash, activate: true, update: true, generated: 'bundled'});
}
async function answer(dev, n) {
  await dev.cmd('start', {minutes: 5});
  for (let i = 0; i < n; i++) {
    const s = dev.state.session.find(x => !x.completed); const t = dev.state.task.find(t => t.id === s.items[s.index].id);
    await dev.cmd('attempt', {taskId: t.id, sessionId: s.id, result: 'correct', answer: 'meine Antwort', confidence: 'sure', seconds: 7});
  }
}

test('Sync-Code: verschlüsselt, falsches Passwort scheitert', async () => {
  const payload = {format: 'lernraum-sync', v: 1, name: 'Jo', attempts: [], corrections: [], statuses: [], exams: []};
  const code = await encodeSync(payload, 'abcd');
  assert.ok(code.startsWith('LR1.')); assert.ok(!code.includes('Jo'));
  assert.deepEqual((await decodeSync(code, 'abcd')).name, 'Jo');
  await assert.rejects(decodeSync(code, 'falsch'), /Passwort falsch/);
  await assert.rejects(decodeSync('Hallo', 'abcd'), /kein Lernraum-Sync-Code/);
  const v1 = await passwordVerifier('abcd', '00112233445566778899aabbccddeeff');
  assert.equal(v1, await passwordVerifier('abcd', '00112233445566778899aabbccddeeff'));
  assert.notEqual(v1, await passwordVerifier('abce', '00112233445566778899aabbccddeeff'));
});

test('Zwei Geräte: Fortschritt wird in beide Richtungen zusammengeführt', async () => {
  const p = pack([task('a', 'A?'), task('b', 'B?'), task('c', 'C?')]);
  const A = await device(), B = await device();
  await install(A, p); await install(B, p);
  await answer(A, 2); await answer(B, 1);
  const fromA = await decodeSync(await encodeSync(buildSync(A.state, 'Jo'), 'pw12'), 'pw12');
  assert.equal(fromA.attempts.length, 2);
  const d = await B.cmd('sync', {sync: fromA});
  assert.match(d.notice, /2 Antworten übernommen/);
  assert.equal(B.state.attempt.length, 3);
  // Übernommene Antworten zählen für den Plan: gleiche Familie/Epoche wie die Aufgabe auf B
  for (const a of B.state.attempt) {const t = B.state.task.find(t => t.id === a.taskId); assert.equal(a.familyId, t.familyId); assert.equal(a.epoch, t.epoch);}
  // Erneut einspielen ändert nichts
  assert.match((await B.cmd('sync', {sync: fromA})).notice, /gleichen Stand/);
  // Rückweg B → A
  await A.cmd('sync', {sync: buildSync(B.state, 'Jo')});
  assert.equal(A.state.attempt.length, 3);
});

test('Sync: gelöschte Aufgaben und geänderte Fassungen', async () => {
  const A = await device(), B = await device();
  await install(A, pack([task('a', 'A?'), task('b', 'B?')]));
  await install(B, pack([task('a', 'A neu?'), task('b', 'B?')]));
  await answer(A, 2);
  const ta = A.state.task.find(t => t.externalId === 'b'); await A.cmd('deleteTask', {id: ta.id});
  const d = await B.cmd('sync', {sync: buildSync(A.state, 'Jo')});
  assert.match(d.notice, /davon zu älteren Fassungen/);
  const aOnB = B.state.attempt.find(x => B.state.task.find(t => t.id === x.taskId).externalId === 'a');
  assert.ok(aOnB.epoch.startsWith('sync-alt-'));
  assert.equal(B.state.task.find(t => t.externalId === 'b').status, 'archived');
});
