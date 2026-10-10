import { PrismaClient, Role, AccountType, AccountStatus, TransactionType, TransactionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding PostgreSQL database for Online Banking System...');

  // 1. Clean existing records
  await prisma.transaction.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.bankingService.deleteMany({});
  await prisma.systemSetting.deleteMany({});

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // 2. Create Admin User
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@apexbank.com',
      passwordHash,
      role: Role.ADMIN,
      phone: '+1 (555) 019-2834',
    },
  });

  // 3. Create Customer User
  const customer = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      passwordHash,
      role: Role.CUSTOMER,
      phone: '+1 (555) 234-5678',
    },
  });

  // 4. Create Accounts for Customer
  const checkingAccount = await prisma.account.create({
    data: {
      accountNumber: 'ACC-88219401',
      accountType: AccountType.CHECKING,
      balance: 14850.75,
      currency: 'USD',
      status: AccountStatus.ACTIVE,
      userId: customer.id,
    },
  });

  const savingsAccount = await prisma.account.create({
    data: {
      accountNumber: 'ACC-44910283',
      accountType: AccountType.SAVINGS,
      balance: 42500.00,
      currency: 'USD',
      status: AccountStatus.ACTIVE,
      userId: customer.id,
    },
  });

  // 5. Create Sample Transactions
  await prisma.transaction.createMany({
    data: [
      {
        reference: 'TXN-994101',
        type: TransactionType.DEPOSIT,
        amount: 5000.00,
        currency: 'USD',
        status: TransactionStatus.COMPLETED,
        description: 'Direct Deposit - Salary Corp Inc.',
        receiverAccountId: checkingAccount.id,
        createdById: customer.id,
      },
      {
        reference: 'TXN-994102',
        type: TransactionType.TRANSFER,
        amount: 1200.00,
        currency: 'USD',
        status: TransactionStatus.COMPLETED,
        description: 'Transfer to High-Yield Savings Account',
        senderAccountId: checkingAccount.id,
        receiverAccountId: savingsAccount.id,
        createdById: customer.id,
      },
      {
        reference: 'TXN-994103',
        type: TransactionType.BILL_PAYMENT,
        amount: 145.20,
        currency: 'USD',
        status: TransactionStatus.COMPLETED,
        description: 'Monthly Utility Payment - Power Grid Co',
        senderAccountId: checkingAccount.id,
        createdById: customer.id,
      },
    ],
  });

  // 6. Create Banking Services
  await prisma.bankingService.createMany({
    data: [
      {
        name: 'High-Yield Savings Account',
        code: 'SVC-HYS',
        description: 'Earn 4.5% APY with zero monthly maintenance fees.',
        category: 'ACCOUNTS',
        fee: 0.00,
      },
      {
        name: 'International Wire Transfer',
        code: 'SVC-IWT',
        description: 'Fast, secure cross-border payments to over 140 countries.',
        category: 'TRANSFERS',
        fee: 15.00,
      },
      {
        name: 'Platinum Cash Back Credit Card',
        code: 'SVC-CC-PLAT',
        description: '3% cash back on travel, dining, and online transactions.',
        category: 'CARDS',
        fee: 0.00,
      },
    ],
  });

  // 7. Create System Settings
  await prisma.systemSetting.createMany({
    data: [
      {
        key: 'DAILY_TRANSFER_LIMIT',
        value: '10000',
        description: 'Maximum daily outbound transfer limit per customer (USD)',
        category: 'LIMITS',
        isPublic: true,
      },
      {
        key: 'MAINTENANCE_MODE',
        value: 'false',
        description: 'System-wide maintenance window lock',
        category: 'SYSTEM',
        isPublic: true,
      },
    ],
  });

  console.log('✅ PostgreSQL database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
