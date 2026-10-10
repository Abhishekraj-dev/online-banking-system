import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { hashPassword } from '@/lib/security/password';
import { withErrorHandling } from '@/lib/security/permissions';
import { createdResponse } from '@/lib/api/api-response';
import { ApiError } from '@/lib/api/api-error';
import { registerSchema } from '@/lib/validation/common';
import { Role, AccountType } from '@prisma/client';

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}));
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw ApiError.badRequest(parsed.error.issues[0]?.message || 'Invalid registration data');
  }

  const { name, email, password, phone } = parsed.data;

  // Check if email is already taken
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw ApiError.conflict('An account with this email address already exists');
  }

  const passwordHash = await hashPassword(password);

  // Create user and initial checking account inside a single transaction
  const result = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.CUSTOMER,
        phone: phone || null,
        isActive: true,
      },
    });

    // Create default Primary Checking Account
    const accountNumber = `ACC-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newAccount = await tx.account.create({
      data: {
        accountNumber,
        accountType: AccountType.CHECKING,
        balance: 1000.00, // $1,000 welcome bonus deposit
        currency: 'USD',
        status: 'ACTIVE',
        userId: newUser.id,
      },
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      account: {
        id: newAccount.id,
        accountNumber: newAccount.accountNumber,
        balance: newAccount.balance,
      },
    };
  });

  return createdResponse(result, 'Registration successful. Account created!');
});
