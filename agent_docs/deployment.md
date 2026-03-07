# Деплой и окружение

## Переменные окружения

Файл `.env` в корне проекта:

```env
VITE_API_URL=https://api.subradar.ai/api/v1
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

Для локальной разработки против dev-бэкенда:
```env
VITE_API_URL=http://46.101.197.19:3101/api/v1
```

---

## Команды

```bash
npm run dev       # Дев-сервер на порту 5173
npm run build     # Сборка в dist/
npm run preview   # Превью production-сборки
npm run lint      # ESLint проверка
```

---

## Инфраструктура

**Домен:** `app.subradar.ai`

**Сервер:** DigitalOcean `46.101.197.19`

**Бэкенд:**
- Prod: `api.subradar.ai` → порт 3100
- Dev: `api-dev.subradar.ai` → порт 3101

**DO Spaces:** хранение чеков и иконок (bucket: `subradar`)

---

## Docker (пример)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**nginx.conf** для SPA:
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Git Workflow

- `main` — production ветка
- Feature-ветки от `main`, PR через GitHub
- После merge в `main` — деплой на `app.subradar.ai`

---

## Смежные репозитории

| Репо | Описание | Порт |
|------|---------|------|
| `subradar-backend` | NestJS API | 3100 (prod) / 3101 (dev) |
| `subradar-mobile` | React Native / Expo | — |
| `subradar-landing` | Статический лендинг | — |

---

## Checklist перед деплоем

- [ ] `VITE_API_URL` указывает на prod
- [ ] `VITE_GOOGLE_CLIENT_ID` — продакшн OAuth client
- [ ] `npm run build` прошёл без ошибок
- [ ] `npm run lint` без ошибок
- [ ] Все новые ключи i18n добавлены во все локали
- [ ] API-хуки используют правильные эндпоинты (см. `agent_docs/api-contracts.md`)
