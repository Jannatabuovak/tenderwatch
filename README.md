# TenderWatch — Деплой на Vercel

## Структура проекта

```
tenderwatch/
├── api/
│   └── proxy.js        ← Серверная функция (обходит CORS)
├── public/
│   └── index.html      ← Фронтенд приложения
├── vercel.json         ← Конфигурация Vercel
└── package.json
```

## Деплой за 3 минуты

### Способ 1 — через сайт Vercel (самый простой)

1. Распакуйте архив `tenderwatch.zip`
2. Зайдите на **vercel.com** → войдите через GitHub/Google/email
3. Нажмите **"Add New Project"** → **"Browse"** → выберите папку `tenderwatch`
4. Нажмите **Deploy** — готово!
5. Vercel выдаст вам URL типа `https://tenderwatch-xxx.vercel.app`

### Способ 2 — через Vercel CLI

```bash
npm i -g vercel
cd tenderwatch
vercel
# Следуйте инструкциям, на вопросы жмите Enter
```

## Как это работает

```
Браузер → /api/proxy?path=tender/&token=xxx
                ↓
        Vercel Function (Node.js)
                ↓
        api.tenderplus.kz/tender/?token=xxx
                ↓
        JSON ответ → обратно в браузер
```

Прокси находится на том же домене что и сайт → нет CORS!

## Ваш токен

Токен уже вставлен в приложение: `4c9321c22ab7b510786b1e27fa7a31cb`
