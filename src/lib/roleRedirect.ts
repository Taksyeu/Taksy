import { UserRole } from '@/types/user';

export function getRoleHomePath(role: UserRole | null | undefined): string {
  switch (role) {
    case UserRole.RIDER:
      return '/app/customer';
    case UserRole.DRIVER:
      return '/app/driver';
    case UserRole.ADMIN:
      return '/app/admin';
    default:
      return '/app';
  }
}
