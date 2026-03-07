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

type RiderLatestRide = {
  id: string;
  pickupLocation: string;
  destination: string;
  status: string;
};

type RiderRideHistoryItem = {
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

export function subscribeToRiderRideHistory(
  riderId: string,
  onData: (rides: RiderRideHistoryItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = requireFirestore();

  const q = query(
    collection(db, 'rides'),
    where('riderId', '==', riderId),
    orderBy('createdAt', 'desc'),
    limit(10)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const rides: RiderRideHistoryItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Partial<RiderRideHistoryItem> & { createdAt?: Timestamp | null };
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
      onError?.(err instanceof Error ? err : new Error('Failed to subscribe to ride history'));
    }
  );
}

export type { RiderLatestRide, RiderRideHistoryItem };

