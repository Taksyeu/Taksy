import {
  collection,
  onSnapshot,
  query,
  setDoc,
  doc,
  where,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';

export type DriverApplication = {
  uid: string;
  fullName: string;
  email: string;
  createdAt: Timestamp | null;
};

function requireFirestore() {
  if (!firestore) throw new Error('Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return firestore;
}

export function subscribeToDriverApplications(
  onData: (apps: DriverApplication[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = requireFirestore();

  const q = query(collection(db, 'users'), where('role', '==', 'DRIVER_PENDING'));

  return onSnapshot(
    q,
    (snapshot) => {
      const apps: DriverApplication[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Partial<DriverApplication> & { createdAt?: Timestamp | null };
        return {
          uid: docSnap.id,
          fullName: data.fullName ?? '',
          email: data.email ?? '',
          createdAt: data.createdAt ?? null,
        };
      });

      onData(apps);
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error('Failed to subscribe to driver applications'));
    }
  );
}

export async function approveDriver(uid: string): Promise<void> {
  const db = requireFirestore();
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { role: 'DRIVER', isDriverApproved: true }, { merge: true });
}

export async function rejectDriver(uid: string): Promise<void> {
  const db = requireFirestore();
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { role: 'RIDER', isDriverApproved: false }, { merge: true });
}
