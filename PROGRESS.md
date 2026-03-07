# PROGRESS.md — subradar-web

_Обновляй этот файл после каждой завершённой фичи или фикса._

---

## ✅ Завершено

### Инфраструктура
- [x] React 18 + Vite + TypeScript strict
- [x] TanStack Query, Zustand, Tailwind CSS
- [x] React Router v6
- [x] Axios клиент (`/api/v1` в baseURL)
- [x] CI/CD GitHub Actions → rsync на сервер
- [x] nginx SPA routing + SSL

### Auth
- [x] Google Sign-In (`useGoogleLogin`, access_token flow)
- [x] Magic Link (`/auth/magic` callback страница)
- [x] Tokens в localStorage (`auth_token`, `refresh_token`)
- [x] AuthCallbackPage

### Страницы
- [x] LanguageSelectPage (9 языков, first-visit)
- [x] LoginPage (Google + Magic Link табы)
- [x] DashboardPage (метрики, upcoming payments, trend)
- [x] SubscriptionsPage (список, фильтры, поиск)
- [x] AnalyticsPage (графики, stat cards)
- [x] ReportsPage (генерация отчётов)
- [x] CardsPage (платёжные карты)
- [x] SettingsPage (профиль, тема, язык)
- [x] Legal pages (Privacy, Terms)

### UI/UX
- [x] Dark theme по умолчанию
- [x] Light/Dark переключатель (Sun/Moon в topbar)
- [x] Glassmorphism карточки
- [x] Responsive (mobile + desktop)
- [x] Safe area CSS env vars
- [x] Safari iOS: date inputs fix (`colorScheme`, `minHeight`)

### i18n
- [x] 9 языков: en, ru, es, de, fr, pt, zh, ja, ko
- [x] Полный аудит ключей (analytics, cards, reports, workspace, subscription, auth)
- [x] LanguageSelectPage с флагами и авто-детектом

### Bugfixes
- [x] White screen fix (`t()` на уровне модуля → внутрь компонента)
- [x] `daysUntil()` → `number | null` (защита от NaN)
- [x] `undefined activeCount` → `?? 0` fallback
- [x] `baseURL` исправлен (добавлен `/api/v1`)
- [x] Enum значения UPPERCASE (billingPeriod, paymentCardId, iconUrl)
- [x] nginx `localhost` → `127.0.0.1` (IPv4 fix)
- [x] ReportsPage date inputs: flex-col вместо grid

### Тесты
- [x] TypeScript strict (tsc --noEmit проходит)

---

## 🚧 В работе

_(ничего активного)_

---

## MVP Acceptance Criteria (из новой спецификации)

- [x] Пользователь может войти через Google
- [x] Пользователь видит список подписок
- [x] Пользователь видит dashboard (базовый)
- [x] Пользователь может сохранить card nickname + last4
- [ ] Dashboard с upcoming charges и trials
- [ ] Forecast (30d/6mo/12mo)
- [ ] AI text add (web version)
- [ ] AI screenshot add (web version)
- [ ] AI review screen (confirm before save)
- [ ] SubscriptionDetailPage
- [ ] Free limits и Pro gating
- [ ] Duplicate warning
- [ ] Аналитика обновляется после добавления подписки
- [ ] PDF report generation

## Backlog

- [ ] SubscriptionDetailPage (детальная страница подписки)
- [ ] New analytics endpoints integration (home, trends, categories, upcoming, trials, forecast, savings)
- [ ] AI text parsing integration (POST /ai/parse-text-subscription)
- [ ] AI screenshot parsing integration (POST /ai/parse-subscription-image)
- [ ] AI review screen (confirm AI result before saving)
- [ ] Subscription archive/pause/restore actions
- [ ] ARCHIVED status support in UI
- [ ] Empty state components per screen (per docs/STATE_RULES.md)
- [ ] Удалить PlanUsageBar прогресс-бары (бесполезны без данных)
- [ ] Исправить русскую плюрализацию ("1 подписок" → "1 подписка")
- [ ] Refresh token на httpOnly cookie
- [ ] Unit тесты (Vitest)
- [ ] COOP header для app.subradar.ai
- [ ] Google Cloud Console: добавить app.subradar.ai в Authorized JS Origins
- [ ] Проверить Magic Link end-to-end
