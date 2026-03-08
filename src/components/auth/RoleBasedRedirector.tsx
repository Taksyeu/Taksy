'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

/**
 * Enforces dashboard separation for authenticated users.
 *
 * - Approved DRIVERs should not see customer pages.
 * - RIDERs / pending drivers should not see driver pages.
 * - ADMINs should land on /app/admin.
 */
export function RoleBasedRedirector() {
  const router = useRouter();
  const pathname = usePathname();
  const { firebaseUser, platformUser, loading } = useAuth();

  React.useEffect(() => {
    if (loading) return;
    if (!firebaseUser) return;
    if (!platformUser) return;

    const role = String(platformUser.role ?? '').toUpperCase();
    const isApprovedDriver = role === 'DRIVER' && platformUser.isDriverApproved === true;

    // Admins always go to admin.
    if (role === 'ADMIN') {
      if (pathname !== '/app/admin') router.replace('/app/admin');
      return;
    }

    // Approved drivers should live in /app/driver.
    if (isApprovedDriver) {
      if (pathname.startsWith('/app/customer') || pathname === '/app') {
        router.replace('/app/driver');
      }
      return;
    }

    // Everyone else (RIDER, DRIVER_PENDING, unknown) should live in /app/customer.
    if (pathname.startsWith('/app/driver')) {
      router.replace('/app/customer');
    }
  }, [firebaseUser, loading, pathname, platformUser, router]);

  return null;
}
