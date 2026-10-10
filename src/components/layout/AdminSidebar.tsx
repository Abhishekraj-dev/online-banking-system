'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Landmark,
  Settings,
  FileBarChart2,
  LogOut,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { ADMIN_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { User as NextAuthUser } from 'next-auth';

const navItems = [
  { href: ADMIN_ROUTES.ROOT, label: 'System Overview', icon: LayoutDashboard, exact: true },
  { href: ADMIN_ROUTES.USERS, label: 'User Management', icon: Users },
  { href: ADMIN_ROUTES.TRANSACTIONS, label: 'Global Audit Ledger', icon: ArrowLeftRight },
  { href: ADMIN_ROUTES.REPORTS, label: 'Financial Analytics', icon: FileBarChart2 },
  { href: ADMIN_ROUTES.SETTINGS, label: 'System Config', icon: Settings },
];

interface AdminSidebarProps {
  user: NextAuthUser;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href={ADMIN_ROUTES.ROOT} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 shadow-md">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold text-white">Apex<span className="text-purple-400">Admin</span></span>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Master Console</p>
            </div>
          </Link>
        </div>

        {/* Admin User Badge */}
        <div className="p-4 mx-3 my-3 rounded-2xl border border-purple-500/30 bg-purple-950/20 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-inner">
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="overflow-hidden text-xs">
            <p className="font-bold text-white truncate">{user?.name ?? 'System Administrator'}</p>
            <p className="text-purple-300 font-mono text-[10px] truncate">{user?.email ?? 'admin@apexbank.com'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150',
                  active
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-4 w-4', active ? 'text-white' : 'text-slate-400')} />
                  <span>{label}</span>
                </div>
                {active && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
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
          End Admin Session
        </button>
      </div>
    </aside>
  );
}
