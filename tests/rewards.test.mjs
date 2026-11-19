// Lernpool und XP/Abzeichen (v0.11.0).
import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyState, plan, inPool, validateBackup} from '../lib/core.mjs';
import {xpSummary, attemptXp, levelOf, canBuy, stats} from '../lib/rewards.mjs';
import {createLocalApi, memoryStorage} from '../lib/local-api.mjs';
import {buildSync, mergeSync} from '../lib/sync.mjs';

const task = (id, courseId, packageId, extra = {}) => ({id, familyId: 'f' + id, epoch: 'e', courseId, packageId, externalId: id, objectiveId: 'o', sourceId: 's', type: 'recall', track: 'recall', status: 'active', seconds: 60, prompt: 'Frage ' + id, solution: 'L', rubric: 'K', options: [], correct: [], ...extra});

test('Lernpool: nur gewählte Fächer oder Themen kommen in den Plan', () => {
  const s = emptyState();
  s.course = [{id: 'b2', name: 'B2 BWL'}, {id: 'b3', name: 'B3 Medien'}];
  s.task = [task('a', 'b2', 'p1'), task('b', 'b2', 'p2'), task('c', 'b3', 'p3')];
  const now = '2026-11-19T12:00:00Z';
  const ids = pool => plan(s, now, 45, false, pool).items.map(x => x.id).sort();
  assert.deepEqual(ids([]), ['a', 'b', 'c']);
  assert.deepEqual(ids(['b3']), ['c']);
  assert.deepEqual(ids(['pkg:b2:p2']), ['b']);
  assert.deepEqual(ids(['b3', 'pkg:b2:p1']), ['a', 'c']);
  assert.equal(inPool(s.task[0], null), true);
});

test('XP: aus Antworten berechnet, Tagesziel gibt Bonus, Stufen wachsen', () => {
  assert.equal(attemptXp({result: 'correct'}), 12);
  assert.equal(attemptXp({result: 'correct', help: true}), 10);
  assert.equal(attemptXp({result: 'partial'}), 5);
  assert.equal(attemptXp({result: 'skip'}), 0);
  assert.equal(levelOf(0), 1); assert.equal(levelOf(49), 1); assert.equal(levelOf(50), 2); assert.equal(levelOf(150), 3);
  const s = emptyState();
  s.course = [{id: 'b2', name: 'B2 BWL'}]; s.task = [task('a', 'b2', 'b2-08-probeklausuren', {type: 'apply'})];
  for (let i = 0; i < 10; i++) s.attempt.push({id: 'x' + i, taskId: 'a', courseId: 'b2', result: 'correct', at: `2026-11-19T1${i % 10}:00:00Z`, help: false, revealed: false});
  const x = stats(s);
  assert.equal(x.earned, 10 * 12 + 20);
  assert.equal(x.byCourse.b2, 10); assert.equal(x.apply, 10); assert.equal(x.exam, 10); assert.equal(x.bestRun, 10);
  // Korrektur zählt
  s.correction.push({id: 'k', attemptId: 'x0', result: 'wrong', at: '2026-11-19T20:00:00Z'});
  assert.equal(stats(s).earned, 9 * 12 + 2 + 20);
});

test('Abzeichen kaufen: XP abziehen, Bedingungen prüfen, über Sync teilen', async () => {
  const api = createLocalApi(memoryStorage());
  let state, revision;
  const send = async (command, payload) => {
    const r = await api.handle(new URL('/api/data', 'http://x'), {method: 'POST', body: JSON.stringify({id: crypto.randomUUID(), revision, command, payload})});
    const d = await r.json(); if (d.state) ({state, revision} = d); return {r, d};
  };
  const r0 = await api.handle(new URL('/api/data', 'http://x'), {}); ({state, revision} = await r0.json());
  // Zustand mit Antworten über Restore setzen
  const s = emptyState();
  s.course = [{id: 'c', name: 'B3 Medien'}]; s.document = [{id: 'd', courseId: 'c', hash: 'h'}]; s.source = [{id: 's', documentId: 'd', text: 'x', page: 1}]; s.objective = [{id: 'o', courseId: 'c', label: 'L'}];
  s.task = [task('a', 'c', 'p')];
  for (let i = 0; i < 3; i++) s.attempt.push({id: 'a' + i, taskId: 'a', courseId: 'c', familyId: 'fa', epoch: 'e', track: 'recall', result: 'correct', at: `2026-11-1${i + 1}T12:00:00Z`, help: false, revealed: false, selection: []});
  delete s.badge; // altes Backup ohne Abzeichen bleibt gültig
  validateBackup({format: 'lernraum', schema: 1, entities: s, files: [{hash: 'h'}]});
  state = {...s}; 
  assert.equal(xpSummary(state).balance, 36);
  assert.match(canBuy(state, 'buecherwurm'), /Noch nicht freigeschaltet/);
  assert.match(canBuy(state, 'durchstarter'), /fehlen dir noch 14 XP/);
  assert.equal(canBuy(state, 'keimling'), '');
  // Kauf über das Backend (leerer Zustand → kein Guthaben)
  const fail = await send('buy', {badge: 'keimling'});
  assert.equal(fail.r.status, 400);
  // Sync überträgt Abzeichen
  const withBadge = {...state, badge: [{id: 'keimling', at: '2026-11-19T12:00:00Z', featured: true}]};
  assert.equal(xpSummary(withBadge).balance, 11);
  assert.equal(xpSummary(withBadge).featured, 'keimling');
  const other = {...emptyState(), badge: []};
  const r = mergeSync(other, buildSync(withBadge, 'Test'));
  assert.equal(r.badges, 1); assert.equal(other.badge[0].id, 'keimling');
});
