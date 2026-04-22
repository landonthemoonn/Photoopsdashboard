import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { request as httpsRequest } from 'node:https';
import { networkInterfaces } from 'node:os';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 3000;
const DIST = join(__dirname, 'dist');
const JAMF_HOST = 'gapinc.jamfcloud.com';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Proxy /api/jamf/* → https://gapinc.jamfcloud.com/*
  if (url.pathname.startsWith('/api/jamf/')) {
    const jamfPath = url.pathname.replace('/api/jamf', '') + url.search;
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      const headers = { ...req.headers, host: JAMF_HOST };
      if (body.length) headers['content-length'] = body.length;

      const proxy = httpsRequest(
        { hostname: JAMF_HOST, port: 443, path: jamfPath, method: req.method, headers },
        (jamfRes) => {
          res.writeHead(jamfRes.statusCode, {
            ...jamfRes.headers,
            'access-control-allow-origin': '*',
          });
          jamfRes.pipe(res);
        }
      );
      proxy.on('error', (e) => { res.writeHead(502); res.end(`Proxy error: ${e.message}`); });
      if (body.length) proxy.write(body);
      proxy.end();
    });
    return;
  }

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' });
    res.end();
    return;
  }

  // Serve static files from dist/
  let filePath = join(DIST, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    filePath = join(DIST, 'index.html'); // SPA fallback
  }

  try {
    const stat = statSync(filePath);
    const mime = MIME[extname(filePath)] ?? 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime, 'Content-Length': stat.size });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, '0.0.0.0', () => {
  const ifaces = Object.values(networkInterfaces())
    .flat()
    .filter(i => i.family === 'IPv4' && !i.internal)
    .map(i => `  http://${i.address}:${PORT}`);

  console.log(`\n  PhotoOps Dashboard\n`);
  console.log(`  Local:    http://localhost:${PORT}`);
  if (ifaces.length) console.log(`  Network:  ${ifaces[0].trim()}`);
  console.log(`\n  Share the Network URL with anyone on the studio Wi-Fi.\n`);
});
