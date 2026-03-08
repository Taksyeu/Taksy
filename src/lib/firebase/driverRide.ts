import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';

type DriverCompletedRide = {
  id: string;
  pickupLocation: string;
  destination: string;
  status: string;
  createdAt: Timestamp | null;
};

function requireFirestore() {
  if (!firestore) throw new Error('Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return firestore;
}

export function subscribeToDriverCompletedRides(
  driverId: string,
  onData: (rides: DriverCompletedRide[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = requireFirestore();

  const q = query(
    collection(db, 'rides'),
    where('driverId', '==', driverId),
    where('status', '==', 'COMPLETED'),
    orderBy('createdAt', 'desc'),
    limit(10)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const rides: DriverCompletedRide[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Partial<DriverCompletedRide> & { createdAt?: Timestamp | null };
        return {
          id: docSnap.id,
          pickupLocation: data.pickupLocation ?? '',
          destination: data.destination ?? '',
          status: data.status ?? '',
          createdAt: data.createdAt ?? null,
        };
      });

      onData(rides);
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error('Failed to subscribe to completed rides'));
    }
  );
}

export type { DriverCompletedRide };
