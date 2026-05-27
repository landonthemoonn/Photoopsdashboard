import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const SETTINGS_FILE = path.join(__dirname, 'studio-settings.json');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function getLocalIp() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const i of ifaces ?? []) {
      if (i.family === 'IPv4' && !i.internal) return i.address;
    }
  }
  return 'localhost';
}

function loadSettings() {
  try { return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')); }
  catch { return { credentials: {}, config: {} }; }
}

function saveSettings(data) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
}

const getBody = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch (e) { reject(e); } });
});

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (res, status, data) => {
  res.writeHead(status, { ...cors, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); res.end(); return; }

  // Jamf proxy
  if (req.url === '/.netlify/functions/jamf' && req.method === 'POST') {
    try {
      const { clientId, clientSecret, jamfUrl } = await getBody(req);
      if (!clientId || !clientSecret) return json(res, 400, { error: 'no-creds' });
      const base = (jamfUrl ?? 'https://gapinc.jamfcloud.com').replace(/\/$/, '');
      const tokenRes = await fetch(`${base}/api/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }).toString(),
      });
      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error(`[Jamf] Auth failed (${tokenRes.status}):`, errText);
        return json(res, 401, { error: 'auth', detail: errText });
      }
      const { access_token } = await tokenRes.json();
      console.log(`[Jamf] Token acquired, fetching devices...`);

      // Try v2 first, fall back to v1
      let devRes = await fetch(`${base}/api/v2/computers?page-size=200`, {
        headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' },
      });
      if (devRes.status === 404) {
        console.log(`[Jamf] v2 returned 404, trying v1...`);
        devRes = await fetch(`${base}/api/v1/computers-preview?page-size=200`, {
          headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' },
        });
      }
      if (!devRes.ok) {
        const errText = await devRes.text();
        console.error(`[Jamf] Device fetch failed (${devRes.status}):`, errText);
        return json(res, devRes.status, { error: 'fetch', detail: errText });
      }
      console.log(`[Jamf] Fetched devices successfully`);
      return json(res, 200, await devRes.json());
    } catch (e) {
      console.error(`[Jamf] Error:`, e.message);
      return json(res, 500, { error: 'server-error', detail: e.message });
    }
  }

  // Settings (stored in local JSON file — no cloud needed)
  if (req.url === '/.netlify/functions/settings') {
    if (req.method === 'GET') return json(res, 200, loadSettings());
    if (req.method === 'POST') {
      try {
        const body = await getBody(req);
        saveSettings(body);
        return json(res, 200, { ok: true });
      } catch (e) {
        return json(res, 500, { error: e.message });
      }
    }
  }

  // Serve static files from dist/
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html'); // SPA fallback
  }

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404); res.end('Not found');
  }

}).listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log(`\n  Photo Ops Dashboard\n`);
  console.log(`  Local:    http://localhost:${PORT}`);
  console.log(`  Network:  http://${ip}:${PORT}  ← share this with the team\n`);
});
