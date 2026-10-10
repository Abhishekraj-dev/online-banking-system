import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { ROLES } from '@/constants/roles';
import { ApiError } from '@/lib/api/api-error';

/**
 * Verify the current request is authenticated.
 * Returns the session or throws an ApiError.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new ApiError('Authentication required', 401, 'UNAUTHORIZED');
  }
  return session;
}

/**
 * Verify the current request is authenticated AND the user is an ADMIN.
 */
export async function requireAdminSession() {
  const session = await requireSession();
  const role = (session.user as { role: string }).role;
  if (role !== ROLES.ADMIN) {
    throw new ApiError('Access forbidden', 403, 'FORBIDDEN');
  }
  return session;
}

/**
 * Verify that the authenticated user owns the requested resource by userId.
 * Admins always pass this check.
 */
export async function requireOwnership(resourceUserId: string) {
  const session = await requireSession();
  const role = (session.user as { role: string }).role;
  const userId = (session.user as { id: string }).id;

  if (role === ROLES.ADMIN) return session; // Admins can access all

  if (userId !== resourceUserId) {
    throw new ApiError('Access forbidden', 403, 'FORBIDDEN');
  }
  return session;
}

/**
 * Wrap a route handler with error handling so ApiErrors become proper JSON responses.
 */
export function withErrorHandling<T extends Request = Request>(
  handler: (req: T) => Promise<NextResponse>
) {
  return async (req: T): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: err.message, code: err.code },
          { status: err.statusCode }
        );
      }
      console.error('[Unhandled error]', err);
      return NextResponse.json(
        { success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  };
}

