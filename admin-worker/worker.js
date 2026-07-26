const OWNER = 'dekelpl-dev';
const REPO = 'my-m';
const FILE_PATH = 'data.json';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405);
    }

    const url = new URL(request.url);
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ ok: false, error: 'Bad JSON' }, 400);
    }

    if (!body.password || body.password !== env.ADMIN_PASSWORD) {
      return json({ ok: false, error: 'Wrong password' }, 401);
    }

    if (url.pathname === '/api/verify') {
      return json({ ok: true }, 200);
    }

    if (url.pathname === '/api/save') {
      if (!Array.isArray(body.categories)) {
        return json({ ok: false, error: 'Invalid data: categories must be an array' }, 400);
      }
      try {
        const ghHeaders = {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'my-m-admin-worker',
        };

        const getRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
          { headers: ghHeaders }
        );
        if (!getRes.ok) {
          return json({ ok: false, error: 'Failed to read current file: ' + getRes.status }, 502);
        }
        const current = await getRes.json();
        const sha = current.sha;

        const payload = { clients: Array.isArray(body.clients) ? body.clients : [], categories: body.categories };
        const newContent = JSON.stringify(payload, null, 2) + '\n';
        const encoded = btoa(unescape(encodeURIComponent(newContent)));

        const putRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
          {
            method: 'PUT',
            headers: ghHeaders,
            body: JSON.stringify({
              message: 'Update site content via admin panel',
              content: encoded,
              sha,
            }),
          }
        );
        if (!putRes.ok) {
          const errText = await putRes.text();
          return json({ ok: false, error: 'GitHub write failed: ' + putRes.status + ' ' + errText }, 502);
        }
        return json({ ok: true }, 200);
      } catch (e) {
        return json({ ok: false, error: String((e && e.message) || e) }, 500);
      }
    }

    return json({ ok: false, error: 'Not found' }, 404);
  },
};
