import {
  collection,
  limit,
  onSnapshot,
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

  // Avoid composite index requirement (where + orderBy) by sorting client-side.
  const q = query(collection(db, 'rides'), where('riderId', '==', riderId), limit(25));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData(null);
        return;
      }

      const pickBest = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data() as Partial<RiderLatestRide> & { createdAt?: Timestamp | null };
          return {
            id: docSnap.id,
            pickupLocation: data.pickupLocation ?? '',
            destination: data.destination ?? '',
            status: data.status ?? '',
            createdAt: data.createdAt ?? null,
          };
        })
        .sort((a, b) => {
          const at = a.createdAt?.toMillis?.() ?? 0;
          const bt = b.createdAt?.toMillis?.() ?? 0;
          return bt - at;
        })[0];

      onData(
        pickBest
          ? {
              id: pickBest.id,
              pickupLocation: pickBest.pickupLocation,
              destination: pickBest.destination,
              status: pickBest.status,
            }
          : null
      );
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

  // Avoid composite index requirement (where + orderBy) by sorting client-side.
  const q = query(collection(db, 'rides'), where('riderId', '==', riderId), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const rides: RiderRideHistoryItem[] = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data() as Partial<RiderRideHistoryItem> & { createdAt?: Timestamp | null };
          return {
            id: docSnap.id,
            pickupLocation: data.pickupLocation ?? '',
            destination: data.destination ?? '',
            status: data.status ?? '',
            createdAt: data.createdAt ?? null,
          };
        })
        .sort((a, b) => {
          const at = a.createdAt?.toMillis?.() ?? 0;
          const bt = b.createdAt?.toMillis?.() ?? 0;
          return bt - at;
        })
        .slice(0, 10);

      onData(rides);
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error('Failed to subscribe to ride history'));
    }
  );
}

export type { RiderLatestRide, RiderRideHistoryItem };

