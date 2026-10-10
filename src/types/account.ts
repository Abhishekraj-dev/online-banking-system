export type AccountType = 'SAVINGS' | 'CHECKING' | 'BUSINESS' | 'LOAN';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';

export interface IAccount {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountInput {
  userId: string;
  accountType: AccountType;
  initialDeposit?: number;
  currency?: string;
}
