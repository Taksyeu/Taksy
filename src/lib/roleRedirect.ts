import { UserRole } from '@/types/user';

/**
 * Returns the default landing route for a given user role.
 *
 * Be tolerant of Firestore returning raw strings (or older values) so redirects don't break.
 */
export function getRoleHomePath(role: UserRole | string | null | undefined): string {
  const r = String(role ?? '').toUpperCase();

  switch (r) {
    case UserRole.RIDER:
      return '/app/customer';
    case UserRole.DRIVER:
      return '/app/driver';
    case UserRole.ADMIN:
      return '/app/admin';
    // Pending drivers should still live in the customer area until approved.
    case 'DRIVER_PENDING':
      return '/app/customer';
    default:
      return '/app';
  }
}
