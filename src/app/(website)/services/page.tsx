import type { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, TrendingUp, Send, Landmark, Shield, RefreshCw, ArrowRight, Check } from 'lucide-react';
import { PUBLIC_ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Banking Services | ApexBank',
  description: 'Explore high-yield savings, zero-fee checking, international wire transfers, and credit cards.',
};

export default function ServicesPage() {
  const services = [
    {
      icon: TrendingUp,
      title: 'High-Yield Savings Account',
      rate: '4.50% APY',
      badge: 'Popular Choice',
      description: 'Maximize your return with interest compounded daily, no monthly maintenance fees, and instant withdrawal access.',
      features: ['Zero account minimums', 'Daily interest compounding', 'FDIC Insured to $250,000', 'Automated recurring deposits'],
      category: 'Savings',
    },
    {
      icon: Landmark,
      title: 'Zero-Fee Checking Account',
      rate: '0.00% Fees',
      badge: 'Zero Overhead',
      description: 'Seamless everyday banking with early direct deposit payouts, fee-free ATM access at 55,000+ locations, and contactless card.',
      features: ['Early pay up to 2 days prior', 'No overdraft penalty fees', '55K+ fee-free Allpoint ATMs', 'Instant Zelle / Peer transfers'],
      category: 'Checking',
    },
    {
      icon: Send,
      title: 'Global Wire & FX Transfers',
      rate: '140+ Countries',
      badge: 'Instant Execution',
      description: 'Execute high-speed international wire transfers with transparent real-time FX exchange rates and low fixed fees.',
      features: ['Real-time currency exchange', 'SWIFT & SEPA wire networks', 'Automated recurring transfers', 'Instant transfer confirmation'],
      category: 'Transfers',
    },
    {
      icon: CreditCard,
      title: 'Apex Platinum Cash Back Card',
      rate: '3% Cash Back',
      badge: 'No Annual Fee',
      description: 'Earn 3% cash back on travel & dining, 2% on online purchases, and 1.5% on all other transactions with zero foreign transaction fees.',
      features: ['Unlimited cash back rewards', 'Zero foreign transaction fees', 'Complimentary airport lounge access', 'Virtual card numbers'],
      category: 'Cards',
    },
    {
      icon: Shield,
      title: 'Commercial & Small Business Banking',
      rate: 'Custom Credit Lines',
      badge: 'Business Suite',
      description: 'Empower your company with multi-user access controls, payroll integrations, merchant payment processing, and working capital loans.',
      features: ['Dedicated business account manager', 'Automated payroll direct deposit', 'Merchant payment processing', 'Flexible revolving credit lines'],
      category: 'Business',
    },
    {
      icon: RefreshCw,
      title: 'Fixed CD Certificates',
      rate: '5.10% APY',
      badge: 'Guaranteed Return',
      description: 'Lock in guaranteed high-yielding interest rates across 6, 12, 24, or 36-month terms with predictable risk-free growth.',
      features: ['Guaranteed rate locks', 'Flexible term lengths', 'Automatic maturity reinvestment', 'FDIC government backing'],
      category: 'Investments',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
            <Landmark className="h-3.5 w-3.5" />
            <span>Comprehensive Financial Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Banking Products Designed For <br />
            <span className="text-blue-400">Maximum Yield & Security</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Choose from our award-winning personal, business, and wealth management services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col justify-between hover:border-blue-500/40 transition-all hover:-translate-y-1"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-2xl font-black text-cyan-400 mt-1">{item.rate}</p>
                    <p className="text-slate-400 text-xs mt-3 leading-relaxed">{item.description}</p>
                  </div>

                  <ul className="space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href={PUBLIC_ROUTES.REGISTER}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-blue-600 transition-colors"
                  >
                    Apply Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
