export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'TRIAL';
export type BillingCycle = 'MONTHLY' | 'YEARLY' | 'WEEKLY' | 'QUARTERLY' | 'LIFETIME' | 'ONE_TIME';
export type Category =
  | 'STREAMING'
  | 'AI_SERVICES'
  | 'INFRASTRUCTURE'
  | 'MUSIC'
  | 'GAMING'
  | 'PRODUCTIVITY'
  | 'HEALTH'
  | 'NEWS'
  | 'OTHER';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'mir' | 'other';

export interface PaymentCard {
  id: string;
  nickname: string;
  last4: string;
  brand: CardBrand;
  color: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface Subscription {
  id: string;
  name: string;
  currentPlan?: string;
  amount: number;
  currency: string;
  billingPeriod: BillingCycle;
  category: Category;
  status: SubscriptionStatus;
  nextPaymentDate?: string;
  startDate?: string;
  paymentCardId?: string;
  paymentCard?: PaymentCard;
  iconUrl?: string;
  notes?: string;
  receipts?: Receipt[];
}

export interface Receipt {
  id: string;
  subscriptionId: string;
  url: string;
  date: string;
  amount: number;
}

export interface AnalyticsData {
  totalMonthly: number;
  totalYearly: number;
  activeCount: number;
  byCategory: { category: Category; amount: number; count: number }[];
  byCard: { cardId: string; card: PaymentCard; amount: number }[];
  monthlyTrend: { month: string; amount: number }[];
  topExpensive: Subscription[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isPro: boolean;
  currency: string;
  locale: string;
}

export interface BillingInfo {
  plan: 'free' | 'pro' | 'organization';
  status: 'active' | 'cancelled' | 'trialing';
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  trialUsed: boolean;
  trialDaysLeft?: number | null;
  subscriptionCount: number;
  subscriptionLimit: number | null;
  aiRequestsUsed: number;
  aiRequestsLimit: number | null;
  proInviteeEmail?: string | null;
}

export interface ReportConfig {
  type: 'summary' | 'detailed' | 'tax';
  startDate: string;
  endDate: string;
  format: 'pdf' | 'csv';
}

export type WorkspaceMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type WorkspaceMemberStatus = 'PENDING' | 'ACTIVE';

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId?: string;
  role: WorkspaceMemberRole;
  inviteEmail?: string;
  status: WorkspaceMemberStatus;
  joinedAt: string;
  user?: Pick<User, 'id' | 'name' | 'email' | 'avatarUrl'>;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  plan: string;
  maxMembers: number;
  members: WorkspaceMember[];
  createdAt: string;
}
