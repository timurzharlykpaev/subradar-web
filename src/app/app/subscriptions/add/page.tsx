'use client';

import { useRouter } from 'next/navigation';
import { AddSubscriptionModal } from '@/components/subscriptions/AddSubscriptionModal';

export default function AddSubscriptionPage() {
  const router = useRouter();

  return (
    <AddSubscriptionModal
      onClose={() => router.push('/app/subscriptions')}
      onSubmit={(data) => {
        console.log('New subscription:', data);
        router.push('/app/subscriptions');
      }}
    />
  );
}
