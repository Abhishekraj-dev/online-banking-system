import { type Role } from '@/constants/roles';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

/** Safe public-facing user (never includes passwordHash) */
export type PublicUser = Omit<IUser, never>;
