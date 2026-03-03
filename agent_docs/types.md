# TypeScript Типы

Все типы определены в `src/types/index.ts`.

---

## Основные типы

### Subscription
```ts
interface Subscription {
  id: string
  name: string
  plan: string
  amount: number
  currency: string               // 'USD', 'EUR', 'RUB', 'KZT'
  billingCycle: BillingCycle
  category: Category
  status: SubscriptionStatus
  nextPaymentDate: string        // ISO date string
  startDate: string              // ISO date string
  cardId?: string
  card?: PaymentCard             // populated по join на бэкенде
  logoUrl?: string
  notes?: string
  receipts?: Receipt[]
}
```

### BillingCycle
```ts
type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly'
```

### SubscriptionStatus
```ts
type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'trial'
```

Цвета статусов:
- `active` → зелёный (`#10b981`)
- `trial` → синий (`#3b82f6`)
- `paused` → жёлтый (`#f59e0b`)
- `cancelled` → серый (`#6b7280`)

### Category
```ts
type Category =
  | 'streaming'    // Netflix, Кинопоиск
  | 'ai'           // ChatGPT, Midjourney
  | 'infra'        // DigitalOcean, Vercel, GitHub
  | 'music'        // Spotify, Apple Music
  | 'gaming'       // Steam, PS Plus
  | 'productivity' // Notion, Adobe, Figma
  | 'fitness'      // Apple Fitness, Peloton
  | 'news'         // Medium, Substack
  | 'other'
```

---

## PaymentCard
```ts
interface PaymentCard {
  id: string
  nickname: string       // произвольное название: "Моя Kaspi"
  last4: string          // последние 4 цифры
  brand: CardBrand
  color: string          // hex цвет карточки в UI
  expiryMonth: number
  expiryYear: number
}

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'mir' | 'other'
```

---

## User
```ts
interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  isPro: boolean
  currency: string   // 'USD'
  locale: string     // 'en', 'ru'
}
```

> Загружается через `GET /auth/me`. Хранится в `useAppStore().user`.
> Обновляется через `PATCH /users/me`.

---

## Receipt
```ts
interface Receipt {
  id: string
  subscriptionId: string
  url: string        // DO Spaces URL (signed)
  date: string       // ISO date
  amount: number
}
```

---

## AnalyticsData
```ts
interface AnalyticsData {
  totalMonthly: number
  totalYearly: number
  activeCount: number
  byCategory: { category: Category; amount: number; count: number }[]
  byCard: { cardId: string; card: PaymentCard; amount: number }[]
  monthlyTrend: { month: string; amount: number }[]
  topExpensive: Subscription[]
}
```

`useAnalyticsSummary()` возвращает только `totalMonthly`, `totalYearly`, `activeCount`, `savingsPossible`.

---

## ReportConfig
```ts
interface ReportConfig {
  type: 'summary' | 'detailed' | 'tax'
  startDate: string
  endDate: string
  format: 'pdf' | 'csv'
}
```

## Report (из useReports)
```ts
interface Report {
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

---

## AI Types

### ServiceLookupResult
```ts
interface ServiceLookupResult {
  name: string
  logoUrl?: string
  category: string
  plans: {
    name: string
    amount: number
    currency: string
    billingCycle: string
  }[]
}
```

---

## Billing

```ts
// useBillingMe() response
interface BillingInfo {
  plan: 'free' | 'pro' | 'team'
  currentPeriodEnd?: string
  cancelAtPeriodEnd?: boolean
}
```

---

## Соответствие с бэкендом (TZ данные модели)

| Web тип | Бэкенд поле | Примечание |
|---------|------------|-----------|
| `billingCycle` | `billingPeriod` | бэкенд использует `MONTHLY/YEARLY`, веб использует строки lowercase |
| `plan` | `currentPlan` | переименовано для краткости |
| `category` | `category` (enum) | бэкенд: `STREAMING/AI_SERVICES/INFRASTRUCTURE` → веб: `streaming/ai/infra` |
| `nextPaymentDate` | вычисляется из `billingDay + startDate` | бэкенд возвращает готовую дату |
| `cardId` | `paymentCardId` | переименовано |

> При добавлении нового поля всегда сверяй с бэкенд DTO в `subradar-backend/src/subscriptions/dto/`.
