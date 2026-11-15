// Baut demo/index.html: eine eigenständige HTML-Datei mit der echten Oberfläche
// (components/lernraum.tsx) und einem Browser-Adapter statt Backend
// (demo/src/handoff-entry.tsx). Aufruf nach `npm ci`:  npm run demo:build
import {build} from 'esbuild';
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

const result = await build({
  entryPoints: [path.join(root, 'demo/src/handoff-entry.tsx')],
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  minify: true,
  legalComments: 'inline',
  define: {'process.env.NODE_ENV': '"production"'},
  // Optional für Umgebungen ohne lucide-react (z. B. Offline-Builds): LUCIDE_SHIM=/pfad/zur/datei
  alias: process.env.LUCIDE_SHIM ? {'lucide-react': process.env.LUCIDE_SHIM} : {},
  logLevel: 'warning',
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const css = (await readFile(path.join(root, 'app/globals.css'), 'utf8'))
  .replace(/^@import[^;]*;\s*/m, '');

const banner = '.demo-banner{position:relative;z-index:100;background:#fbebc7;color:#624b24;padding:10px 18px;font:13px/1.5 system-ui;text-align:center}.sidebar{top:40px}@media(max-width:760px){.sidebar{top:auto}}';

// Links auf /api/file und Abmelden innerhalb der Demo abfangen.
const linkShim = `document.addEventListener('click',async function(e){const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';if(href.startsWith('/api/file')){e.preventDefault();const r=await fetch(href);if(r.ok){const u=URL.createObjectURL(await r.blob());const d=document.createElement('a');d.href=u;d.download='Demo-Quelldatei.txt';d.click();setTimeout(()=>URL.revokeObjectURL(u),10000);}}else if(href.includes('signout')||href.includes('logout')){e.preventDefault();alert('Diese lokale Demo benötigt keine Anmeldung.');}else if(href==='/'){e.preventDefault();location.reload();}});`;

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Lernraum ${pkg.version} – lokale HTML-Demo</title><style>
${css}
${banner}</style></head><body><div class="demo-banner">LOKALE DEMO · v${pkg.version} · Beispieldaten · keine Anmeldung oder Cloud-Synchronisation · JSON-Pakete unterstützt · PDF/Text benötigt das Backend</div><div id="root"></div><script>${js}</script><script>${linkShim}</script></body></html>
`;

await writeFile(path.join(root, 'demo/index.html'), html);
console.log(`demo/index.html geschrieben (${(html.length / 1024).toFixed(0)} KB, v${pkg.version})`);
