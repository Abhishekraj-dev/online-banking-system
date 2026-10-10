import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdminSession, withErrorHandling } from '@/lib/security/permissions';
import { successResponse } from '@/lib/api/api-response';
import { ApiError } from '@/lib/api/api-error';

export const GET = withErrorHandling(async () => {
  await requireAdminSession();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      createdAt: true,
      accounts: {
        select: {
          id: true,
          accountNumber: true,
          balance: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatted = users.map((u) => {
    const totalBalance = u.accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.isActive ? 'ACTIVE' : 'FROZEN',
      balance: totalBalance,
      joined: u.createdAt,
      accountCount: u.accounts.length,
    };
  });

  return successResponse(formatted);
});

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  await requireAdminSession();

  const body = await req.json().catch(() => ({}));
  const { userId, status } = body;

  if (!userId) {
    throw ApiError.badRequest('User ID is required');
  }

  const isActive = status === 'ACTIVE';

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      role: true,
    },
  });

  return successResponse(updated, `User status updated to ${isActive ? 'ACTIVE' : 'FROZEN'}`);
});
