'use client';

import * as React from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

import { auth, firestore } from '@/lib/firebase/client';
import type { User as PlatformUser } from '@/types/user';

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  platformUser: PlatformUser | null;
  loading: boolean;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = React.useState<FirebaseUser | null>(null);
  const [platformUser, setPlatformUser] = React.useState<PlatformUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Firebase is only initialized client-side; if config isn't present, treat as logged out.
    if (!auth) {
      setFirebaseUser(null);
      setPlatformUser(null);
      setLoading(false);
      return;
    }

    let unsubUserDoc: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      setFirebaseUser(user);

      // Stop any previous user doc subscription.
      unsubUserDoc?.();
      unsubUserDoc = null;

      if (!user) {
        setPlatformUser(null);
        setLoading(false);
        return;
      }

      // Subscribe to the platform user doc in real time so role/approval changes apply immediately.
      if (!firestore) {
        setPlatformUser(null);
        setLoading(false);
        return;
      }

      const ref = doc(firestore, 'users', user.uid);
      unsubUserDoc = onSnapshot(
        ref,
        (snap) => {
          setPlatformUser(snap.exists() ? (snap.data() as PlatformUser) : null);
          setLoading(false);
        },
        () => {
          setPlatformUser(null);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubUserDoc?.();
      unsubAuth();
    };
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ firebaseUser, platformUser, loading }),
    [firebaseUser, platformUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
