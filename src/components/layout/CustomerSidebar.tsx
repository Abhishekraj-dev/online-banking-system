'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Send,
  Settings,
  User,
  LogOut,
  Landmark,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { CUSTOMER_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { User as NextAuthUser } from 'next-auth';

const navItems = [
  { href: CUSTOMER_ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
  { href: CUSTOMER_ROUTES.ACCOUNTS, label: 'Accounts & Cards', icon: CreditCard },
  { href: CUSTOMER_ROUTES.TRANSFER, label: 'Money Transfer', icon: Send },
  { href: CUSTOMER_ROUTES.TRANSACTIONS, label: 'Transaction History', icon: ArrowLeftRight },
  { href: CUSTOMER_ROUTES.SERVICES, label: 'Banking Services', icon: Landmark },
  { href: CUSTOMER_ROUTES.PROFILE, label: 'Profile & Security', icon: User },
];

interface CustomerSidebarProps {
  user: NextAuthUser;
}

export function CustomerSidebar({ user }: CustomerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href={CUSTOMER_ROUTES.DASHBOARD} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Apex<span className="text-blue-400">Bank</span></span>
          </Link>
        </div>

        {/* User Badge */}
        <div className="p-4 mx-3 my-3 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/30">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="overflow-hidden text-xs">
            <p className="font-bold text-white truncate">{user?.name ?? 'Alex Morgan'}</p>
            <p className="text-slate-400 truncate">{user?.email ?? 'alex@example.com'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== CUSTOMER_ROUTES.DASHBOARD && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-slate-400')} />
                  <span>{label}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Sign Out */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4 text-red-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
