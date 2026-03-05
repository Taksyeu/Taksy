import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';
import type { User, UserRole } from '@/types/user';

const usersCollection = 'users' as const;

/**
 * Creates/overwrites a platform user document.
 *
 * Collection: users
 * Doc ID: uid
 */
export async function createUserDocument(user: User): Promise<void> {
  const ref = doc(firestore, usersCollection, user.uid);
  await setDoc(ref, user, { merge: false });
}

/**
 * Fetch a user document by uid.
 */
export async function getUserById(uid: string): Promise<User | null> {
  const ref = doc(firestore, usersCollection, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as User;
}

/**
 * Update only the user's role.
 */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  const ref = doc(firestore, usersCollection, uid);
  await updateDoc(ref, { role });
}
