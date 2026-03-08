import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';

function requireFirestore() {
  if (!firestore) throw new Error('Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return firestore;
}

export async function upsertDriverLocation(uid: string, lat: number, lng: number): Promise<void> {
  const db = requireFirestore();
  const ref = doc(db, 'drivers', uid);

  await setDoc(
    ref,
    {
      lat,
      lng,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
