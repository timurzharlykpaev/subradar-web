'use client';

import { useRouter } from 'next/navigation';
import { AddSubscriptionModal } from '@/components/subscriptions/AddSubscriptionModal';

export default function AddSubscriptionPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-xl mx-auto">
      <AddSubscriptionModal
        onClose={() => router.push('/app/subscriptions')}
        onSubmit={(data) => {
          console.log('New subscription:', data);
          router.push('/app/subscriptions');
        }}
      />
    </div>
  );
}
