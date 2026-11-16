// Verbindet die Oberfläche mit dem lokalen Backend (lib/local-api.mjs).
// Alle Daten liegen in IndexedDB dieses Browsers – es gibt keinen Server.
import {createLocalApi, memoryStorage} from './local-api.mjs';

const DB_NAME = 'lernraum';
const DB_VERSION = 1;

function promisify<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);});
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('main')) db.createObjectStore('main');
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(Error('Lernraum ist in einem anderen Tab mit älterer Version geöffnet. Bitte diesen Tab schließen.'));
  });
}

export function indexedDbStorage() {
  const dbp = openDb();
  const store = async (name: string, mode: IDBTransactionMode) => (await dbp).transaction(name, mode).objectStore(name);
  return {
    async load() {return (await promisify((await store('main', 'readonly')).get('state'))) || null;},
    async save(data: any) {
      const tx = (await dbp).transaction('main', 'readwrite');
      tx.objectStore('main').put(data, 'state');
      await new Promise<void>((resolve, reject) => {tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || Error('Speichern abgebrochen.'));});
    },
    async putFile(hash: string, record: any) {
      const tx = (await dbp).transaction('files', 'readwrite');
      tx.objectStore('files').put(record, hash);
      await new Promise<void>((resolve, reject) => {tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);});
    },
    async getFile(hash: string) {return (await promisify((await store('files', 'readonly')).get(hash))) || null;},
    async hasFile(hash: string) {return (await promisify((await store('files', 'readonly')).count(hash))) > 0;},
  };
}

/** Beantwortet fetch('/api/…') lokal. Andere Anfragen gehen unverändert ins Netz. */
export async function installBrowserBackend() {
  let storage: any, kind = 'indexeddb';
  let persistent = false;
  try {storage = indexedDbStorage(); await storage.load();}
  catch {storage = memoryStorage(); kind = 'memory';}
  try {persistent = !!(await navigator.storage?.persist?.());} catch {}
  const api = createLocalApi(storage);
  const original = window.fetch.bind(window);
  window.fetch = (input: any, init: any = {}) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? String(input) : input.url, location.href);
    if (url.origin === location.origin && /\/api\/(data|file)$/.test(url.pathname)) return api.handle(url, init);
    return original(input, init);
  };
  // Links auf Originaldateien (/api/file?hash=…) als Datei im Browser öffnen.
  document.addEventListener('click', async e => {
    const a = (e.target as HTMLElement)?.closest?.('a');
    const href = a?.getAttribute('href') || '';
    if (!href.startsWith('/api/file')) return;
    e.preventDefault();
    const w = window.open('', '_blank');
    const r = await api.handle(new URL(href, location.href));
    if (!r.ok) {w?.close(); alert('Originaldatei nicht gefunden.'); return;}
    const blobUrl = URL.createObjectURL(await r.blob()) + (href.includes('#') ? href.slice(href.indexOf('#')) : '');
    if (w) w.location.href = blobUrl; else location.href = blobUrl;
  });
  return {storage: kind, persistent};
}
