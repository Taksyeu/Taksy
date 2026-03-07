import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';

type RiderLatestRide = {
  id: string;
  pickupLocation: string;
  destination: string;
  status: string;
};

function requireFirestore() {
  if (!firestore) throw new Error('Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return firestore;
}

export function subscribeToRiderLatestRide(
  riderId: string,
  onData: (ride: RiderLatestRide | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = requireFirestore();

  const q = query(
    collection(db, 'rides'),
    where('riderId', '==', riderId),
    orderBy('createdAt', 'desc'),
    limit(1)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const docSnap = snapshot.docs[0];
      if (!docSnap) {
        onData(null);
        return;
      }

      const data = docSnap.data() as Partial<RiderLatestRide>;
      onData({
        id: docSnap.id,
        pickupLocation: data.pickupLocation ?? '',
        destination: data.destination ?? '',
        status: data.status ?? '',
      });
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error('Failed to subscribe to current ride'));
    }
  );
}

export type { RiderLatestRide };
