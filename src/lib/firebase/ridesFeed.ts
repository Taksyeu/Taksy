import {
  collection,
  limit,
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

export function subscribeToDriverAssignedRides(
  driverId: string,
  onData: (rides: RideRequest[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = requireFirestore();

  const q = query(
    collection(db, 'rides'),
    where('assignedDriverId', '==', driverId),
    where('status', '==', 'ASSIGNED'),
    limit(10)
  );

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
      onError?.(err instanceof Error ? err : new Error('Failed to subscribe to assigned rides'));
    }
  );
}

export function subscribeToDriverActiveRide(
  driverId: string,
  onData: (ride: RideRequest | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = requireFirestore();

  const q = query(
    collection(db, 'rides'),
    where('driverId', '==', driverId),
    where('status', 'in', ['ACCEPTED', 'DRIVER_ARRIVING', 'IN_PROGRESS']),
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

      const data = docSnap.data() as Partial<RideRequest>;
      onData({
        id: docSnap.id,
        pickupLocation: data.pickupLocation ?? '',
        destination: data.destination ?? '',
        status: data.status ?? '',
      });
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error('Failed to subscribe to active ride'));
    }
  );
}

export type { RideRequest };

