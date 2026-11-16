// Einstiegspunkt der App (GitHub Pages). Kein Server: Daten liegen in IndexedDB.
import {createRoot} from 'react-dom/client';
import Lernraum from '../components/lernraum';
import {installBrowserBackend} from '../lib/browser-backend';
import {syncBundledContent} from '../lib/content-sync';

async function start() {
  const backend = await installBrowserBackend();
  if (backend.storage === 'memory') {
    const warn = document.createElement('div');
    warn.className = 'storage-warning';
    warn.textContent = 'Dieser Browser erlaubt keinen dauerhaften Speicher (z. B. privates Fenster). Änderungen gehen beim Schließen verloren.';
    document.body.prepend(warn);
  }
  // Mitgelieferte Aufgabenpakete übernehmen (neue Inhalte nach einem Update).
  const news = await syncBundledContent().catch(() => [] as string[]);
  createRoot(document.getElementById('root')!).render(<Lernraum user={{id: 'local', name: 'Lernraum'}}/>);
  if (news.length) {
    const toast = document.createElement('div');
    toast.className = 'content-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = news.length > 2 ? `Neue Lerninhalte: ${news.length} Lernpakete neu oder aktualisiert.` : 'Neue Lerninhalte: ' + news.join(' · ');
    document.body.append(toast);
    setTimeout(() => toast.remove(), 7000);
  }
  // Offline-Fähigkeit und „Zum Home-Bildschirm“ (nur über https bzw. localhost).
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}
start();
