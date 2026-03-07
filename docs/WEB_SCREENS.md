# SubRadar AI — Web Screens PRD

## Overview
The web app is a companion to the mobile-first product. It provides the same core functionality adapted for desktop browser experience.

**Stack:** React 18 + Vite + TypeScript, TanStack Query, Zustand, Tailwind CSS, react-i18next (9 languages), recharts.

---

## 1. LoginPage (`/login`)

**Purpose:** Auth entry point for web.

**Elements:**
- Logo + branding
- "Continue with Google" button (useGoogleLogin, access_token flow)
- Magic link email input + send button
- Privacy/Terms links

**States:** default, loading (auth in progress), error (toast)

**Backend:** `POST /auth/google/token`, `POST /auth/magic-link`

---

## 2. LanguageSelectPage (`/language`)

**Purpose:** First-time language selection.

**Elements:** 9 language options (en, ru, es, de, fr, pt, zh, ja, ko), flag icons, selection saves to `subradar-language` localStorage.

**Behavior:** Shows before login if `subradar_lang_chosen` flag not set.

---

## 3. DashboardPage (`/dashboard`)

**Purpose:** Home screen — main value display.

**Blocks:**
1. Total monthly spend (large number)
2. Yearly estimate
3. Delta vs previous month (up/down indicator)
4. Upcoming charges list (next 7 days)
5. Trials ending soon
6. Category breakdown chart (recharts)
7. Spending trend chart
8. Quick actions: Add subscription, Generate report

**States:**
- Empty: "Add your first subscription" CTA
- Partial: simplified view, encourage adding more
- Full: all blocks
- Error: retry + keep quick actions

**Backend:** `GET /analytics/home`, `GET /analytics/upcoming`, `GET /analytics/trials`, `GET /analytics/forecast`

---

## 4. SubscriptionsPage (`/subscriptions`)

**Purpose:** Full subscription list with management.

**Elements:**
- Search field (with voice search button)
- Status filter tabs: All / Active / Trial / Paused / Cancelled
- Category filter
- Sort options: billing date, amount, name, date added
- Subscription cards: icon, name, amount, period, next billing date, status badge, trial badge, card last4

**Actions:** Click card -> detail view, Add button -> add modal

**States:** loading (skeleton), empty (CTA), filtered empty (reset filters), full list

**Backend:** `GET /subscriptions`

---

## 5. AnalyticsPage (`/analytics`)

**Purpose:** Detailed spending analytics.

**Sections:**
1. Monthly total + yearly estimate
2. Category distribution (pie chart)
3. Monthly spending trend (line/bar chart)
4. Most expensive subscriptions
5. Active vs Trial vs Cancelled breakdown
6. Potential savings
7. Card-based breakdown

**Filters:** Date range, category, status

**Backend:** `GET /analytics/home`, `GET /analytics/trends`, `GET /analytics/categories`, `GET /analytics/savings`

---

## 6. ReportsPage (`/reports`)

**Purpose:** Generate and download PDF reports.

**Elements:**
- List of generated reports with status
- Generate button -> type selector (Summary, Detailed, Audit) + period
- Download button for READY reports
- Status indicators: PENDING, GENERATING, READY, FAILED

**Backend:** `GET /reports`, `POST /reports`, `GET /reports/:id/download`

---

## 7. CardsPage (`/cards`)

**Purpose:** Manage payment card metadata.

**Elements:**
- Card list (nickname, brand icon, last4, color indicator, default badge)
- Add card form (nickname, last4, brand, color picker)
- Edit/delete actions
- Show linked subscriptions count per card

**Backend:** `GET /cards`, `POST /cards`, `PATCH /cards/:id`, `DELETE /cards/:id`

---

## 8. SettingsPage (`/settings`)

**Sections:**
1. Profile (name, email)
2. Language / Currency / Timezone
3. Theme (dark/light)
4. Notifications preferences
5. Current plan (Free/Pro/Team) + upgrade CTA
6. Data export
7. Delete account
8. Legal links

---

## 9. MagicLinkPage (`/auth/magic`)

**Purpose:** Handle magic link callback.

**Behavior:** Extract token from URL, verify with backend, redirect to dashboard on success.

**Backend:** `POST /auth/magic-link/verify`

---

## 10. Subscription Detail (modal or side panel)

**Purpose:** View and manage single subscription.

**Sections:** Same as mobile detail screen: main info, billing, trial, card, AI insights, reminders, links, notes/tags.

**Actions:** Edit, Pause, Cancel, Archive.

---

## Web-Specific UX Notes

- Sidebar navigation (AppLayout with Sidebar + TopBar)
- Dark/light theme via ThemeProvider (class on `<html>`)
- Responsive: mobile-friendly but optimized for desktop
- Date inputs: Safari iOS compatibility (`colorScheme: 'dark'`, `minHeight: 44px`)
- All empty states sell the next action (consistent with mobile philosophy)
- Recharts for all charts (not mobile's chart library)
