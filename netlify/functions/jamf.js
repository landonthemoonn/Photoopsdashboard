exports.handler = async function (event) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  let clientId, clientSecret, jamfUrl;
  try {
    ({ clientId, clientSecret, jamfUrl } = JSON.parse(event.body ?? '{}'));
  } catch {
    return { statusCode: 400, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'bad-request' }) };
  }

  if (!clientId || !clientSecret) {
    return { statusCode: 400, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'no-creds' }) };
  }

  const baseUrl = (jamfUrl ?? 'https://gapinc.jamfcloud.com').replace(/\/$/, '');
  if (!/^https:\/\/[a-zA-Z0-9-]+\.jamfcloud\.com$/.test(baseUrl)) {
    return { statusCode: 400, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'invalid-url' }) };
  }

  try {
    const tokenRes = await fetch(`${baseUrl}/api/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }).toString(),
    });

    if (!tokenRes.ok) {
      return { statusCode: 401, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'auth' }) };
    }

    const { access_token } = await tokenRes.json();

    const res = await fetch(`${baseUrl}/api/v1/computers-preview?page-size=200`, {
      headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' },
    });

    if (!res.ok) {
      return { statusCode: res.status, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'fetch' }) };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'server-error', detail: e.message }),
    };
  }
};
