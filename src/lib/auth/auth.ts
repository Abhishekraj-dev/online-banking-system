import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/lib/validation/common';
import { ROLES } from '@/constants/roles';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const res = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: parsed.data.email,
              password: parsed.data.password,
            }),
          });

          if (!res.ok) return null;

          const json = await res.json();
          if (json.success && json.data) {
            return {
              id: json.data.id,
              email: json.data.email,
              name: json.data.name,
              role: json.data.role,
            };
          }
        } catch (error) {
          console.error("Auth fetch error:", error);
          return null;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.AUTH_SECRET,
});

export const isAdmin = async () => {
  const session = await auth();
  return session?.user && (session.user as unknown as { role: string }).role === ROLES.ADMIN;
};

export const isCustomer = async () => {
  const session = await auth();
  return session?.user && (session.user as unknown as { role: string }).role === ROLES.CUSTOMER;
};

export const requireAuth = async () => {
  const session = await auth();
  if (!session?.user) throw new Error('UNAUTHORIZED');
  return session;
};

export const requireAdmin = async () => {
  const session = await requireAuth();
  if ((session.user as unknown as { role: string }).role !== ROLES.ADMIN) throw new Error('FORBIDDEN');
  return session;
};
