// Kleiner statischer Server für dist/ – zum Ausprobieren vor dem Hochladen.
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 4173);
const types = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8'};

createServer(async (req, res) => {
  let file = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(dir)) {res.writeHead(403); return res.end();}
  try {if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, {'content-type': types[path.extname(file)] || 'application/octet-stream'});
    res.end(await readFile(file));
  } catch {res.writeHead(404); res.end('Nicht gefunden');}
}).listen(port, '127.0.0.1', () => console.log(`Lernraum läuft auf http://localhost:${port}`));
