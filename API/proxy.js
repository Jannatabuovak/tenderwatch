// api/proxy.js — Vercel Serverless Function
// Проксирует запросы к api.tenderplus.kz, обходя CORS

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path, ...params } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Параметр path обязателен' });
  }

  const queryString = new URLSearchParams(params).toString();
  const targetUrl = `https://api.tenderplus.kz/${path}${queryString ? '?' + queryString : ''}`;

  console.log(`[Proxy] → ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'TenderWatch/1.0',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    console.log(`[Proxy] ← HTTP ${response.status}`);

    return res.status(response.status).json(
      typeof data === 'string' ? { raw: data } : data
    );
  } catch (err) {
    console.error('[Proxy] Ошибка:', err.message);
    return res.status(500).json({
      error: 'Ошибка прокси',
      message: err.message,
    });
  }
};
