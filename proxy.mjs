import http from 'http';

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
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors); res.end(); return;
  }

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

      if (!tokenRes.ok) return json(res, 401, { error: 'auth' });

      const { access_token } = await tokenRes.json();

      const devRes = await fetch(`${base}/api/v1/computers-preview?page-size=200`, {
        headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' },
      });

      if (!devRes.ok) return json(res, devRes.status, { error: 'fetch' });

      const data = await devRes.json();
      return json(res, 200, data);
    } catch (e) {
      console.error('Jamf error:', e.message);
      return json(res, 500, { error: 'server-error', detail: e.message });
    }
  }

  res.writeHead(404, cors); res.end('Not found');

}).listen(8888, () => {
  console.log('✓ Jamf proxy ready on http://localhost:8888');
});
