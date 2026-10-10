import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLES } from '@/constants/roles';

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // ── NextAuth internal endpoints — always pass through ───────────────────────
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // ── Public routes — always accessible ───────────────────────────────────
  const publicPaths = [
    '/',
    '/about',
    '/services',
    '/contact',
    '/login',
    '/register',
    '/forgot-password',
    '/api/services',
    '/api/users',
  ];
  if (publicPaths.includes(pathname)) {
    // Redirect already-authenticated users away from login/register
    if (session?.user && (pathname === '/login' || pathname === '/register')) {
      const role = (session.user as { role: string }).role;
      const destination = role === ROLES.ADMIN ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // ── Protected routes — require authentication ────────────────────────────
  if (!session?.user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (session.user as { role: string }).role;

  // ── Admin routes — ADMIN only ────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (role !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ── API admin routes — ADMIN only ────────────────────────────────────────
  if (pathname.startsWith('/api/admin')) {
    if (role !== ROLES.ADMIN) {
      return NextResponse.json(
        { success: false, message: 'Access forbidden', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public files (images, robots.txt, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
