# CLAUDE.md — subradar-web

## Контекст проекта
React SPA — веб-версия Subradar (AI-трекер подписок).
**Prod:** `https://app.subradar.ai` → `/var/www/app.subradar.ai`
**Dev:** `https://app-dev.subradar.ai` → `/var/www/app-dev.subradar.ai`
**API:** `https://api.subradar.ai/api/v1`

## Стек
- React 18 + Vite + TypeScript (strict)
- TanStack Query (server state)
- Zustand (client state)
- Tailwind CSS
- react-i18next (9 языков)
- react-router-dom v6
- @react-oauth/google (`useGoogleLogin`, access_token flow)
- recharts (графики)
- axios

## Структура
```
src/
  components/
    cards/        # Карточки (SubscriptionCard и др.)
    charts/       # Графики (recharts)
    layout/       # AppLayout, Sidebar, TopBar
    shared/       # Переиспользуемые компоненты
    subscriptions/ # Компоненты подписок
    ui/           # Базовые UI компоненты
  hooks/          # Кастомные хуки (useSubscriptions, useAnalytics и др.)
  lib/
    api.ts        # Axios instance (baseURL = VITE_API_URL || 'https://api.subradar.ai/api/v1')
    utils.ts      # Утилиты (daysUntil, formatCurrency и др.)
    i18n.ts       # i18n конфиг
  locales/        # Файлы переводов (9 языков)
  pages/
    DashboardPage.tsx
    SubscriptionsPage.tsx
    AnalyticsPage.tsx
    ReportsPage.tsx
    CardsPage.tsx
    SettingsPage.tsx
    LoginPage.tsx
    LanguageSelectPage.tsx
    MagicLinkPage.tsx
    AuthCallbackPage.tsx
    legal/
  providers/
    ThemeProvider.tsx   # dark/light класс на <html>
  store/
    useAppStore.ts      # theme, toggleTheme, setTheme
    authStore.ts        # auth_token, refresh_token
  types/
    index.ts            # Все TypeScript типы
```

## Правила кода

### Типы (КРИТИЧНО — не менять без синхронизации с бэком)
```ts
// Все энумы UPPERCASE
type BillingCycle = 'MONTHLY' | 'YEARLY' | 'WEEKLY' | 'QUARTERLY' | 'LIFETIME' | 'ONE_TIME'
type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'TRIAL'
type Category = 'STREAMING' | 'AI_SERVICES' | 'INFRASTRUCTURE' | 'MUSIC' |
                'GAMING' | 'PRODUCTIVITY' | 'HEALTH' | 'NEWS' | 'OTHER'

// Subscription interface — поля как на бэке:
interface Subscription {
  billingPeriod: BillingCycle   // НЕ period
  paymentCardId: string         // НЕ cardId
  paymentCard?: PaymentCard
  iconUrl?: string              // НЕ logoUrl
  nextPaymentDate?: string
  currentPlan?: string
}
```

### Токены
```ts
// Хранятся в localStorage:
localStorage.getItem('auth_token')     // access token
localStorage.getItem('refresh_token')  // refresh token
```

### Тема
```ts
// useAppStore: theme, toggleTheme, setTheme
// ThemeProvider применяет класс 'dark'/'light' к <html>
// Ключ в localStorage: 'subradar-theme'
// Default: dark
```

### i18n
- 9 языков: en, ru, es, de, fr, pt, zh, ja, ko
- Локальные файлы: `src/locales/*.json`
- **t() ТОЛЬКО внутри компонентов** (не на уровне модуля — это Fatal crash!)
- Ключ языка: `subradar-language`
- Флаг выбора: `subradar_lang_chosen`

### Роутинг
```tsx
// App.tsx: / → проверяет subradar_lang_chosen
//   если не выбран → <LanguageSelectPage />
//   если выбран → /login
// /language → всегда LanguageSelectPage
// /auth/magic → MagicLinkPage (magic link callback)
```

