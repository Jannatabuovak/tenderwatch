// api/proxy.js — Vercel Serverless Function
// Проксирует запросы к api.tenderplus.kz, обходя CORS

export default async function handler(req, res) {
  // CORS headers — разрешаем запросы с любого домена
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Получаем путь и параметры из запроса
  // Например: /api/proxy?path=tender/&token=xxx&limit=20&page=1
  const { path, ...params } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Параметр path обязателен' });
  }

  // Собираем строку параметров
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

    res.status(response.status).json(
      typeof data === 'string' ? { raw: data } : data
    );
  } catch (err) {
    console.error('[Proxy] Ошибка:', err.message);
    res.status(500).json({
      error: 'Ошибка прокси',
      message: err.message,
    });
  }
}
