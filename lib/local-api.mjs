// Lokales Backend für Lernraum (seit v0.5.0).
//
// Die Oberfläche spricht weiterhin mit /api/data und /api/file – genau wie früher
// mit dem Server. Diese Datei beantwortet dieselben Anfragen direkt im Browser
// und speichert alles über einen austauschbaren Speicher (IndexedDB im Browser,
// Arbeitsspeicher in den Tests). Die Befehle sind 1:1 aus der früheren
// Server-Route (app/api/data/route.ts, bis v0.4.0) übernommen.
import {validatePackage} from './package.mjs';
import {KINDS, emptyState, plan, scoreChoice, validateTask, validateBackup, textChunks} from './core.mjs';
import {validateSync, mergeSync} from './sync.mjs';

const MAX_FILE = 8 * 1024 * 1024;
const MAX_COMMAND_IDS = 2000;

export async function digest(bytes) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('');
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {status, headers: {'content-type': 'application/json', 'cache-control': 'no-store'}});
}
function fail(e) {
  return json({error: String(e?.message || e)}, e?.status || 400);
}
const err = (message, status) => Object.assign(Error(message), status ? {status} : {});

/** Speicher im Arbeitsspeicher – für Tests und als Notlösung, wenn IndexedDB fehlt. */
export function memoryStorage() {
  let main = null; const files = new Map();
  return {
    async load() {return main ? structuredClone(main) : null;},
    async save(data) {main = structuredClone(data);},
    async putFile(hash, record) {files.set(hash, record);},
    async getFile(hash) {return files.get(hash) || null;},
    async hasFile(hash) {return files.has(hash);},
  };
}

