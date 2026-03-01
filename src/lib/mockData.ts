import { Subscription, PaymentCard, AnalyticsData } from '@/types';

export const mockCards: PaymentCard[] = [
  { id: '1', nickname: 'Main Card', last4: '4242', brand: 'visa', color: '#7C3AED', expiryMonth: 12, expiryYear: 2027 },
  { id: '2', nickname: 'Business', last4: '5353', brand: 'mastercard', color: '#0EA5E9', expiryMonth: 6, expiryYear: 2026 },
  { id: '3', nickname: 'Savings', last4: '1111', brand: 'amex', color: '#10B981', expiryMonth: 3, expiryYear: 2028 },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: '1', name: 'Netflix', plan: 'Standard 4K', amount: 15.99, currency: 'USD',
    billingCycle: 'monthly', category: 'streaming', status: 'active',
    nextPaymentDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    startDate: '2023-01-01', cardId: '1', card: mockCards[0],
  },
  {
    id: '2', name: 'ChatGPT Plus', plan: 'Pro', amount: 20, currency: 'USD',
    billingCycle: 'monthly', category: 'ai', status: 'active',
    nextPaymentDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    startDate: '2023-06-01', cardId: '2', card: mockCards[1],
  },
  {
    id: '3', name: 'GitHub', plan: 'Teams', amount: 4, currency: 'USD',
    billingCycle: 'monthly', category: 'infra', status: 'active',
    nextPaymentDate: new Date(Date.now() + 8 * 86400000).toISOString(),
    startDate: '2022-05-01', cardId: '1', card: mockCards[0],
  },
  {
    id: '4', name: 'Spotify', plan: 'Premium', amount: 9.99, currency: 'USD',
    billingCycle: 'monthly', category: 'music', status: 'active',
    nextPaymentDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    startDate: '2021-03-01', cardId: '3', card: mockCards[2],
  },
  {
    id: '5', name: 'Vercel', plan: 'Pro', amount: 20, currency: 'USD',
    billingCycle: 'monthly', category: 'infra', status: 'active',
    nextPaymentDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    startDate: '2023-09-01', cardId: '2', card: mockCards[1],
  },
  {
    id: '6', name: 'Adobe CC', plan: 'All Apps', amount: 54.99, currency: 'USD',
    billingCycle: 'monthly', category: 'productivity', status: 'paused',
    nextPaymentDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    startDate: '2020-01-01', cardId: '1', card: mockCards[0],
  },
];

export const mockAnalytics: AnalyticsData = {
  totalMonthly: mockSubscriptions.filter(s => s.status === 'active').reduce((acc, s) => acc + s.amount, 0),
  totalYearly: mockSubscriptions.filter(s => s.status === 'active').reduce((acc, s) => acc + s.amount * 12, 0),
  activeCount: mockSubscriptions.filter(s => s.status === 'active').length,
  byCategory: [
    { category: 'streaming', amount: 15.99, count: 1 },
    { category: 'ai', amount: 20, count: 1 },
    { category: 'infra', amount: 24, count: 2 },
    { category: 'music', amount: 9.99, count: 1 },
  ],
  byCard: [
    { cardId: '1', card: mockCards[0], amount: 20 },
    { cardId: '2', card: mockCards[1], amount: 24 },
    { cardId: '3', card: mockCards[2], amount: 25.98 },
  ],
  monthlyTrend: [
    { month: 'Aug', amount: 58 },
    { month: 'Sep', amount: 62 },
    { month: 'Oct', amount: 65 },
    { month: 'Nov', amount: 70 },
    { month: 'Dec', amount: 69 },
    { month: 'Jan', amount: 74 },
  ],
  topExpensive: mockSubscriptions.sort((a, b) => b.amount - a.amount).slice(0, 5),
};
