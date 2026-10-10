import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Building2, Users, Award, Lock, Globe } from 'lucide-react';
import { PUBLIC_ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'About Us | ApexBank',
  description: 'Learn about ApexBank mission, security standards, and financial leadership.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
            <Building2 className="h-3.5 w-3.5" />
            <span>Our Financial Heritage</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Redefining Digital Banking <br />
            <span className="text-blue-400">With Institutional Trust</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Founded with a vision to eliminate banking friction, ApexBank combines institutional stability with cutting-edge real-time financial infrastructure.
          </p>
        </div>

        {/* Core Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
            <p className="text-3xl font-black text-white">$12.4B+</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Total Assets Under Management</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
            <p className="text-3xl font-black text-emerald-400">1.2M+</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Active Accounts Worldwide</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
            <p className="text-3xl font-black text-cyan-400">140+</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Global Wire Destinations</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
            <p className="text-3xl font-black text-purple-400">99.99%</p>
            <p className="text-xs text-slate-400 font-medium mt-1">System Uptime SLA</p>
          </div>
        </div>

        {/* Mission & Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Our Security Mandate</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every deposit at ApexBank is protected by federal FDIC insurance up to $250,000 per depositor. Our multi-layer encryption architecture ensures zero-trust transaction verification at every touchpoint.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Borderless Capital Access</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Whether you are an individual saver or an international business, our unified digital platform provides instant liquidity, automated FX conversion, and multi-currency account management.
            </p>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">Executive Leadership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-3">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 mx-auto flex items-center justify-center text-xl font-bold text-white shadow-lg">
                EH
              </div>
              <h4 className="text-lg font-bold text-white">Eleanor Hastings</h4>
              <p className="text-xs text-blue-400 font-semibold">Chief Executive Officer</p>
              <p className="text-xs text-slate-400">Former Managing Director at Goldman Sachs & FinTech Visionary.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-3">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 mx-auto flex items-center justify-center text-xl font-bold text-white shadow-lg">
                MC
              </div>
              <h4 className="text-lg font-bold text-white">Marcus Chen</h4>
              <p className="text-xs text-indigo-400 font-semibold">Chief Technology Officer</p>
              <p className="text-xs text-slate-400">Ex-Google Distributed Systems Lead & Cryptographic Architecture Expert.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-3">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-xl font-bold text-white shadow-lg">
                SV
              </div>
              <h4 className="text-lg font-bold text-white">Sophia Vance</h4>
              <p className="text-xs text-emerald-400 font-semibold">Chief Risk & Compliance Officer</p>
              <p className="text-xs text-slate-400">20+ years regulating financial institutions and anti-money laundering frameworks.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-blue-500/30 bg-blue-950/20 p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl font-black text-white">Join Over 1 Million Satisfied Savers</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Experience the future of banking with zero fees, high yields, and instant digital account opening.
          </p>
          <Link
            href={PUBLIC_ROUTES.REGISTER}
            className="inline-block rounded-xl px-8 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg"
          >
            Open Your Account
          </Link>
        </div>
      </div>
    </div>
  );
}
