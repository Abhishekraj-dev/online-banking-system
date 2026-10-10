import type { Metadata } from 'next';
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { auth } from '@/lib/auth/auth';

export const metadata: Metadata = {
  title: 'Customer Dashboard | ApexBank',
  description: 'Manage your high-yield accounts, cards, and money transfers.',
};

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const user = session?.user ?? {
    id: 'demo-customer-id',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'CUSTOMER',
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <CustomerSidebar user={user} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">{children}</main>
    </div>
  );
}
