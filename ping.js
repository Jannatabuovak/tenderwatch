// api/ping.js — тестовая функция для проверки деплоя
module.exports = function handler(req, res) {
  res.status(200).json({ ok: true, ts: Date.now(), msg: 'Vercel functions работают!' });
};
