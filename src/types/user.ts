import type { Timestamp } from 'firebase/firestore';

export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export type User = {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  role: UserRole;
  isDriverApproved: boolean;
  createdAt: Timestamp;
};
