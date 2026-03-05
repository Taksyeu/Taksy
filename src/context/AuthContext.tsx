'use client';

import * as React from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/lib/firebase/client';
import { getUserById } from '@/lib/firebase/users';
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

    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setFirebaseUser(user);

      if (!user) {
        setPlatformUser(null);
        setLoading(false);
        return;
      }

      try {
        const doc = await getUserById(user.uid);
        setPlatformUser(doc);
      } catch {
        // Keep platformUser null if Firestore fetch fails.
        setPlatformUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
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
