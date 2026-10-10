import prisma from '@/lib/db/prisma';
import { requireAdminSession, withErrorHandling } from '@/lib/security/permissions';
import { successResponse } from '@/lib/api/api-response';

export const GET = withErrorHandling(async () => {
  await requireAdminSession();

  const transactions = await prisma.transaction.findMany({
    include: {
      senderAccount: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      receiverAccount: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      createdBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return successResponse(transactions);
});
