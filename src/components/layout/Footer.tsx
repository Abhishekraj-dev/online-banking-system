import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, Lock, Award, HeartHandshake } from 'lucide-react';
import { PUBLIC_ROUTES } from '@/constants/routes';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Top Banner: Security Assurance */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">FDIC Insured up to $250,000</h4>
              <p className="text-xs text-slate-400">Your deposits are protected by federal insurance.</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">256-Bit SSL Encryption</h4>
              <p className="text-xs text-slate-400">Bank-grade security protocols for all transactions.</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Award-Winning 24/7 Support</h4>
              <p className="text-xs text-slate-400">Dedicated fraud monitoring & customer assistance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Description */}
        <div className="lg:col-span-2 space-y-4">
          <Link href={PUBLIC_ROUTES.HOME} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Apex<span className="text-blue-400">Bank</span></span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed pr-6">
            ApexBank is a modern digital financial institution providing high-yield savings, zero-fee checking accounts, instant global wire transfers, and commercial lending solutions.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">Equal Housing Lender</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">Member FDIC</span>
          </div>
        </div>

        {/* Banking Products */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Banking</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href={PUBLIC_ROUTES.SERVICES} className="hover:text-blue-400 transition-colors">Checking Accounts</Link></li>
            <li><Link href={PUBLIC_ROUTES.SERVICES} className="hover:text-blue-400 transition-colors">High-Yield Savings</Link></li>
            <li><Link href={PUBLIC_ROUTES.SERVICES} className="hover:text-blue-400 transition-colors">Certificate of Deposit</Link></li>
            <li><Link href={PUBLIC_ROUTES.SERVICES} className="hover:text-blue-400 transition-colors">Personal Loans</Link></li>
            <li><Link href={PUBLIC_ROUTES.SERVICES} className="hover:text-blue-400 transition-colors">Credit Cards</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href={PUBLIC_ROUTES.ABOUT} className="hover:text-blue-400 transition-colors">About ApexBank</Link></li>
            <li><Link href={PUBLIC_ROUTES.CONTACT} className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
            <li><Link href={PUBLIC_ROUTES.LOGIN} className="hover:text-blue-400 transition-colors">Online Portal</Link></li>
            <li><Link href={PUBLIC_ROUTES.REGISTER} className="hover:text-blue-400 transition-colors">Open Account</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Direct Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-blue-400" />
              <span>1-800-555-APEX (2739)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-blue-400" />
              <span>support@apexbank.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-blue-400 mt-0.5" />
              <span>100 Financial Plaza, Wall St, New York, NY 10005</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {year} ApexBank N.A. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Security Terms</span>
            <span className="hover:underline cursor-pointer">Accessibility</span>
            <span className="hover:underline cursor-pointer">Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