export function createLocalApi(storage) {
  let db = null;
  let queue = Promise.resolve();

  async function ready() {
    if (db) return db;
    const loaded = await storage.load();
    db = loaded || {state: emptyState(), revision: 0, commands: []};
    for (const k of KINDS) if (!Array.isArray(db.state[k])) db.state[k] = [];
    db.commands ||= [];
    return db;
  }
  const snapshot = () => ({state: db.state, revision: db.revision});

  async function fileRoute(url, init) {
    if ((init.method || 'GET').toUpperCase() !== 'POST') {
      const hash = url.searchParams.get('hash');
      if (!hash || !/^[a-f0-9]{64}$/.test(hash)) throw err('Ungültiger Dateiverweis.');
      const f = await storage.getFile(hash);
      if (!f) return json({error: 'Originaldatei nicht gefunden.'}, 404);
      return new Response(f.blob, {headers: {'content-type': f.type || 'application/octet-stream'}});
    }
    const file = init.body?.get?.('file');
    if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0 || file.size > MAX_FILE) throw err('Bitte eine Datei mit maximal 8 MB auswählen.');
    const bytes = await file.arrayBuffer();
    const type = file.type === 'application/pdf' ? 'application/pdf' : (file.type === 'application/json' ? 'application/json' : 'text/plain');
    if (type === 'application/pdf' && new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-') throw err('Die Datei ist kein lesbares PDF.');
    const hash = await digest(bytes);
    if (!await storage.hasFile(hash)) await storage.putFile(hash, {blob: new Blob([bytes], {type}), type, name: String(file.name || '').slice(0, 160)});
    return json({hash, size: file.size, type, name: file.name});
  }

  async function dataRoute(init) {
    await ready();
    if ((init.method || 'GET').toUpperCase() !== 'POST') return json(snapshot());
    const raw = String(init.body || '');
    if (raw.length > 12 * 1024 * 1024) throw err('Zu viele Daten in einer Anfrage.');
    const {command, payload: p = {}, id, revision} = JSON.parse(raw);
    if (typeof id !== 'string' || id.length > 100 || !Number.isInteger(revision)) throw err('Ungültige Anfrage.');
    if (db.commands.includes(id)) return json({...snapshot(), replayed: true});
    if (db.revision !== revision) return json({error: 'Daten wurden in einem anderen Tab geändert. Bitte aktualisieren.'}, 409);

    const s = db.state;
    const next = structuredClone(s);
    const now = new Date().toISOString();
    const uid = () => crypto.randomUUID();
    const put = (kind, v) => {const list = next[kind]; const i = list.findIndex(x => x.id === v.id); if (i >= 0) list[i] = v; else list.push(v);};
    const get = (kind, id) => {const x = s[kind].find(x => x.id === id); if (!x) throw err('Eintrag nicht gefunden: ' + kind); return x;};
    let notice = '';
    let replace = null;

    if (command === 'course') {
      if (!p.name?.trim() || p.name.length > 120) throw err('Bitte einen Modulnamen angeben.');
      if (p.exam && !/^\d{4}-\d{2}-\d{2}$/.test(p.exam)) throw err('Prüfungsdatum ungültig.');
      put('course', {id: p.id ? get('course', p.id).id : uid(), name: p.name.trim(), exam: p.exam || '', examType: p.examType || 'Klausur'});
    } else if (command === 'settings') {
      if (![5, 10, 20, 30, 45].includes(p.minutes)) throw err('Ungültiges Zeitbudget.');
      if (![0, 5, 10].includes(p.pauseEvery ?? 5)) throw err('Ungültiger Pausentakt.');
      put('settings', {id: 'main', minutes: p.minutes, pauseEvery: p.pauseEvery ?? 5});
    } else if (command === 'package') {
      const course = get('course', p.courseId), pack = validatePackage(p.package);
      if (!/^[a-f0-9]{64}$/.test(p.hash) || !await storage.hasFile(p.hash)) throw err('Paketdatei fehlt.');
      const versions = s.document.filter(d => d.courseId === course.id && d.packageId === pack.packageId);
      const prior = versions.sort((x, y) => y.version - x.version)[0];
      if (prior && versions.some(d => d.hash === p.hash)) return json({...snapshot(), notice: 'Dieses Paket ist bereits importiert. Keine Duplikate erstellt.'});
      if (prior && !p.update) throw err('Diese Paket-ID gehört bereits zu einer anderen Datei. Für Ergänzungen eine neue Paket-ID verwenden.');
      const docId = uid();
      const generated = p.generated || 'chat-package';
      put('document', {id: docId, rootId: prior?.rootId || docId, previousId: prior?.id || null, courseId: course.id, title: pack.title, topic: pack.topic || '', hash: p.hash, packageId: pack.packageId, version: prior ? prior.version + 1 : 1, at: now, pageCount: pack.tasks.length, status: 'review', origin: generated, warnings: generated === 'bundled' ? 'Mit der App ausgelieferte Aufgaben. Fehler bitte über „Frage fehlerhaft“ melden.' : 'KI-Aufgabenpaket: Quellenbelege und Lösungen fachlich prüfen. Originalunterlagen sind nicht in dieser JSON-Datei enthalten.'});
      // Bei einem Update: bisherige Aufgaben dieses Pakets über ihre Paket-ID (externalId) wiederfinden.
      const rootDocs = new Set(versions.map(d => d.id));
      const current = new Map();
      for (const t of s.task) if (rootDocs.has(t.epochDoc || t.epoch) || (t.packageId === pack.packageId && t.courseId === course.id)) {
        if (!['superseded'].includes(t.status)) current.set(t.externalId, t);
      }
      const objectives = new Map(s.objective.filter(o => o.courseId === course.id).map(o => [o.label, o.id]));
      const families = new Map([...current.values()].map(t => [t.packageFamily, t.familyId]));
      const sameContent = (a, b) => ['prompt', 'solution', 'rubric', 'type', 'track'].every(k => a[k] === b[k]) && JSON.stringify(a.options || []) === JSON.stringify(b.options || []) && JSON.stringify(a.correct || []) === JSON.stringify(b.correct || []);
      let added = 0, changed = 0, kept = 0, removed = 0;
      const seen = new Set();
      pack.tasks.forEach((t, position) => {
        seen.add(t.id);
        if (!objectives.has(t.objective)) {const oid = uid(); objectives.set(t.objective, oid); put('objective', {id: oid, courseId: course.id, label: t.objective});}
        if (!families.has(t.family)) families.set(t.family, uid());
        const old = current.get(t.id);
        const sourceId = uid();
        put('source', {id: sourceId, documentId: docId, page: t.page, position, text: t.sourceTitle + ' · Seite ' + t.page + '\n' + t.sourceQuote, ...(t.image ? {image: t.image} : {}), ...(t.sourceUrl ? {url: t.sourceUrl} : {})});
        const fields = {type: t.type, track: t.track, prompt: t.prompt, solution: t.solution, rubric: t.rubric, options: t.options || [], correct: t.correct || [], seconds: t.seconds};
        if (old && sameContent(old, fields)) {put('task', {...old, sourceId, epochDoc: docId}); kept++; return;}
        if (old && old.status !== 'archived') {
          put('task', {...old, status: 'superseded'});
          put('task', {...old, ...fields, id: uid(), sourceId, epochDoc: docId, objectiveId: objectives.get(t.objective), epoch: uid(), status: old.status === 'draft' ? 'draft' : (p.activate ? 'active' : old.status), version: old.version + 1, previousId: old.id, at: now, change: 'Aktualisiert mit Paket v' + (prior.version + 1)});
          changed++; return;
        }
        if (old) {kept++; return;} // im Papierkorb: bleibt dort
        put('task', {id: uid(), externalId: t.id, packageId: pack.packageId, packageFamily: t.family, epochDoc: docId, familyId: families.get(t.family), objectiveId: objectives.get(t.objective), epoch: docId, courseId: course.id, sourceId, ...fields, status: p.activate ? 'active' : 'draft', version: 1, previousId: null, generated, at: now, change: prior ? 'Neu in Paket v' + (prior.version + 1) : 'Importiertes Aufgabenpaket'});
        added++;
      });
      // Aufgaben, die im neuen Paket fehlen, wandern in den Papierkorb (Antworten bleiben erhalten).
      const gone = new Set();
      for (const [ext, t] of current) if (!seen.has(ext) && t.status !== 'archived') {put('task', {...t, status: 'archived', deletedAt: now, previousStatus: t.status, change: 'Nicht mehr im Paket enthalten'}); gone.add(t.id); removed++;}
      // Geänderte oder entfernte Aufgaben aus offenen Sitzungen nehmen.
      const replaced = new Set([...gone, ...next.task.filter(t => t.status === 'superseded').map(t => t.id)]);
      for (const session of s.session.filter(x => !x.completed)) {
        const items = [...session.items.slice(0, session.index), ...session.items.slice(session.index).filter(x => !replaced.has(x.id))];
        if (items.length !== session.items.length) put('session', {...session, items, completed: session.index >= items.length, finishedAt: session.index >= items.length ? now : null});
      }
      notice = prior
        ? `„${pack.title}“ aktualisiert: ${added} neu, ${changed} geändert, ${removed} entfernt, ${kept} unverändert.`
        : pack.tasks.length + ' fertige Aufgaben importiert' + (p.activate ? ' und aktiviert.' : '. Unter Aufgaben prüfen und freigeben.');
    } else if (command === 'import') {
      const course = get('course', p.courseId);
      if (!p.title?.trim() || !Array.isArray(p.pages) || p.pages.length > 200) throw err('Titel oder lesbare Seiten fehlen (max. 200 Seiten).');
      if (!/^[a-f0-9]{64}$/.test(p.hash) || !await storage.hasFile(p.hash)) throw err('Originaldatei fehlt. Bitte erneut hochladen.');
      if (p.pages.some(x => typeof x.text !== 'string' || !Number.isInteger(x.page) || x.page < 1)) throw err('Seiten ungültig.');
      const content = p.pages.map(x => x.text).join('\n');
      if (content.trim().length < 40) throw err('Zu wenig lesbarer Text. Bitte Text einfügen; Bild-PDFs benötigen zuerst Texterkennung.');
      if (content.length > 500000) throw err('Bitte das Dokument in kleinere Abschnitte teilen.');
      const contentHash = await digest(new TextEncoder().encode(content.replace(/\s+/g, ' ').trim()));
      const duplicate = s.document.find(d => d.courseId === course.id && (d.hash === p.hash || d.contentHash === contentHash));
      if (duplicate) return json({...snapshot(), notice: 'Bereits vorhanden: ' + duplicate.title + '. Es wurden keine Aufgaben vervielfacht.'});
      const previous = p.previousId ? get('document', p.previousId) : null;
      if (previous && previous.courseId !== course.id) throw err('Version gehört zu einem anderen Modul.');
      const root = previous?.rootId || uid(), docId = uid();
      const doc = {id: docId, rootId: root, previousId: previous?.id || null, courseId: course.id, title: p.title.trim().slice(0, 160), topic: (p.topic || '').slice(0, 120), hash: p.hash, contentHash, version: previous ? Math.max(...s.document.filter(d => d.rootId === root).map(d => d.version)) + 1 : 1, at: now, pageCount: p.pages.length, status: 'review', warnings: p.pages.some(x => x.text.trim().length < 30) ? 'Einzelne Seiten ohne sicheren Text; Grafiken und Formeln bitte am Original prüfen.' : 'Extraktion ungeprüft: Reihenfolge, Formeln und Vollständigkeit am Original prüfen.'};
      put('document', doc);
      const chunks = textChunks(p.pages);
      if (!chunks.length) throw err('Keine geeigneten Textabschnitte. Bitte Text mit vollständigen Absätzen einfügen.');
      const existingSources = s.source.filter(x => s.document.find(d => d.id === x.documentId)?.rootId === root);
      const currentTexts = new Set(chunks.map(x => x.text.replace(/\s+/g, ' ').trim()));
      for (const source of existingSources.filter(x => x.documentId === previous?.id)) {
        if (!currentTexts.has(source.text.replace(/\s+/g, ' ').trim()))
          for (const old of s.task.filter(t => t.sourceId === source.id && t.status === 'active')) put('task', {...old, status: 'suspended', change: 'Quelle geändert oder Abschnitt entfernt: bitte prüfen'});
      }
      let fresh = 0, unchanged = 0;
      for (const [index, chunk] of chunks.entries()) {
        const normalized = chunk.text.replace(/\s+/g, ' ').trim();
        const match = existingSources.find(x => x.text.replace(/\s+/g, ' ').trim() === normalized);
        const sourceId = uid(); put('source', {id: sourceId, documentId: docId, page: chunk.page, text: chunk.text, position: index});
        if (match) {unchanged++; continue;}
        if (fresh >= 8) continue;
        const oldSource = existingSources.find(x => x.documentId === previous?.id && x.position === index);
        const oldTask = oldSource ? s.task.filter(t => t.sourceId === oldSource.id && t.status !== 'superseded').at(-1) : null;
        if (oldTask?.status === 'active') put('task', {...oldTask, status: 'suspended', change: 'Neue Quelle wartet auf Prüfung'});
        const objectiveId = oldTask?.objectiveId || uid(), familyId = oldTask?.familyId || uid();
        if (!oldTask) put('objective', {id: objectiveId, courseId: course.id, label: (p.topic || doc.title) + ' · Abschnitt ' + (index + 1)});
        put('task', {id: uid(), familyId, objectiveId, epoch: docId, courseId: course.id, sourceId, type: 'recall', track: 'recall', prompt: 'Gib die Kernaussage aus „' + doc.title + '“, Abschnitt ' + (index + 1) + ', in eigenen Worten wieder. Präzisiere diese Frage vor der Freigabe.', solution: chunk.text, rubric: 'Die wesentlichen Aussagen des Quellenabschnitts sinngemäß wiedergeben. Fachbegriffe und Einschränkungen erhalten.', options: [], correct: [], seconds: 90, status: 'draft', version: oldTask ? oldTask.version + 1 : 1, previousId: oldTask?.id || null, generated: 'extractive', at: now, change: previous ? 'Änderung / mögliche Abweichung: manuell vergleichen' : 'Neu'});
        fresh++;
      }
      notice = fresh + ' quellenbasierte Entwürfe, ' + unchanged + ' unveränderte Abschnitte. Maximal 8 Entwürfe je Import; weitere Inhalte können manuell ergänzt werden.';
    } else if (command === 'task') {
      const old = get('task', p.id);
      if (['superseded', 'archived'].includes(old.status)) throw err('Diese Version ist unveränderlich. Bitte die aktuelle Aufgabe öffnen.', 409);
      const source = get('source', p.sourceId || old.sourceId);
      const doc = get('document', source.documentId);
      const updated = validateTask({...old, prompt: String(p.prompt || '').slice(0, 6000), solution: String(p.solution || '').slice(0, 8000), rubric: String(p.rubric || '').slice(0, 4000), type: p.type, track: p.track, seconds: Number(p.seconds), options: p.options || [], correct: p.correct || [], sourceId: source.id, status: p.publish ? 'active' : 'draft'});
      if (p.publish && !p.confirmSource) throw err('Bitte Quellenbezug und Lösung ausdrücklich prüfen.');
      if (old.status === 'active' || old.status === 'suspended') {
        updated.id = uid(); updated.version = old.version + 1; updated.previousId = old.id;
        updated.epoch = p.cosmetic && old.solution === updated.solution && old.rubric === updated.rubric && old.track === updated.track && old.type === updated.type && old.sourceId === updated.sourceId ? old.epoch : updated.id;
        put('task', {...old, status: 'superseded'});
      }
      if (updated.previousId && p.publish) put('task', {...get('task', updated.previousId), status: 'superseded'});
      if (p.objectiveLabel?.trim()) put('objective', {...get('objective', old.objectiveId), label: String(p.objectiveLabel).trim().slice(0, 250)});
      put('task', updated); put('document', {...doc, status: 'reviewed'});
    } else if (command === 'newTask') {
      const base = get('task', p.id);
      put('task', {...base, externalId: null, packageId: null, packageFamily: null, epochDoc: null, id: uid(), previousId: null, version: 1, status: 'draft', prompt: 'Neue Frage zu diesem Quellenabschnitt', type: p.variant ? base.type : 'apply', track: p.variant ? base.track : 'apply', familyId: p.variant ? base.familyId : uid(), epoch: p.variant ? base.epoch : uid(), solution: base.solution, seconds: p.variant ? base.seconds : 240, change: p.variant ? 'Neue Variante desselben Lernziels' : 'Manuell ergänzte Anwendung'});
    } else if (command === 'deleteTask') {
      const t = get('task', p.id);
      if (t.status === 'archived') return json({...snapshot(), notice: 'Die Aufgabe liegt bereits im Papierkorb.'});
      put('task', {...t, status: 'archived', deletedAt: now, previousStatus: t.status});
      for (const session of s.session.filter(x => !x.completed)) {
        const items = [...session.items.slice(0, session.index), ...session.items.slice(session.index).filter(x => x.id !== t.id)];
        put('session', {...session, items, completed: session.index >= items.length, finishedAt: session.index >= items.length ? now : null});
      }
      notice = 'Aufgabe in den Papierkorb verschoben. Deine bisherigen Antworten bleiben erhalten.';
    } else if (command === 'restoreTask') {
      const t = get('task', p.id);
      if (t.status !== 'archived') throw err('Diese Aufgabe liegt nicht im Papierkorb.');
      put('task', {...t, status: t.previousStatus || 'draft', deletedAt: null}); notice = 'Aufgabe wiederhergestellt.';
    } else if (command === 'status') {
      const t = get('task', p.id);
      if (!['suspended', 'active', 'archived'].includes(p.status) || t.status === 'draft' || t.status === 'superseded') throw err('Statuswechsel nicht möglich.');
      put('task', {...t, status: p.status});
    } else if (command === 'report') {
      const t = get('task', p.id);
      put('issue', {id: uid(), taskId: t.id, text: (p.text || 'Aufgabe prüfen').slice(0, 2000), at: now}); put('task', {...t, status: 'suspended'});
    } else if (command === 'start') {
      const minutes = Number(p.minutes);
      if (![5, 10, 20, 30, 45].includes(minutes)) throw err('Bitte Zeitbudget wählen.');
      if (s.session.find(x => !x.completed)) return json({...snapshot(), notice: 'Die bestehende Sitzung kann fortgesetzt werden.'});
      const chosen = p.taskId ? get('task', p.taskId) : null;
      if (chosen && chosen.status !== 'active') throw err('Bitte zuerst die Aufgabe freigeben.');
      const selected = chosen ? {items: [{id: chosen.id, reason: 'Bewusst gewählte Vertiefung · außerhalb des Tagesplans'}], uncovered: 0} : plan(s, now, minutes, !!p.extra);
      if (!selected.items.length) return json({...snapshot(), notice: 'Für heute ist nichts Passendes mehr offen. Prüfe neue Entwürfe oder komme zur nächsten Wiederholung zurück.'});
      put('session', {id: uid(), items: selected.items, index: 0, startedAt: now, minutes, completed: false, uncovered: selected.uncovered});
    } else if (command === 'finish') {
      const session = get('session', p.id); put('session', {...session, completed: true, finishedAt: now});
    } else if (command === 'attempt') {
      if (s.attempt.some(a => a.id === id)) return json({...snapshot(), replayed: true});
      const t = get('task', p.taskId), session = get('session', p.sessionId);
      if (session.completed || session.items[session.index]?.id !== t.id) throw err('Sitzung wurde bereits weitergeführt. Bitte aktualisieren.', 409);
      if (!['correct', 'partial', 'wrong', 'skip', 'read'].includes(p.result)) throw err('Bewertung fehlt.');
      let result = p.result;
      if (t.status !== 'active') result = 'pending';
      else if (result !== 'skip' && t.type === 'explain') result = 'read';
      else if (result !== 'skip' && (t.type === 'single' || t.type === 'multiple')) result = scoreChoice(t, p.selection || []);
      if (result !== 'skip' && result !== 'read' && !p.revealed && !String(p.answer || '').trim() && !(p.selection || []).length) throw err('Bitte zuerst antworten oder bewusst die Lösung ansehen.');
      put('attempt', {id, taskId: t.id, objectiveId: t.objectiveId, familyId: t.familyId, epoch: t.epoch, track: t.track, courseId: t.courseId, sessionId: session.id, result, answer: String(p.answer || '').slice(0, 10000), selection: p.selection || [], confidence: p.confidence || 'unsure', help: !!p.help, revealed: !!p.revealed, at: now, clientAt: p.clientAt || now, seconds: Math.min(3600, Math.max(0, Number(p.seconds) || 0)), assessment: t.type === 'single' || t.type === 'multiple' ? 'exact-choice' : 'self-rubric', scheduler: 'rules-v1'});
      const index = session.index + 1; let items = session.items;
      if (index >= items.length) {
        const used = new Set(items.map(x => get('task', x.id).familyId));
        const more = plan({...s, task: s.task.filter(x => !used.has(x.familyId))}, now, session.minutes, true);
        items = [...items, ...more.items];
      }
      put('session', {...session, items, index, completed: index >= items.length, finishedAt: index >= items.length ? now : null});
    } else if (command === 'recover') {
      const t = get('task', p.taskId);
      if (typeof p.originalId !== 'string') throw err('Ursprüngliche Antwort-ID fehlt.');
      if (s.attempt.some(a => a.id === p.originalId)) return json({...snapshot(), notice: 'Diese Antwort ist bereits gespeichert.'});
      put('attempt', {id: p.originalId, taskId: t.id, objectiveId: t.objectiveId, familyId: t.familyId, epoch: t.epoch, track: t.track, courseId: t.courseId, sessionId: p.sessionId, result: 'pending', answer: String(p.answer || '').slice(0, 10000), selection: p.selection || [], confidence: p.confidence || 'unsure', help: !!p.help, revealed: !!p.revealed, at: now, clientAt: p.clientAt, seconds: p.seconds || 0, assessment: 'recovered-conflict', scheduler: 'rules-v1'});
      notice = 'Antwort als ungeklärten Versuch gesichert. Sie verändert keinen Wiederholungsabstand.';
    } else if (command === 'correct') {
      const original = get('attempt', p.attemptId);
      if (['skip', 'read'].includes(original.result)) throw err('Überspringen und Lesen bleiben unverändert.');
      if (!['correct', 'partial', 'wrong', 'pending'].includes(p.result)) throw err('Ungültige Korrektur.');
      put('correction', {id: uid(), attemptId: p.attemptId, result: p.result, reason: String(p.reason || 'Manuell korrigiert').slice(0, 2000), at: now});
    } else if (command === 'sync') {
      const r = mergeSync(next, validateSync(p.sync), now);
      notice = r.added || r.corrected || r.changed
        ? `Abgeglichen: ${r.added} Antworten übernommen` + (r.older ? ` (${r.older} davon zu älteren Fassungen, nur im Verlauf)` : '') + (r.changed ? `, ${r.changed} Aufgaben gelöscht/ausgesetzt` : '') + (r.missing ? `. ${r.missing} Antworten gehören zu Inhalten, die es hier nicht gibt.` : '.')
        : 'Schon auf dem gleichen Stand – nichts Neues im Sync-Code.' + (r.missing ? ` (${r.missing} Antworten gehören zu Inhalten, die es hier nicht gibt.)` : '');
    } else if (command === 'restore') {
      const b = validateBackup(p.backup);
      for (const f of b.files) if (!/^[a-f0-9]{64}$/.test(f.hash) || !await storage.hasFile(f.hash)) throw err('Eine Originaldatei fehlt. Restore abgebrochen.');
      const count = KINDS.reduce((n, k) => n + b.entities[k].length, 0);
      if (count > 100000) throw err('Restore unterstützt maximal 100.000 Datensätze.');
      replace = structuredClone(b.entities);
      notice = 'Backup wiederhergestellt. Quellen und Lernereignisse wurden übernommen.';
    } else throw err('Unbekannter Vorgang.');

    const before = db;
    db = {state: replace || next, revision: db.revision + 1, commands: [...db.commands, id].slice(-MAX_COMMAND_IDS)};
    try {await storage.save(db);}
    catch (e) {db = before; throw err('Speichern auf diesem Gerät fehlgeschlagen: ' + (e?.message || e) + '. Bitte ein Backup herunterladen und Speicherplatz prüfen.');}
    return json({...snapshot(), notice});
  }

  /** Beantwortet eine Anfrage an /api/data oder /api/file wie früher der Server. */
  function handle(url, init = {}) {
    const run = async () => {
      try {
        if (url.pathname.endsWith('/api/file')) return await fileRoute(url, init);
        return await dataRoute(init);
      } catch (e) {return fail(e);}
    };
    // Befehle nacheinander abarbeiten, damit sich Revisionen nicht überholen.
    const result = queue.then(run, run);
    queue = result.catch(() => {});
    return result;
  }

  return {handle, ready};
}
