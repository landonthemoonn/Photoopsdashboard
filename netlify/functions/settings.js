const { neon } = require('@neondatabase/serverless');

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function getDb() {
  if (!process.env.DATABASE_URL) throw new Error('no-db');
  const sql = neon(process.env.DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS photoops_settings (
      id INTEGER PRIMARY KEY,
      credentials JSONB NOT NULL DEFAULT '{}',
      config JSONB NOT NULL DEFAULT '{}'
    )
  `;
  return sql;
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  try {
    const sql = await getDb();

    if (event.httpMethod === 'GET') {
      const rows = await sql`SELECT credentials, config FROM photoops_settings WHERE id = 1`;
      const row = rows[0] ?? { credentials: {}, config: {} };
      return {
        statusCode: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      };
    }

    if (event.httpMethod === 'POST') {
      const { credentials, config } = JSON.parse(event.body ?? '{}');
      await sql`
        INSERT INTO photoops_settings (id, credentials, config)
        VALUES (1, ${JSON.stringify(credentials ?? {})}, ${JSON.stringify(config ?? {})})
        ON CONFLICT (id) DO UPDATE SET
          credentials = EXCLUDED.credentials,
          config = EXCLUDED.config
      `;
      return {
        statusCode: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true }),
      };
    }

    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  } catch (e) {
    const noDb = e.message === 'no-db';
    return {
      statusCode: noDb ? 503 : 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: noDb ? 'no-db' : 'db-error', detail: e.message }),
    };
  }
};
