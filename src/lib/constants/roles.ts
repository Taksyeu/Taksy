export const Roles = {
  RIDER: 'RIDER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
