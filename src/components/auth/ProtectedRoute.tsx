'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { firebaseUser, loading } = useAuth();

  React.useEffect(() => {
    if (loading) return;
    if (!firebaseUser) router.replace('/app/login');
  }, [firebaseUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-neutral-950 text-neutral-50">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-sm text-white/70">Loading…</div>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    // Redirect is triggered in the effect; render nothing to avoid flashing protected UI.
    return null;
  }

  return <>{children}</>;
}