### Google OAuth
```ts
// useGoogleLogin (access_token flow)
// После получения access_token → POST /auth/google/token { accessToken }
// НЕ использовать GoogleLogin компонент (id_token flow)
```

### API
```ts
// src/lib/api.ts:
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.subradar.ai/api/v1'
// ВСЕГДА включать /api/v1 в baseURL — иначе 404 в проде
```

### Утилиты
```ts
// daysUntil(date) → number | null (null если дата невалидна/отсутствует)
// НЕ использовать напрямую без null-check
```

### Safari iOS
- Date inputs: `style={{ colorScheme: 'dark', minHeight: '44px' }}`
- Flex layouts для дат вместо grid (предотвращает overlap)

## Git workflow
```bash
git checkout dev && git pull
git checkout -b feat/xxx
# ... работа ...
git checkout dev && git merge feat/xxx
git push origin dev
git branch -d feat/xxx && git push origin --delete feat/xxx
# main → prod (только по запросу)
```

## Деплой
```bash
npm run build
# Dev:
rsync -az --delete -e "ssh -i ~/.ssh/id_steptogoal" dist/ root@46.101.197.19:/var/www/app-dev.subradar.ai/
# Prod (только по запросу!):
rsync -az --delete -e "ssh -i ~/.ssh/id_steptogoal" dist/ root@46.101.197.19:/var/www/app.subradar.ai/
```

## Тесты
- Vitest + @testing-library/react
- `npx tsc --noEmit` перед коммитом
- `npm run build` должен проходить без ошибок

## ⛔ НЕ ТРОГАТЬ без явного запроса
- Enum значения (UPPERCASE) — бэк и мобилка завязаны
- Ключи localStorage (`auth_token`, `refresh_token`, `subradar-theme`, `subradar-language`)
- `src/lib/api.ts` baseURL — обязательно `/api/v1` на конце
- Существующие ключи i18n (только добавлять, не переименовывать)
- `t()` на уровне модуля — **Fatal crash при инициализации**

## Документация

Подробная спецификация продукта в папке `docs/`:
- `docs/PRODUCT_OVERVIEW.md` — обзор продукта, принципы, аудитория, монетизация, MVP критерии
- `docs/DOMAIN_MODEL.md` — все сущности и их поля, lifecycle статусов
- `docs/API_CONTRACTS.md` — все API endpoints с примерами
- `docs/BILLING_RULES.md` — тарифы Free/Pro/Team, логика триала
- `docs/AI_BEHAVIOR.md` — правила поведения AI, confidence levels, fallback
- `docs/STATE_RULES.md` — жизненный цикл подписки, empty states
- `docs/WEB_SCREENS.md` — screen-by-screen PRD для веб-страниц

Детальные agent guides в `agent_docs/`:
- `agent_docs/architecture.md` — архитектура, стейт, роутинг
- `agent_docs/types.md` — TypeScript типы и маппинг на бэкенд
- `agent_docs/api-contracts.md` — API контракты Web <-> Backend
- `agent_docs/design-system.md` — дизайн-система, компоненты, цвета
- `agent_docs/deployment.md` — деплой, env переменные
- `agent_docs/i18n.md` — интернационализация

## Agent Rules
1. Не ломать существующий Google auth
2. Не добавлять новые библиотеки без явной причины
3. Любая AI-фича должна иметь fallback UI
4. Любой новый экран должен быть связан с docs/WEB_SCREENS.md
5. Любой новый API endpoint должен быть отражён в agent_docs/api-contracts.md и docs/API_CONTRACTS.md
6. Любая тяжёлая операция должна быть async
7. Любые финансовые данные требуют user confirmation
8. Любая новая сущность должна иметь status lifecycle
9. Любая продуктовая фича должна иметь analytics events
10. Не реализовывать Release 2/3 фичи, пока не стабилен MVP (Release 1)

## Прогресс
См. `PROGRESS.md` в корне репозитория.
