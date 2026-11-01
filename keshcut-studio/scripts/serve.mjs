// Tiny local preview server (no dependencies). Usage: node scripts/serve.mjs [folder]   default: dist, or public if dist does not exist.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = process.argv[2] || (existsSync('dist') ? 'dist' : 'public');
const port = Number(process.env.PORT) || 8080;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (p.endsWith('/') || p.endsWith('\\')) p += 'index.html';
    const file = join(root, p);
    if (!file.startsWith(root)) throw new Error('outside');
    const body = await readFile(file);
    const type = types[extname(file)] || 'application/octet-stream', m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    if (m) { const s = Number(m[1]) || 0, e = m[2] ? Number(m[2]) : body.length - 1; res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${s}-${e}/${body.length}`, 'Content-Length': e - s + 1 }); res.end(body.subarray(s, e + 1)); return; }
    res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes' });
    res.end(body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
