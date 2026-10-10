import { type Role } from '@/constants/roles';

// ─── Session / Auth ───────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  image?: string | null;
}

export interface AuthSession {
  user: SessionUser;
  expires: string;
}

// ─── JWT Token ────────────────────────────────────────────────────────────────

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
  iat?: number;
  exp?: number;
}
