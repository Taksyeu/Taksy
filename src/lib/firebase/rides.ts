import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';

const ridesCollection = 'rides' as const;

type CreateRideRequestInput = {
  riderId: string;
  pickupLocation: string;
  destination: string;
};

function requireFirestore() {
  if (!firestore) throw new Error('Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return firestore;
}

export async function createRideRequest(input: CreateRideRequestInput): Promise<string> {
  const db = requireFirestore();

  const ref = await addDoc(collection(db, ridesCollection), {
    riderId: input.riderId,
    pickupLocation: input.pickupLocation,
    destination: input.destination,
    status: 'REQUESTED',
    createdAt: serverTimestamp(),
  });

  return ref.id;
}
