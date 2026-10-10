import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/lib/validation/common';
import prisma from '@/lib/db/prisma';
import { verifyPassword } from '@/lib/security/password';
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

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.isActive) return null;

        const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
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
