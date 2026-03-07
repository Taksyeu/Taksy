import { doc, updateDoc } from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';

function requireFirestore() {
  if (!firestore) throw new Error('Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return firestore;
}

export async function acceptRide(rideId: string, driverId: string): Promise<void> {
  const db = requireFirestore();
  const ref = doc(db, 'rides', rideId);

  await updateDoc(ref, {
    status: 'ACCEPTED',
    driverId,
  });
}
