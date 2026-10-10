export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'BILL_PAYMENT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface ITransaction {
  id: string;
  reference: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description?: string | null;
  senderAccountId?: string | null;
  receiverAccountId?: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionInput {
  senderAccountId?: string;
  receiverAccountId?: string;
  type: TransactionType;
  amount: number;
  currency?: string;
  description?: string;
}
