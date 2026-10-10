import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdminSession, withErrorHandling } from '@/lib/security/permissions';
import { successResponse } from '@/lib/api/api-response';
import { ApiError } from '@/lib/api/api-error';

export const GET = withErrorHandling(async () => {
  await requireAdminSession();

  const settings = await prisma.systemSetting.findMany({
    orderBy: { key: 'asc' },
  });

  return successResponse(settings);
});

export const PUT = withErrorHandling(async (req: NextRequest) => {
  await requireAdminSession();

  const body = await req.json().catch(() => ({}));
  const { settings } = body; // Array of { key: string, value: string }

  if (!Array.isArray(settings)) {
    throw ApiError.badRequest('Expected an array of settings to update');
  }

  const updates = await Promise.all(
    settings.map((s) =>
      prisma.systemSetting.upsert({
        where: { key: s.key },
        update: { value: String(s.value) },
        create: {
          key: s.key,
          value: String(s.value),
          description: s.description || null,
        },
      })
    )
  );

  return successResponse(updates, 'System settings saved successfully');
});
