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

export type CardBrand = 'VISA' | 'MC' | 'AMEX' | 'MIR' | 'OTHER';
export type SourceType = 'MANUAL' | 'AI_VOICE' | 'AI_SCREENSHOT' | 'AI_TEXT';
export type ReportType = 'SUMMARY' | 'DETAILED' | 'AUDIT' | 'TAX';
export type ReportStatus = 'PENDING' | 'GENERATING' | 'READY' | 'FAILED';

export interface PaymentCard {
  id: string;
  nickname: string;
  last4: string;
  brand: CardBrand;
  color: string;
  isDefault: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  currentPlan?: string;
  amount: number;
  currency: string;
  billingPeriod: BillingCycle;
  billingDay?: number;
  category: Category;
  status: SubscriptionStatus;
  nextPaymentDate?: string;
  startDate?: string;
  cancelledAt?: string;
  paymentCardId?: string;
  paymentCard?: PaymentCard;
  iconUrl?: string;
  serviceUrl?: string;
  cancelUrl?: string;
  managePlanUrl?: string;
  notes?: string;
  tags?: string[];
  reminderEnabled?: boolean;
  reminderDaysBefore?: number[];
  isBusinessExpense?: boolean;
  taxCategory?: string;
  addedVia?: SourceType;
  aiMetadata?: Record<string, unknown>;
  aiConfidence?: number;
  availablePlans?: { name: string; amount: number; currency: string; billingCycle: BillingCycle }[];
  receipts?: Receipt[];
  trialEndDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Receipt {
  id: string;
  subscriptionId: string;
  fileUrl: string;
  uploadedAt: string;
  aiExtracted?: Record<string, unknown>;
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
  timezone?: string;
  dateFormat?: string;
  country?: string;
  onboardingCompleted?: boolean;
  notificationsEnabled?: boolean;
}

export interface BillingInfo {
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'cancelled' | 'trialing';
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  trialUsed: boolean;
  trialDaysLeft?: number | null;
  subscriptionCount: number;
  subscriptionLimit: number | null;
  aiRequestsUsed: number;
  aiRequestsLimit: number | null;
  reportsUsed?: number;
  reportsLimit?: number | null;
  proInviteeEmail?: string | null;
}

export interface ReportConfig {
  type: ReportType;
  period: string;
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
