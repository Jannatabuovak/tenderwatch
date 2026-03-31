// api/proxy.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const payload = req.method === 'POST' ? req.body : req.query;
    const { query, variables, token } = payload || {};

    if (!query) {
      return res.status(400).json({
        error: 'Параметр query обязателен'
      });
    }

    const targetUrl = 'https://api.tenderplus.kz/graphql';

    console.log('[GraphQL Proxy] →', targetUrl);
    console.log('[GraphQL Query] →', query);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        query,
        variables: typeof variables === 'string'
          ? JSON.parse(variables || '{}')
          : (variables || {})
      })
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    console.log('[GraphQL Proxy] ← HTTP', response.status);

    return res.status(response.status).json(
      typeof data === 'string'
        ? { raw: data, targetUrl }
        : { ...data, targetUrl }
    );
  } catch (err) {
    console.error('[GraphQL Proxy] Ошибка:', err.message);
    return res.status(500).json({
      error: 'Ошибка прокси',
      message: err.message
    });
  }
}
