'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, ArrowRight, Lock } from 'lucide-react';
import { PUBLIC_ROUTES } from '@/constants/routes';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: PUBLIC_ROUTES.HOME },
    { name: 'Services', href: PUBLIC_ROUTES.SERVICES },
    { name: 'About Us', href: PUBLIC_ROUTES.ABOUT },
    { name: 'Contact', href: PUBLIC_ROUTES.CONTACT },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href={PUBLIC_ROUTES.HOME} className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">Apex<span className="text-blue-400">Bank</span></span>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              256-BIT ENCRYPTED
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-200 relative py-1 ${
                  isActive
                    ? 'text-blue-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={PUBLIC_ROUTES.LOGIN}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
          >
            <Lock className="h-4 w-4 text-blue-400" />
            Online Banking
          </Link>
          <Link
            href={PUBLIC_ROUTES.REGISTER}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-600/30"
          >
            Open Account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-white py-1"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href={PUBLIC_ROUTES.LOGIN}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 border border-slate-700 bg-slate-900"
            >
              Online Banking Login
            </Link>
            <Link
              href={PUBLIC_ROUTES.REGISTER}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-blue-600"
            >
              Open New Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
