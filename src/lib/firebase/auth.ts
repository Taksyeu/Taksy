import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

import { auth } from '@/lib/firebase/client';
import { createUserDocument } from '@/lib/firebase/users';
import { UserRole, type User } from '@/types/user';

function requireAuth() {
  if (!auth) throw new Error('Firebase Auth is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return auth;
}

export type RegisterUserInput = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string | null;
};

/**
 * Send a verification email to the given user (or the current authed user).
 */
export async function sendVerificationEmail(user?: FirebaseUser): Promise<void> {
  const a = requireAuth();
  const target = user ?? a.currentUser;
  if (!target) throw new Error('No authenticated user to verify.');
  await sendEmailVerification(target);
}

/**
 * Register a new platform user:
 * - Creates a Firebase Auth user (email+password)
 * - Sends verification email
 * - Creates a Firestore user profile document in `users/{uid}`
 */
export async function registerUser(input: RegisterUserInput): Promise<FirebaseUser> {
  const { email, password, fullName, phoneNumber = null } = input;

  const a = requireAuth();
  const cred = await createUserWithEmailAndPassword(a, email, password);
  const user = cred.user;

  // Fire-and-forget is tempting, but keep it awaited so calling code can show state accurately.
  await sendVerificationEmail(user);

  const userDoc: User = {
    uid: user.uid,
    email: user.email ?? email,
    fullName,
    phoneNumber,
    role: UserRole.RIDER,
    isDriverApproved: false,
    createdAt: Timestamp.now(),
  };

  await createUserDocument(userDoc);

  return user;
}

/**
 * Login with email + password.
 */
export async function loginUser(email: string, password: string): Promise<FirebaseUser> {
  const a = requireAuth();
  const cred = await signInWithEmailAndPassword(a, email, password);
  return cred.user;
}

/**
 * Logout the current user.
 */
export async function logoutUser(): Promise<void> {
  const a = requireAuth();
  await signOut(a);
}
