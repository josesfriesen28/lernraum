// Service Worker: hält die App offline verfügbar. __VERSION__ wird beim Build ersetzt,
// damit nach jedem Release die neuen Dateien geladen werden.
const CACHE = 'lernraum-__VERSION__';
const CORE = ['./', './index.html', './app.js?v=__VERSION__', './app.css?v=__VERSION__', './manifest.webmanifest', './favicon.svg', './icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('lernraum-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Seite und Lerninhalte: erst Netz (für Updates), sonst Cache.
  if (new URL(req.url).pathname.includes('/content/')) {
    e.respondWith(fetch(req).then(r => {if (r.ok) {const copy = r.clone(); caches.open(CACHE).then(c => c.put(req.url.split('?')[0], copy));} return r;}).catch(() => caches.match(req.url.split('?')[0])));
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r;}).catch(() => caches.match('./index.html')));
    return;
  }
  // Alles andere (App-Code, PDF.js, Icons): Cache zuerst, dann Netz und merken.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {if (r.ok) {const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy));} return r;})));
});
