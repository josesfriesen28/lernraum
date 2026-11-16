// Einstiegspunkt der App (GitHub Pages). Kein Server: Daten liegen in IndexedDB.
import {createRoot} from 'react-dom/client';
import Lernraum from '../components/lernraum';
import {installBrowserBackend} from '../lib/browser-backend';

async function start() {
  const backend = await installBrowserBackend();
  if (backend.storage === 'memory') {
    const warn = document.createElement('div');
    warn.className = 'storage-warning';
    warn.textContent = 'Dieser Browser erlaubt keinen dauerhaften Speicher (z. B. privates Fenster). Änderungen gehen beim Schließen verloren.';
    document.body.prepend(warn);
  }
  createRoot(document.getElementById('root')!).render(<Lernraum user={{id: 'local', name: 'Lernraum'}}/>);
  // Offline-Fähigkeit und „Zum Home-Bildschirm“ (nur über https bzw. localhost).
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}
start();
