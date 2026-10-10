import prisma from '@/lib/db/prisma';
import { requireAdminSession, withErrorHandling } from '@/lib/security/permissions';
import { successResponse } from '@/lib/api/api-response';

export const GET = withErrorHandling(async () => {
  await requireAdminSession();

  // Aggregate stats from Neon database
  const [totalUsers, totalAccounts, accountsBalanceAgg, totalTransactions] = await Promise.all([
    prisma.user.count(),
    prisma.account.count(),
    prisma.account.aggregate({
      _sum: {
        balance: true,
      },
      _avg: {
        balance: true,
      },
    }),
    prisma.transaction.count(),
  ]);

  const totalLiquidity = Number(accountsBalanceAgg._sum.balance) || 0;
  const averageBalance = Number(accountsBalanceAgg._avg.balance) || 0;

  return successResponse({
    totalUsers,
    totalAccounts,
    totalLiquidity,
    averageBalance,
    totalTransactions,
  });
});
