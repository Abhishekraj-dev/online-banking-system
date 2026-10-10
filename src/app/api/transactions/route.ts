import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireSession, withErrorHandling } from '@/lib/security/permissions';
import { successResponse, createdResponse } from '@/lib/api/api-response';
import { ApiError } from '@/lib/api/api-error';
import { ROLES } from '@/constants/roles';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { transferSchema } from '@/lib/validation/common';

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  let transactions;
  if (role === ROLES.ADMIN) {
    transactions = await prisma.transaction.findMany({
      include: {
        senderAccount: true,
        receiverAccount: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } else {
    // Get all user accounts
    const userAccounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((a) => a.id);

    transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderAccountId: { in: accountIds } },
          { receiverAccountId: { in: accountIds } },
          { createdById: userId },
        ],
      },
      include: {
        senderAccount: true,
        receiverAccount: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  return successResponse(transactions);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const session = await requireSession();
  const userId = (session.user as { id: string }).id;

  const raw = await req.json().catch(() => ({}));
  const parsed = transferSchema.safeParse(raw);
  if (!parsed.success) {
    throw ApiError.badRequest(parsed.error.issues[0]?.message || 'Invalid transfer parameters');
  }

  const { fromAccountId, toRecipient, amount, description, type } = parsed.data;

  // 1. Verify sender account belongs to current user
  const senderAccount = await prisma.account.findFirst({
    where: {
      id: fromAccountId,
      userId,
    },
  });

  if (!senderAccount) {
    throw ApiError.notFound('Sender account not found or access denied');
  }

  if (senderAccount.status !== 'ACTIVE') {
    throw ApiError.badRequest('Sender account is currently frozen or inactive');
  }

  if (Number(senderAccount.balance) < amount) {
    throw ApiError.badRequest(`Insufficient funds. Current balance: $${Number(senderAccount.balance).toFixed(2)}`);
  }

  // 2. Check destination account (by ID, AccountNumber, or User Email)
  const trimmed = toRecipient.trim();
  let receiverAccount = await prisma.account.findFirst({
    where: {
      OR: [
        { id: trimmed },
        { accountNumber: trimmed },
        { user: { email: { equals: trimmed, mode: 'insensitive' } } },
      ],
    },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  // If not found, attempt extracting digits if user entered IBAN format like US89 APEX ...
  if (!receiverAccount) {
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length >= 8) {
      receiverAccount = await prisma.account.findFirst({
        where: { accountNumber: `ACC-${digitsOnly.slice(-8)}` },
        include: {
          user: { select: { name: true, email: true } },
        },
      });
    }
  }

  // Prevent sending to the exact same account
  if (receiverAccount && receiverAccount.id === senderAccount.id) {
    throw ApiError.badRequest('Cannot transfer funds to the exact same account');
  }

  // 3. Generate unique transaction reference
  const reference = `TXN-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

  // 4. Atomic Transaction execution via Prisma $transaction
  const result = await prisma.$transaction(async (tx) => {
    // Deduct from sender
    await tx.account.update({
      where: { id: senderAccount.id },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // If destination account exists in our system, credit it
    if (receiverAccount) {
      await tx.account.update({
        where: { id: receiverAccount.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    }

    // Record ledger entry
    const txn = await tx.transaction.create({
      data: {
        reference,
        type: type === 'BILL_PAYMENT' ? TransactionType.BILL_PAYMENT : TransactionType.TRANSFER,
        amount,
        currency: senderAccount.currency,
        status: TransactionStatus.COMPLETED,
        description: description || (receiverAccount ? `Transfer to ${receiverAccount.accountNumber}` : `External Wire to ${toRecipient}`),
        senderAccountId: senderAccount.id,
        receiverAccountId: receiverAccount?.id || null,
        createdById: userId,
      },
    });

    return txn;
  });

  return createdResponse(result, 'Transfer processed and settled successfully');
});
