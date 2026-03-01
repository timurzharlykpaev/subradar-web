import { SubscriptionDetailClient } from '@/components/subscriptions/SubscriptionDetailClient';

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubscriptionDetailClient id={id} />;
}
