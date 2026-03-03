# SubRadar Web — Claude Code Guide

## Язык
**Всегда отвечай на русском языке.**

## Проект
SubRadar AI — веб-приложение для отслеживания и анализа подписок.

**Стек:** React 18 + Vite, TypeScript (strict), TailwindCSS 4, Zustand, TanStack Query v5, react-i18next, Axios, React Router v6.

**Смежные репозитории:**
- `subradar-backend` — NestJS API (порт 3100 prod / 3101 dev)
- `subradar-mobile` — React Native (Expo)
- `subradar-landing` — лендинг subradar.io

## Структура
```
src/
├── components/
│   ├── charts/          # Recharts компоненты (MonthlyBarChart, CategoryDonutChart, CardBreakdownChart)
│   ├── layout/          # AppLayout (sidebar + mobile nav)
│   ├── shared/          # CategoryIcon, StatusBadge, CardBrandBadge
│   ├── subscriptions/   # SubscriptionCard, UpcomingPayments, AddSubscriptionModal, ReceiptUploader
│   └── ui/              # EmptyState, Skeleton, Toast
├── hooks/               # TanStack Query хуки (useSubscriptions, useAnalytics, useAuth…)
├── lib/                 # api.ts (axios), utils.ts, i18n.ts
├── locales/             # en.json, ru.json, es.json, de.json, fr.pt.zh.ja.ko.json
├── pages/               # Страницы приложения
├── providers/           # QueryClientProvider, ToastProvider, GoogleOAuthProvider
├── store/               # Zustand: useAppStore, authStore
└── types/               # index.ts — все TS-типы
```

## Критичные правила

### API
- **Все API-вызовы** только через хуки из `src/hooks/`. Не вызывать `api.*` напрямую в компонентах.
- Базовый URL: `VITE_API_URL` (по умолчанию `https://api.subradar.ai/api/v1`).
- Профиль обновляется через `PATCH /users/me` (не `/auth/me`).
- Скачивание отчётов — `useDownloadReport()`, не прямая ссылка.
- Отмена подписки — `useCancelSubscription()` → `POST /subscriptions/:id/cancel`.

### Типы
- **Никогда не использовать `any`**. Все типы в `src/types/index.ts`.
- `BillingCycle` = `'monthly' | 'yearly' | 'weekly' | 'quarterly'`.
- `SubscriptionStatus` = `'active' | 'paused' | 'cancelled' | 'trial'`.
- `Category` = `'streaming' | 'ai' | 'infra' | 'music' | 'gaming' | 'productivity' | 'fitness' | 'news' | 'other'`.

### Стейт
- **Zustand** `useAppStore` — theme, currency, language, user.
- **Zustand** `authStore` — accessToken, isAuthenticated, logout.
- **TanStack Query** — все серверные данные (подписки, аналитика, карты, отчёты).
- Токены хранятся в `localStorage` (`auth_token`, `refresh_token`).
- Авторефреш токена реализован в `src/lib/api.ts` (interceptor).

### Стилизация
- Tailwind CSS 4, кастомные CSS-переменные в `src/index.css`.
- `glass-card` — базовый класс для карточек.
- `page-title`, `page-subtitle`, `section-title` — классы заголовков.
- `stat-card` — карточки со статистикой (с `::before` градиентом).
- Тема переключается через `.dark` класс на `<html>`.
- Все иконки — **Lucide React**.

### Переводы (i18n)
- `useTranslation()` из `react-i18next`.
- Ключи: `src/locales/en.json` (основной) + 8 языков.
- При добавлении нового ключа — добавлять во **все** файлы локализации.
- Программно: `const { t } = useTranslation(); t('key')`.

### Код
- **Без лишних комментариев** — код самодокументируемый.
- Сначала ищи существующий компонент в `components/ui/` или `components/shared/`.
- Новый компонент создавать только если подходящего нет.
- `cn()` из `src/lib/utils.ts` для условных классов.

## Команды
```bash
npm run dev       # Дев-сервер (порт 5173)
npm run build     # Сборка в dist/
npm run preview   # Превью сборки
npm run lint      # ESLint
```

## Git
- Основная ветка: `main`.
- Фичи: ветки от `main`, PR-ы через GitHub.
- Последний деплой: DigitalOcean → `app.subradar.io`.

## Детальная документация
Перед началом работы читай релевантные файлы из `agent_docs/`:

| Файл | Когда читать |
|------|-------------|
| `agent_docs/architecture.md` | Стейт, API-паттерны, авторизация, роутинг |
| `agent_docs/api-contracts.md` | Все эндпоинты, соответствие хуков и бэкенда |
| `agent_docs/design-system.md` | CSS-токены, компоненты, иконки, Tailwind |
| `agent_docs/i18n.md` | Переводы, ключи, добавление нового языка |
| `agent_docs/types.md` | TypeScript типы, модели данных |
| `agent_docs/deployment.md` | Docker, переменные окружения, CI/CD |

## TZ (Техническое Задание)
Полное ТЗ: `subradar-backend/TZ.md` — данные модели, API, монетизация, инфраструктура.
