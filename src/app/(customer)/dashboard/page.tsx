'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  CreditCard,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ShieldCheck,
  DollarSign,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CUSTOMER_ROUTES } from '@/constants/routes';

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number | string;
  currency: string;
}

interface Transaction {
  id: string;
  reference: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: string;
}

const monthlyData = [
  { month: 'May', balance: 38200 },
  { month: 'Jun', balance: 41500 },
  { month: 'Jul', balance: 44100 },
  { month: 'Aug', balance: 49800 },
  { month: 'Sep', balance: 57350 },
];

export default function DashboardPage() {
  const [showBalances, setShowBalances] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [accRes, txnRes] = await Promise.all([
          fetch('/api/accounts'),
          fetch('/api/transactions'),
        ]);

        if (accRes.ok) {
          const accJson = await accRes.json();
          if (accJson.success && accJson.data) setAccounts(accJson.data);
        }

        if (txnRes.ok) {
          const txnJson = await txnRes.json();
          if (txnJson.success && txnJson.data) setTransactions(txnJson.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalNetWorth = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const checkingAcc = accounts.find((a) => a.accountType === 'CHECKING');
  const savingsAcc = accounts.find((a) => a.accountType === 'SAVINGS');

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome Back</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              VERIFIED CLIENT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Here is your live financial overview from the database.</p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            title="Toggle Balance Visibility"
          >
            {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>

          <Link
            href={CUSTOMER_ROUTES.TRANSFER}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Send className="h-4 w-4" />
            Transfer Money
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span>Syncing financial portfolio from database...</span>
        </div>
      ) : (
        <>
          {/* Top Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Net Worth */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Net Worth</span>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">
                {showBalances ? `$${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Active Vault Portfolio</span>
              </div>
            </div>

            {/* Checking Account */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Checking ({checkingAcc ? `**${checkingAcc.accountNumber.slice(-4)}` : 'N/A'})
                </span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">
                {showBalances
                  ? `$${(Number(checkingAcc?.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '••••••••'}
              </p>
              <span className="text-[11px] text-slate-400">Available Liquid Balance</span>
            </div>

            {/* High Yield Savings */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">High Yield Savings</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">4.5% APY</span>
              </div>
              <p className="text-3xl font-black text-white">
                {showBalances
                  ? `$${(Number(savingsAcc?.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '••••••••'}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold">Daily Interest Compounding</span>
            </div>

            {/* Credit Limit */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platinum Credit</span>
                <span className="text-[10px] text-purple-400 font-bold">3% Cash Back</span>
              </div>
              <p className="text-3xl font-black text-white">
                {showBalances ? '$10,000.00' : '••••••••'}
              </p>
              <span className="text-[11px] text-slate-400">$0.00 current balance used</span>
            </div>
          </div>

          {/* Analytics Chart + Virtual Card Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cashflow Growth Chart */}
            <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Portfolio Growth Velocity</h3>
                  <p className="text-xs text-slate-400">Net cumulative assets over the past 5 months</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +28.4% APY Yield Velocity
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#balanceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Virtual Card Widget */}
            <div className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Active Virtual Card</h3>
                <div className="rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-900 to-slate-950 p-5 text-white shadow-xl relative overflow-hidden space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-widest text-cyan-300">APEX PLATINUM</span>
                    <ShieldCheck className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-lg font-bold tracking-widest">•••• •••• •••• 9821</p>
                    <div className="flex justify-between items-end mt-4 text-[10px]">
                      <div>
                        <p className="text-slate-400">CARDHOLDER</p>
                        <p className="font-bold text-white">ALEX MORGAN</p>
                      </div>
                      <div>
                        <p className="text-slate-400">EXP</p>
                        <p className="font-bold text-white">08/29</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={CUSTOMER_ROUTES.ACCOUNTS}
                className="w-full text-center rounded-xl py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Manage Cards & Limits
              </Link>
            </div>
          </div>

          {/* Recent Transactions Feed */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                <p className="text-xs text-slate-400">Real-time ledger entries from PostgreSQL database</p>
              </div>
              <Link href={CUSTOMER_ROUTES.TRANSACTIONS} className="text-xs font-bold text-blue-400 hover:underline">
                View Full Ledger →
              </Link>
            </div>

            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-950/60 p-4 border border-slate-800/60 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
                        t.type === 'DEPOSIT'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : t.type === 'TRANSFER'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {t.type === 'DEPOSIT' ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : t.type === 'TRANSFER' ? (
                        <ArrowLeftRight className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.description || `${t.type} Transaction`}</p>
                      <p className="text-xs text-slate-400">
                        Ref: {t.reference} • {new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-black ${t.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {t.type === 'DEPOSIT' ? '+' : '-'}${Number(t.amount).toFixed(2)} {t.currency}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold mt-0.5">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center py-6 text-xs text-slate-500">No transaction records in database yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
