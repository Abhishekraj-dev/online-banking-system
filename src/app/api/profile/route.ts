import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireSession, withErrorHandling } from '@/lib/security/permissions';
import { successResponse } from '@/lib/api/api-response';
import { ApiError } from '@/lib/api/api-error';

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatarUrl: true,
      isActive: true,
      createdAt: true,
      accounts: {
        select: {
          id: true,
          accountNumber: true,
          accountType: true,
          balance: true,
          status: true,
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return successResponse(user);
});

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const session = await requireSession();
  const userId = (session.user as { id: string }).id;

  const body = await req.json().catch(() => ({}));
  const { name, phone } = body;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return successResponse(updated, 'Profile updated successfully');
});
