# Архитектура приложения

## Стек

| Слой | Технология |
|------|-----------|
| UI | React 18 + Vite |
| Роутинг | React Router v6 |
| Серверный стейт | TanStack Query v5 |
| Клиентский стейт | Zustand |
| HTTP-клиент | Axios (`src/lib/api.ts`) |
| Стили | TailwindCSS 4 + CSS variables |
| i18n | react-i18next |
| Иконки | Lucide React |
| Графики | Recharts |

---

## Стейт-менеджмент

### Zustand сторы

**`useAppStore`** (`src/store/useAppStore.ts`) — глобальные пользовательские настройки:
```ts
{
  user: User | null
  theme: 'dark' | 'light'
  currency: string        // 'USD'
  language: string        // 'en'
  setUser / setTheme / setCurrency / setLanguage / toggleTheme
}
```

**`authStore`** (`src/store/authStore.ts`) — авторизационный стейт:
```ts
{
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth(user, token, refreshToken?)
  logout()
}
```
Токены персистируются в `localStorage`:
- `auth_token` — access token (JWT)
- `refresh_token` — refresh token

### TanStack Query

Все серверные данные управляются через хуки в `src/hooks/`.

**Query keys соглашение:**
```ts
['subscriptions']           // список
['subscriptions', id]       // одна запись
['subscriptions', filters]  // с фильтрами
['analytics', 'summary']
['analytics', 'monthly']
['payment-cards']
['reports']
['reports', id]
['auth', 'me']
['billing', 'me']
```

**Invalidation после мутаций:** все мутации инвалидируют связанные query keys через `useQueryClient()`.

---

## API-интеграция

### Axios инстанс (`src/lib/api.ts`)

```ts
const api = axios.create({ baseURL: VITE_API_URL })
```

**Request interceptor:**
- Читает `auth_token` из localStorage
- Добавляет `Authorization: Bearer <token>` в каждый запрос

**Response interceptor (401 handler):**
- При 401 — пытается обновить токен через `POST /auth/refresh`
- Ставит в очередь все запросы, пришедшие во время обновления
- При успехе — повторяет оригинальный запрос с новым токеном
- При провале — редирект на `/login`

### Правило: API только через хуки

Никогда не вызывать `api.get/post/patch/delete` напрямую в компонентах.
Исключение: `src/lib/api.ts` interceptors.

---

## Роутинг

### App.tsx структура

```
/                    → редирект на /login
/login               → LoginPage
/auth/callback       → AuthCallbackPage (Google OAuth)
/auth/magic          → MagicLinkPage (верификация magic link)
/legal/terms         → TermsPage
/legal/privacy       → PrivacyPage
/legal/cookies       → CookiesPage
/legal/refund        → RefundPage
/app/*               → Protected (AppLayout)
  /app/dashboard     → DashboardPage
  /app/subscriptions → SubscriptionsPage
  /app/subscriptions/add → AddSubscriptionPage
  /app/subscriptions/:id → SubscriptionDetailPage
  /app/cards         → CardsPage
  /app/analytics     → AnalyticsPage
  /app/reports       → ReportsPage
  /app/settings      → SettingsPage
```

**Защита роутов:** `ProtectedRoute` компонент проверяет наличие `auth_token` в localStorage. При отсутствии — редирект на `/login`.

---

## Авторизация

### Флоу: Google OAuth
1. Пользователь кликает "Continue with Google"
2. `useGoogleLogin` из `@react-oauth/google` инициирует implicit flow
3. Получаем `access_token` от Google
4. Отправляем `POST /auth/google/token { accessToken }` на бэкенд
5. Получаем `{ accessToken, refreshToken }` от бэкенда
6. Сохраняем в localStorage, редирект на dashboard

### Флоу: Magic Link
1. Пользователь вводит email
2. `POST /auth/magic-link { email }` — бэкенд отправляет письмо
3. Пользователь кликает ссылку в письме → `/auth/magic?token=XXX`
4. `MagicLinkPage` извлекает token, `GET /auth/magic?token=XXX`
5. Получаем `{ accessToken, refreshToken }`, сохраняем, редирект

