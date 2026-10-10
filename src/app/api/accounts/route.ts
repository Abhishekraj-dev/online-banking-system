import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireSession, withErrorHandling } from '@/lib/security/permissions';
import { successResponse, createdResponse } from '@/lib/api/api-response';
import { ApiError } from '@/lib/api/api-error';
import { ROLES } from '@/constants/roles';
import { AccountType } from '@prisma/client';

export const GET = withErrorHandling(async (req: NextRequest) => {
  const session = await requireSession();
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get('scope');

  // If requesting other recipient accounts across ApexBank
  if (scope === 'recipients') {
    const recipients = await prisma.account.findMany({
      where: {
        userId: { not: userId },
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(recipients);
  }

  // Admins can see all accounts, customers see their own
  const accounts = await prisma.account.findMany({
    where: role === ROLES.ADMIN ? {} : { userId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return successResponse(accounts);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const session = await requireSession();
  const userId = (session.user as { id: string }).id;

  const body = await req.json().catch(() => ({}));
  const accountType: AccountType = body.accountType || AccountType.CHECKING;
  const initialDeposit = Number(body.initialDeposit) || 0;

  // Generate random 8-digit account number
  const accountNumber = `ACC-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const account = await prisma.account.create({
    data: {
      accountNumber,
      accountType,
      balance: initialDeposit,
      currency: body.currency || 'USD',
      status: 'ACTIVE',
      userId,
    },
  });

  return createdResponse(account, 'Bank account created successfully');
});
