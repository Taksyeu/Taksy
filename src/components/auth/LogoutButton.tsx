'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { logoutUser } from '@/lib/firebase/auth';

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function onLogout() {
    if (pending) return;
    setPending(true);
    try {
      await logoutUser();
    } finally {
      // Always send the user to login; ProtectedRoute will also enforce auth state.
      router.replace('/app/login');
      router.refresh();
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={pending}
      className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Logging out…' : 'Logout'}
    </button>
  );
}
