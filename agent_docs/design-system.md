# Design System

## Цветовая палитра (CSS-переменные)

Определены в `src/index.css`:

```css
/* Темная тема (default) */
--background:  #080810     /* основной фон */
--foreground:  #f0f0f8     /* основной текст */
--card:        #0f0f1c     /* фон карточек */
--border:      #1e1e30     /* границы */
--muted:       #13131f     /* приглушённый фон */
--muted-foreground: #7070a0 /* приглушённый текст */
--primary:     #7c3aed     /* акцент (фиолетовый) */
--accent:      #10b981     /* вторичный акцент (зелёный) */

/* Светлая тема (.light класс) */
--background:  #f4f4f8
--foreground:  #0f0f13
--card:        #ffffff
--border:      #e2e2ec
--muted:       #f0f0f5
--muted-foreground: #6b6b80
```

### Accent Colors (не переменные, прямые значения)

| Цвет | Hex | Использование |
|------|-----|--------------|
| Purple | `#7c3aed` / `#8b5cf6` | Основной акцент, кнопки, активные состояния |
| Violet | `#4f46e5` | Градиенты с purple |
| Green | `#10b981` | Успех, active status |
| Amber | `#f59e0b` | Предупреждения, upcoming |
| Red | `#ef4444` | Ошибки, overdue, danger zone |
| Blue | `#3b82f6` | Информация, trial status |
| Orange | `#f97316` | Due today индикаторы |

---

## Utility-классы (`src/index.css`)

### Карточки
```css
.glass-card      /* тёмная стеклянная карточка с backdrop-filter */
.stat-card       /* для stat-карточек (с ::before градиентом) */
```

### Типографика
```css
.page-title      /* font-size: 22px, font-weight: 700, letter-spacing: -0.4px */
.page-subtitle   /* font-size: 13px, color: --muted-foreground */
.section-title   /* 13px, uppercase, letter-spacing: 0.06em, color: rgba(255,255,255,0.5) */
.gradient-text   /* фиолетовый градиент на тексте (logo, акценты) */
```

### Анимации
```css
.animate-fade-in   /* fadeIn 0.35s (opacity + translateY) — добавлять на корень страниц */
.animate-slide-in  /* slideIn 0.3s (opacity + translateX) */
.animate-pulse-glow /* пульсирующее box-shadow (фиолетовое) */
```

### Кнопки
```css
.btn-primary    /* bg-purple-600, text-white, rounded-xl, shadow */
.btn-secondary  /* bg-white/6, text-gray-200, border border-white/8 */
.btn-ghost      /* text-gray-400, hover:text-white hover:bg-white/5 */
```

---

## Компоненты UI (`src/components/ui/`)

### `EmptyState`
```tsx
<EmptyState
  illustration="/empty-subscriptions.png"  // путь в /public
  icon={Layers}                            // Lucide иконка (если нет illustration)
  title="Нет подписок"
  description="Добавьте первую подписку"
  action={{ label: '+ Добавить', href: '/app/subscriptions/add' }}
/>
```

### `Skeleton` / `SkeletonCard` / `SkeletonList`
```tsx
<Skeleton className="h-4 w-32" />        // произвольный скелетон
<SkeletonCard />                          // карточка-скелетон (glass-card размер)
<SkeletonList count={4} />               // список скелетонов
```

### `Toast`
```tsx
const { success, error, info } = useToast();
success('Сохранено!');
error('Что-то пошло не так');
```

---

## Компоненты Shared (`src/components/shared/`)

### `CategoryIcon`
```tsx
<CategoryIcon category="streaming" size="sm" />  // sm | md | lg
<CategoryIcon category="ai" size="md" />
```
Размеры: `sm` (28px), `md` (36px), `lg` (44px). Содержит эмодзи + цветной фон.

### `StatusBadge`
```tsx
<StatusBadge status="active" />    // зелёный
<StatusBadge status="paused" />    // жёлтый
<StatusBadge status="trial" />     // синий
<StatusBadge status="cancelled" /> // серый
```

### `CardBrandBadge`
```tsx
<CardBrandBadge brand="visa" last4="4242" />
```

---

## Паттерны компонентов

### Страница (шаблон)
```tsx
export default function XxxPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Заголовок */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Title</h1>
          <p className="page-subtitle">Subtitle</p>
        </div>
        <Link to="..." className="hidden sm:flex btn-primary ...">...</Link>
      </div>

      {/* Контент */}
      <div className="glass-card rounded-2xl p-5">
        <p className="section-title">Section</p>
        {/* ... */}
      </div>
    </div>
  );
}
```

### Stat-карточка
```tsx
<div className="glass-card stat-card rounded-2xl p-4">
  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
       style={{ backgroundColor: 'rgba(139,92,246,0.12)' }}>
    <Icon className="w-4 h-4" style={{ color: '#8b5cf6' }} />
  </div>
  <p className="text-xl font-bold tracking-tight">{value}</p>
  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
</div>
```

---

## Иконки

Все иконки — **Lucide React**. Импорт:
```ts
import { Plus, Search, Settings, Radar } from 'lucide-react';
```

Стандартные размеры:
- Навигация: `w-5 h-5`
- Инлайн в тексте: `w-4 h-4`
- Маленькие (badges, pills): `w-3 h-3`
- FAB: `w-6 h-6`

---

## Responsive

**Breakpoints (Tailwind):**
- `sm`: 640px
- `md`: 768px (основной breakpoint для sidebar/mobile)
- `lg`: 1024px (для grid 2-колонок)
- `xl`: 1280px

**Паттерны:**
```tsx
// Desktop кнопка (скрыта на мобиле)
className="hidden sm:flex ..."

// Grid: 2 колонки → 4 на большом
className="grid grid-cols-2 lg:grid-cols-4 gap-3"

// Sidebar смещение
className="md:ml-64"          // при развёрнутом
className="md:ml-[72px]"      // при свёрнутом
```

---

## Темизация

Тема контролируется через CSS-класс на `<html>`:
- `class="dark"` → тёмная тема (default)
- `class="light"` → светлая тема

Переключение: `useAppStore().toggleTheme()` в AppLayout.

Persistance: `localStorage.getItem('subradar-theme')` читается при инициализации.

---

## Empty State Philosophy

Empty screens must never be "dead." Every empty state must sell the next action:

| Screen | Empty state action |
|--------|-------------------|
| Dashboard | "Add your first subscription" with 3 CTAs (manual, AI, photo) |
| Subscriptions | "No subscriptions yet" + Add button |
| Analytics | "Add subscriptions to see analytics" |
| Reports | "Generate your first report" |
| Cards | "Add a payment card" |

Use the `EmptyState` component with: illustration/icon, title, description, action button.

See `docs/STATE_RULES.md` for full state handling rules across all screens.
