import {
  collection,
  onSnapshot,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';

type RideRequest = {
  id: string;
  pickupLocation: string;
  destination: string;
  status: string;
};

function requireFirestore() {
  if (!firestore) throw new Error('Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return firestore;
}

export function subscribeToRequestedRides(
  onData: (rides: RideRequest[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = requireFirestore();

  const q = query(collection(db, 'rides'), where('status', '==', 'REQUESTED'));

  return onSnapshot(
    q,
    (snapshot) => {
      const rides: RideRequest[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Partial<RideRequest>;
        return {
          id: doc.id,
          pickupLocation: data.pickupLocation ?? '',
          destination: data.destination ?? '',
          status: data.status ?? '',
        };
      });

      onData(rides);
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error('Failed to subscribe to rides'));
    }
  );
}

export type { RideRequest };
