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

## 📋 Бэклог

- [ ] SubscriptionDetailPage (детальная страница подписки)
- [ ] Удалить PlanUsageBar прогресс-бары (бесполезны без данных)
- [ ] Исправить русскую плюрализацию ("1 подписок" → "1 подписка")
- [ ] Refresh token на httpOnly cookie
- [ ] Unit тесты (Vitest)
- [ ] COOP header для app.subradar.ai
- [ ] Google Cloud Console: добавить app.subradar.ai в Authorized JS Origins
- [ ] Проверить Magic Link end-to-end
