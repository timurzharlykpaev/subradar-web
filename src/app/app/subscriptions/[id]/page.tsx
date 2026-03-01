import { mockSubscriptions } from '@/lib/mockData';
import { SubscriptionDetailClient } from '@/components/subscriptions/SubscriptionDetailClient';

export function generateStaticParams() {
  return mockSubscriptions.map((s) => ({ id: s.id }));
}

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubscriptionDetailClient id={id} />;
}
