# API Контракты — Backend ↔ Web

**Базовый URL:** `VITE_API_URL` (default: `https://api.subradar.ai/api/v1`)

---

## Auth

| Метод | Эндпоинт | Хук / Использование | Статус |
|-------|---------|---------------------|--------|
| `POST` | `/auth/google/token` | LoginPage напрямую | ✅ |
| `POST` | `/auth/magic-link` | `useAuth().loginWithMagicLink` | ✅ |
| `GET` | `/auth/magic?token=` | MagicLinkPage напрямую | ✅ |
| `POST` | `/auth/refresh` | api.ts interceptor | ✅ |
| `POST` | `/auth/logout` | `useAuth().logout` | ✅ |
| `GET` | `/auth/me` | `useAuth()` | ✅ |
| `PATCH` | `/users/me` | `useUpdateProfile()` | ✅ |

> ⚠️ **Важно:** Обновление профиля — `PATCH /users/me`, а не `/auth/me`.
> Бэкенд имеет только `GET /auth/me`. `PATCH /auth/me` не существует.

---

## Subscriptions

| Метод | Эндпоинт | Хук | Статус |
|-------|---------|-----|--------|
| `GET` | `/subscriptions` | `useSubscriptions(filters?)` | ✅ |
| `POST` | `/subscriptions` | `useCreateSubscription()` | ✅ |
| `GET` | `/subscriptions/:id` | `useSubscription(id)` | ✅ |
| `PATCH` | `/subscriptions/:id` | `useUpdateSubscription(id)` | ✅ |
| `DELETE` | `/subscriptions/:id` | `useDeleteSubscription()` | ✅ |
| `POST` | `/subscriptions/:id/cancel` | `useCancelSubscription()` | ✅ |
| `PATCH` | `/subscriptions/:id` `{status:'paused'}` | `usePauseSubscription()` | ✅ |
| `PATCH` | `/subscriptions/:id` `{status:'active'}` | `useRestoreSubscription()` | ✅ |

### CreateSubscriptionDto (бэкенд)
```ts
{
  name: string
  plan?: string
  amount: number
  currency: string          // 'USD', 'EUR', 'RUB', 'KZT'…
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly'
  category: 'streaming' | 'ai' | 'infra' | 'music' | 'gaming' | 'productivity' | 'fitness' | 'news' | 'other'
  status?: 'active' | 'paused' | 'cancelled' | 'trial'
  nextPaymentDate: string   // ISO date
  startDate: string         // ISO date
  cardId?: string
  logoUrl?: string
  notes?: string
}
```

---

## Nested Receipts

| Метод | Эндпоинт | Хук | Статус |
|-------|---------|-----|--------|
| `GET` | `/subscriptions/:id/receipts` | `useReceipts(subId)` | ✅ |
| `POST` | `/subscriptions/:id/receipts` | `useUploadReceipt()` | ✅ (multipart) |
| `DELETE` | `/subscriptions/:id/receipts/:receiptId` | `useDeleteReceipt()` | ✅ |

> Чек загружается как `multipart/form-data` с полем `file`. Лимит 10MB.

---

## Analytics

| Метод | Эндпоинт | Хук | Статус |
|-------|---------|-----|--------|
| `GET` | `/analytics/summary` | `useAnalyticsSummary()` | ✅ |
| `GET` | `/analytics/monthly` | `useAnalyticsMonthly()` | ✅ |
| `GET` | `/analytics/by-category` | `useAnalyticsByCategory()` | ✅ |
| `GET` | `/analytics/by-card` | `useAnalyticsByCard()` | ✅ |
| `GET` | `/analytics/upcoming?days=7` | `useUpcoming(days)` | ✅ |

### AnalyticsSummary Response
```ts
{
  totalMonthly: number
  totalYearly: number
  activeCount: number
  savingsPossible?: number
}
```

---

## Payment Cards

| Метод | Эндпоинт | Хук | Статус |
|-------|---------|-----|--------|
| `GET` | `/payment-cards` | `usePaymentCards()` | ✅ |
| `POST` | `/payment-cards` | `useCreateCard()` | ✅ |
| `PATCH` | `/payment-cards/:id` | `useUpdateCard(id)` | ✅ |
| `DELETE` | `/payment-cards/:id` | `useDeleteCard()` | ✅ |

> `PATCH /payment-cards/:id/set-default` — в бэкенде есть, хук не реализован (не используется в UI).

---

## AI

| Метод | Эндпоинт | Хук | Статус |
|-------|---------|-----|--------|
| `POST` | `/ai/lookup` | `useLookupService()` | ✅ |
| `POST` | `/ai/parse-screenshot` | `useParseScreenshot()`, `useAIParseSubscription()` | ✅ |

### Lookup Request/Response
```ts
// Request
{ query: string; locale?: string; country?: string }

// Response
{
  name: string
  logoUrl?: string
  category: string
  plans: { name: string; amount: number; currency: string; billingCycle: string }[]
}
```

