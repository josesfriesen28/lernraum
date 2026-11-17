// Einstiegspunkt der App (GitHub Pages). Kein Server: Daten liegen in IndexedDB,
// je Profil eine eigene Datenbank (seit v0.10.0).
import {createRoot} from 'react-dom/client';
import Lernraum from '../components/lernraum';
import Login from '../components/login';
import {installBrowserBackend, indexedDbStorage} from '../lib/browser-backend';
import {syncBundledContent} from '../lib/content-sync';
import {activeProfile, listProfiles, type Profile} from '../lib/profiles';

function toast(text: string) {
  const el = document.createElement('div');
  el.className = 'content-toast';
  el.setAttribute('role', 'status');
  el.textContent = text;
  document.body.append(el);
  setTimeout(() => el.remove(), 8000);
}

async function hasLegacyData() {
  if (listProfiles().length) return false;
  try {const d = await indexedDbStorage('lernraum').load(); return !!(d?.state?.attempt?.length || d?.state?.course?.length);} catch {return false;}
}

async function start() {
  const root = createRoot(document.getElementById('root')!);
  let profile = activeProfile();
  let pendingSync: any = null;
  if (!profile) {
    const legacy = await hasLegacyData();
    ({profile, pendingSync} = await new Promise<{profile: Profile; pendingSync: any}>(resolve =>
      root.render(<Login hasLegacyData={legacy} onDone={(p, s) => resolve({profile: p, pendingSync: s || null})}/>)));
    root.render(<div className="login"><p className="eyebrow">LERNRAUM</p><h1>Einen Moment …</h1></div>);
  }
  const backend = await installBrowserBackend(profile.db);
  if (backend.storage === 'memory') {
    const warn = document.createElement('div');
    warn.className = 'storage-warning';
    warn.textContent = 'Dieser Browser erlaubt keinen dauerhaften Speicher (z. B. privates Fenster). Änderungen gehen beim Schließen verloren.';
    document.body.prepend(warn);
  }
  // Mitgelieferte Aufgabenpakete übernehmen (neue Inhalte nach einem Update).
  const news = await syncBundledContent().catch(() => [] as string[]);
  // Profil wurde gerade per Sync-Code übernommen: Fortschritt jetzt einspielen.
  if (pendingSync) {
    try {
      const fresh = await (await fetch('/api/data')).json();
      const r = await fetch('/api/data', {method: 'POST', body: JSON.stringify({id: crypto.randomUUID(), revision: fresh.revision, command: 'sync', payload: {sync: pendingSync}})});
      const d = await r.json();
      toast(r.ok ? 'Willkommen, ' + profile.name + '! ' + d.notice : 'Sync-Code konnte nicht übernommen werden: ' + d.error);
    } catch (e: any) {toast('Sync-Code konnte nicht übernommen werden: ' + e.message);}
  }
  root.render(<Lernraum user={{id: profile.db === 'lernraum' ? 'local' : profile.id, name: profile.name}}/>);
  if (news.length && !pendingSync) toast(news.length > 2 ? `Neue Lerninhalte: ${news.length} Lernpakete neu oder aktualisiert.` : 'Neue Lerninhalte: ' + news.join(' · '));
  // Offline-Fähigkeit und „Zum Home-Bildschirm“ (nur über https bzw. localhost).
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}
start();
