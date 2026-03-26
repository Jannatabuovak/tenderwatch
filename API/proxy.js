// api/proxy.js — Vercel Serverless Function
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ error: 'Параметр path обязателен' });

  const qs = new URLSearchParams(params).toString();
  const targetUrl = `https://api.tenderplus.kz/${path}${qs ? '?' + qs : ''}`;
  console.log('[proxy] →', targetUrl);

  try {
    const upstream = await fetch(targetUrl, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'TenderWatch/1.0' },
    });
    const ct = upstream.headers.get('content-type') || '';
    const body = ct.includes('application/json') ? await upstream.json() : { raw: await upstream.text() };
    console.log('[proxy] ←', upstream.status);
    return res.status(upstream.status).json(body);
  } catch (err) {
    console.error('[proxy] err:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
