import prisma from '@/lib/db/prisma';
import { withErrorHandling } from '@/lib/security/permissions';
import { successResponse } from '@/lib/api/api-response';

export const GET = withErrorHandling(async () => {
  const services = await prisma.bankingService.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { name: 'asc' },
  });

  return successResponse(services);
});