> `/ai/voice`, `/ai/parse-text`, `/ai/suggest-cancel` — в бэкенде есть, в веб-хуках не реализованы (мобильные фичи).

---

## Reports

| Метод | Эндпоинт | Хук | Статус |
|-------|---------|-----|--------|
| `GET` | `/reports` | `useReports()` | ✅ |
| `POST` | `/reports/generate` | `useGenerateReport()` | ✅ |
| `GET` | `/reports/:id` | `useReportStatus(id, enabled)` | ✅ (с polling) |
| `GET` | `/reports/:id/download` | `useDownloadReport()` | ✅ (blob) |

### GenerateReportPayload
```ts
{
  type: 'summary' | 'detailed' | 'tax'
  format: 'pdf' | 'csv'
  startDate: string   // ISO date
  endDate: string     // ISO date
}
```

### Report Response
```ts
{
  id: string
  type: 'summary' | 'detailed' | 'tax'
  format: 'pdf' | 'csv'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  startDate: string
  endDate: string
  downloadUrl?: string
  createdAt: string
}
```

> `useReportStatus` автополлинг каждые 2 секунды, пока `status` = `pending` или `processing`.

---

## Billing

| Метод | Эндпоинт | Хук | Статус |
|-------|---------|-----|--------|
| `GET` | `/billing/plans` | `useBillingPlans()` | ✅ |
| `GET` | `/billing/me` | `useBillingMe()` | ✅ |
| `POST` | `/billing/checkout` | `useCheckout()` | ✅ |
| `POST` | `/billing/cancel` | `useCancelBilling()` | ✅ |

### Checkout Request/Response
```ts
// Request: planId (string) → бэкенд принимает как variantId/planId
// Response: { url: string }  — Lemon Squeezy checkout URL
```

---

## Workspace

| Метод | Эндпоинт | Хук | Статус |
|-------|---------|-----|--------|
| `POST` | `/workspace` | `useCreateWorkspace()` | ✅ |
| `GET` | `/workspace/me` | `useWorkspace()` | ✅ |
| `POST` | `/workspace/:id/invite` | `useInviteMember()` | ✅ |
| `DELETE` | `/workspace/:id/members/:memberId` | `useRemoveMember()` | ✅ |

Страница: `/app/workspace` → `WorkspacePage.tsx`

> `PATCH /workspace` (rename), `PATCH /workspace/members/:userId/role`, `GET /workspace/analytics` — в бэкенде не реализованы.

---

## Notifications (НЕ реализовано)

Эндпоинты `/notifications/*` в бэкенде — заглушки. Не реализовывать до готовности бэкенда.

---

## New Analytics Endpoints (from updated spec — docs/API_CONTRACTS.md)

Новая спецификация добавляет гранулярные аналитические эндпоинты:

| Метод | Эндпоинт | Описание | Статус |
|-------|---------|---------|--------|
| `GET` | `/analytics/home` | Dashboard data (total, delta, summary) | Planned |
| `GET` | `/analytics/trends` | Spending trends by month | Planned |
| `GET` | `/analytics/categories` | Category distribution | Planned |
| `GET` | `/analytics/upcoming` | Upcoming charges (30 days) | Planned |
| `GET` | `/analytics/trials` | Trials ending soon | Planned |
| `GET` | `/analytics/forecast` | Forecast (30d/6mo/12mo) | Planned |
| `GET` | `/analytics/savings` | Potential savings, duplicates | Planned |

> Эти эндпоинты заменяют текущие `/analytics/summary`, `/analytics/monthly`, `/analytics/by-category`, `/analytics/by-card`, `/analytics/upcoming`. Переход будет постепенным.

## New AI Endpoints (from updated spec)

| Метод | Эндпоинт | Описание | Статус |
|-------|---------|---------|--------|
| `POST` | `/ai/parse-text-subscription` | Parse from natural language text | Planned |
| `POST` | `/ai/parse-subscription-image` | Parse from screenshot/photo | Planned |
| `POST` | `/ai/match-service` | Match name to known services | Planned |
| `GET` | `/ai/subscription-insights` | AI insights for user's subs | Planned |
| `POST` | `/ai/run-audit` | Trigger monthly AI audit | Planned |

## New Subscription Endpoints (from updated spec)

| Метод | Эндпоинт | Описание | Статус |
|-------|---------|---------|--------|
| `POST` | `/subscriptions/:id/archive` | Archive subscription | Planned |
| `POST` | `/subscriptions/:id/pause` | Pause subscription | Planned |
| `POST` | `/subscriptions/:id/restore` | Restore subscription | Planned |

---

## Мобильные-only эндпоинты (не использовать в вебе)

- `POST /auth/apple` — Apple Sign In
- `POST /auth/google/mobile` — мобильный Google
- `POST /auth/verify` — мобильная верификация magic link
- `POST /ai/voice`, `/ai/parse-audio`, `/ai/voice-to-subscription`

> Полный список всех API эндпоинтов: `docs/API_CONTRACTS.md`
