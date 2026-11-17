// Lädt die mit der App ausgelieferten Aufgabenpakete (Ordner content/ im Repository)
// und übernimmt neue oder geänderte Pakete automatisch in den lokalen Lernraum.
// Fortschritt, Antworten und eigene Änderungen bleiben dabei erhalten.

type Entry = {file: string; packageId: string; course: string; examType?: string; hash: string; title: string; tasks: number};

async function call(command: string, payload: any, revision: number) {
  const r = await fetch('/api/data', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({id: crypto.randomUUID(), revision, command, payload})});
  const d = await r.json();
  if (!r.ok) throw Error(d.error || 'Fehler beim Übernehmen der Inhalte.');
  return d;
}

export async function syncBundledContent(): Promise<string[]> {
  let index: {entries: Entry[]; images?: string[]};
  try {
    const r = await fetch(new URL('content/index.json', document.baseURI), {cache: 'no-store'});
    if (!r.ok) return [];
    index = await r.json();
  } catch {return [];} // offline: beim nächsten Start
  let {state, revision} = await (await fetch('/api/data')).json();
  const messages: string[] = [];
  for (const e of index.entries || []) {
    if (state.document.some((d: any) => d.packageId === e.packageId && d.hash === e.hash)) continue;
    try {
      const res = await fetch(new URL('content/' + e.file, document.baseURI), {cache: 'no-store'});
      if (!res.ok) continue;
      const text = await res.text();
      let course = state.course.find((c: any) => c.name === e.course);
      if (!course) {
        ({state, revision} = await call('course', {name: e.course, examType: e.examType || 'Klausur'}, revision));
        course = state.course.find((c: any) => c.name === e.course);
      }
      const form = new FormData();
      form.set('file', new File([text], e.file.split('/').pop() || 'paket.json', {type: 'application/json'}));
      const up = await (await fetch('/api/file', {method: 'POST', body: form})).json();
      const d = await call('package', {courseId: course.id, package: JSON.parse(text), hash: up.hash, activate: true, update: true, generated: 'bundled'}, revision);
      ({state, revision} = d);
      if (d.notice) messages.push(d.notice);
    } catch (x: any) {messages.push(e.title + ': ' + x.message);}
  }
  // Schaubilder einmal laden, damit der Service Worker sie für offline merkt.
  for (const img of index.images || []) fetch(new URL('content/' + img, document.baseURI)).catch(() => {});
  return messages;
}