### Refresh Token
- При 401 — автоматически `POST /auth/refresh { refreshToken }`
- Логика в response interceptor в `src/lib/api.ts`
- Параллельные запросы ставятся в очередь до завершения refresh

---

## AppLayout

**Desktop (md+):**
- Фиксированный сайдбар слева (264px / 72px collapsed)
- Кнопка сворачивания `‹/›` на правом краю сайдбара
- Основной контент сдвигается вправо через `md:ml-64` / `md:ml-[72px]`

**Mobile (<md):**
- Sticky topbar с гамбургером и логотипом
- Drawer-меню (slide-in) с overlay
- Фиксированная bottom navigation (5 пунктов)
- FAB-кнопка `+` над bottom nav (только на dashboard/subscriptions)

---

## Хуки — ответственности

| Хук | Эндпоинт | Назначение |
|-----|---------|-----------|
| `useSubscriptions` | `GET /subscriptions` | Список с фильтрами |
| `useSubscription` | `GET /subscriptions/:id` | Одна подписка |
| `useCreateSubscription` | `POST /subscriptions` | Создание |
| `useUpdateSubscription` | `PATCH /subscriptions/:id` | Обновление |
| `useDeleteSubscription` | `DELETE /subscriptions/:id` | Удаление |
| `useCancelSubscription` | `POST /subscriptions/:id/cancel` | Отмена |
| `usePauseSubscription` | `PATCH /subscriptions/:id` `{status:'paused'}` | Пауза |
| `useRestoreSubscription` | `PATCH /subscriptions/:id` `{status:'active'}` | Восстановление |
| `useAIParseSubscription` | `POST /ai/parse-screenshot` | AI парсинг скриншота |
| `useAnalyticsSummary` | `GET /analytics/summary` | Сводная статистика |
| `useAnalyticsMonthly` | `GET /analytics/monthly` | Тренд по месяцам |
| `useAnalyticsByCategory` | `GET /analytics/by-category` | По категориям |
| `useAnalyticsByCard` | `GET /analytics/by-card` | По картам |
| `useUpcoming` | `GET /analytics/upcoming` | Ближайшие платежи |
| `usePaymentCards` | `GET /payment-cards` | Список карт |
| `useCreateCard` | `POST /payment-cards` | Добавление карты |
| `useUpdateCard` | `PATCH /payment-cards/:id` | Редактирование |
| `useDeleteCard` | `DELETE /payment-cards/:id` | Удаление карты |
| `useReports` | `GET /reports` | Список отчётов |
| `useGenerateReport` | `POST /reports/generate` | Генерация |
| `useReportStatus` | `GET /reports/:id` | Статус с polling |
| `useDownloadReport` | `GET /reports/:id/download` | Скачать blob |
| `useLookupService` | `POST /ai/lookup` | AI поиск сервиса |
| `useParseScreenshot` | `POST /ai/parse-screenshot` | AI парсинг файла |
| `useAuth` | `GET /auth/me` | Текущий пользователь |
| `useUpdateProfile` | `PATCH /users/me` | Обновление профиля |
| `useBillingMe` | `GET /billing/me` | Статус подписки |
| `useCheckout` | `POST /billing/checkout` | Checkout URL |
| `useCancelBilling` | `POST /billing/cancel` | Отмена Pro |
| `useReceipts` | `GET /subscriptions/:id/receipts` | Список чеков |
| `useUploadReceipt` | `POST /subscriptions/:id/receipts` | Загрузка чека |
| `useDeleteReceipt` | `DELETE /subscriptions/:id/receipts/:rId` | Удаление чека |

---

## Провайдеры (`src/providers/`)

```tsx
<GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </QueryClientProvider>
</GoogleOAuthProvider>
```

**ToastProvider** — глобальные toast-уведомления. Хук `useToast()` возвращает `{ success, error, info }`.
