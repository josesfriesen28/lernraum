// Baut die App als statische Website nach dist/ (für GitHub Pages oder jeden anderen Webspace).
//   npm run build            → dist/
//   npm run preview          → dist/ unter http://localhost:4173 ansehen
import {build} from 'esbuild';
import {cp, mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {validatePackage} from '../lib/package.mjs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, process.env.OUT_DIR || 'dist');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;

await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});

await build({
  entryPoints: [path.join(root, 'web/main.tsx')],
  outfile: path.join(out, 'app.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020', 'safari15'],
  jsx: 'automatic',
  minify: true,
  sourcemap: false,
  legalComments: 'linked',
  define: {'process.env.NODE_ENV': '"production"'},
  // Nur für Offline-Builds ohne lucide-react: LUCIDE_SHIM=/pfad/zur/datei
  alias: process.env.LUCIDE_SHIM ? {'lucide-react': process.env.LUCIDE_SHIM} : {},
  logLevel: 'warning',
});

const css = (await readFile(path.join(root, 'web/app.css'), 'utf8')).replace(/^@import[^;]*;\s*/m, '');
await writeFile(path.join(out, 'app.css'), css + '\n.storage-warning{background:#fbebc7;color:#624b24;padding:10px 18px;font:13px/1.5 system-ui;text-align:center}\n');

await cp(path.join(root, 'public'), out, {recursive: true});
// Mitgelieferte Lerninhalte: content/**/*.json → dist/content/ + Inhaltsverzeichnis
const contentDir = path.join(root, 'content');
const entries = [];
for (const file of (await readdir(contentDir, {recursive: true}).catch(() => [])).filter(f => f.endsWith('.json')).sort()) {
  const bytes = await readFile(path.join(contentDir, file));
  let pack;
  try {pack = validatePackage(JSON.parse(bytes.toString('utf8')));}
  catch (e) {throw Error(`content/${file}: ${e.message}`);}
  if (!pack.course) throw Error(`content/${file}: Feld „course“ (Modulname) fehlt.`);
  const dup = entries.find(e => e.packageId === pack.packageId);
  if (dup) throw Error(`content/${file}: packageId „${pack.packageId}“ wird schon von ${dup.file} verwendet.`);
  const rel = file.split(path.sep).join('/');
  await mkdir(path.dirname(path.join(out, 'content', rel)), {recursive: true});
  await writeFile(path.join(out, 'content', rel), bytes);
  entries.push({file: rel, packageId: pack.packageId, course: pack.course, examType: pack.examType, title: pack.title, tasks: pack.tasks.length, hash: createHash('sha256').update(bytes).digest('hex')});
}
await mkdir(path.join(out, 'content'), {recursive: true});
await writeFile(path.join(out, 'content', 'index.json'), JSON.stringify({version, entries}, null, 1));
const total = entries.reduce((n, e) => n + e.tasks, 0);

const sw = (await readFile(path.join(root, 'web/sw.js'), 'utf8')).replaceAll('__VERSION__', version);
await writeFile(path.join(out, 'sw.js'), sw);

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Lernraum · Wissen, das bleibt</title>
<meta name="description" content="Persönlicher Lernraum: Aufgabenpakete, aktives Abrufen, Wiederholungsplan.">
<meta name="theme-color" content="#234b40">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Lernraum">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="lernraum-version" content="${version}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icon.png">
<link rel="stylesheet" href="app.css?v=${version}">
</head>
<body>
<div id="root"></div>
<noscript>Lernraum braucht JavaScript.</noscript>
<script src="app.js?v=${version}"></script>
</body>
</html>
`;
await writeFile(path.join(out, 'index.html'), html);
// GitHub Pages soll Dateien nicht durch Jekyll schicken.
await writeFile(path.join(out, '.nojekyll'), '');
console.log(`dist/ gebaut – Lernraum v${version} · ${entries.length} Inhaltspakete, ${total} Aufgaben`);
