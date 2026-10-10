'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Send,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  Percent,
  Sparkles,
  Smartphone,
  Globe2,
} from 'lucide-react';
import { PUBLIC_ROUTES } from '@/constants/routes';

export default function HomePage() {
  const [depositAmount, setDepositAmount] = useState(10000);
  const [months, setMonths] = useState(12);

  // Interest calculation: 4.5% APY
  const interestRate = 0.045;
  const estimatedYield = (depositAmount * interestRate * (months / 12)).toFixed(2);
  const totalReturn = (depositAmount + parseFloat(estimatedYield)).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Next-Generation Digital Banking</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Banking Built For <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                  Your Financial Future
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Experience high-yield savings at 4.5% APY, zero account maintenance fees, instant zero-loss wire transfers, and institutional-grade security.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href={PUBLIC_ROUTES.REGISTER}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02]"
                >
                  Open Free Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href={PUBLIC_ROUTES.SERVICES}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-slate-200 border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:text-white transition-all"
                >
                  Explore Banking Services
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-slate-400 border-t border-slate-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>FDIC Insured Up to $250K</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Zero Hidden Account Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Instant 2-Minute Onboarding</span>
                </div>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 backdrop-blur-2xl shadow-2xl space-y-6">
                {/* Header Widget */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Apex High-Yield Balance</span>
                    <h3 className="text-2xl font-black text-white mt-1">$48,920.50</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +4.5% APY
                  </span>
                </div>

                {/* Virtual Card Preview */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200 font-medium uppercase tracking-widest">Apex Platinum</p>
                      <p className="text-xl font-bold tracking-widest mt-4">•••• •••• •••• 9821</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-cyan-300" />
                  </div>
                  <div className="mt-8 flex justify-between items-end text-xs">
                    <div>
                      <p className="text-slate-300 text-[10px]">CARD HOLDER</p>
                      <p className="font-semibold text-white tracking-wide">ALEX MORGAN</p>
                    </div>
                    <div>
                      <p className="text-slate-300 text-[10px]">EXPIRES</p>
                      <p className="font-semibold text-white tracking-wide">08/29</p>
                    </div>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Activity</p>
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800/60 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        ↓
                      </div>
                      <div>
                        <p className="font-semibold text-white">Interest Deposit</p>
                        <p className="text-slate-400">Yield payout</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400">+$183.45</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Engineered for Modern Financial Mastery
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Everything you need from a premier financial institution, re-imagined with high-speed digital architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">High-Yield Savings</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Grow your capital faster with an industry-leading 4.5% APY compounded daily with full liquidity.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Wire Transfers</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Send internal payments instantly or execute cross-border wire transfers across 140+ countries.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Virtual & Physical Cards</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generate disposable virtual cards for safe online purchases and set instant spending limits.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Institutional Security</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Protected with 256-bit encryption, biometric auth, hardware key support, and real-time fraud alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings Calculator */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                  <Percent className="h-3.5 w-3.5" />
                  APY Calculator
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Calculate Your Savings Growth
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  See how much more interest you earn with ApexBank compared to traditional low-yield bank accounts.
                </p>

                {/* Amount Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-300">Initial Deposit</span>
                    <span className="text-blue-400 font-bold">${depositAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Months Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-300">Duration</span>
                    <span className="text-blue-400 font-bold">{months} Months</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="36"
                    step="3"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Yield Result Box */}
              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/30 p-8 text-center space-y-6 backdrop-blur-md">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Projected Growth</span>
                <div>
                  <p className="text-4xl sm:text-5xl font-black text-white">${parseFloat(totalReturn).toLocaleString()}</p>
                  <p className="text-xs text-emerald-400 font-bold mt-2">
                    +${parseFloat(estimatedYield).toLocaleString()} Earned Interest (@ 4.5% APY)
                  </p>
                </div>
                <Link
                  href={PUBLIC_ROUTES.REGISTER}
                  className="block w-full rounded-xl py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Start Earning Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/50 via-slate-900 to-indigo-900/50 border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to Take Control of Your Money?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Open your ApexBank account online in less than two minutes with no minimum deposit required.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href={PUBLIC_ROUTES.REGISTER}
              className="rounded-xl px-8 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
