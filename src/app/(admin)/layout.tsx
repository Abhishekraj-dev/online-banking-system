import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { auth } from '@/lib/auth/auth';

export const metadata: Metadata = {
  title: 'Admin Master Console | ApexBank',
  description: 'Manage users, audit global transaction volume, and configure system risk parameters.',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const user = session?.user ?? {
    id: 'demo-admin-id',
    name: 'System Administrator',
    email: 'admin@apexbank.com',
    role: 'ADMIN',
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">{children}</main>
    </div>
  );
}
