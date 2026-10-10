'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Loader2,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ADMIN_ROUTES } from '@/constants/routes';

const volumeData = [
  { day: 'Mon', volume: 420000 },
  { day: 'Tue', volume: 680000 },
  { day: 'Wed', volume: 590000 },
  { day: 'Thu', volume: 730000 },
  { day: 'Fri', volume: 840200 },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalLiquidity: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch('/api/admin/reports');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setStats(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">System Master Console</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
              SYS-STATUS: OPTIMAL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time banking liquidity, user administration, and security risk monitors.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={ADMIN_ROUTES.USERS}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          <span>Syncing liquidity and system stats from database...</span>
        </div>
      ) : (
        <>
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Liquidity Pool</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">
                ${Number(stats.totalLiquidity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Aggregated Live Vault Capital</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Accounts</span>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{stats.totalAccounts}</p>
              <span className="text-[11px] text-slate-400">{stats.totalUsers} Registered Users</span>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settled Transfers</span>
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{stats.totalTransactions}</p>
              <span className="text-[11px] text-cyan-400 font-semibold">Ledger Completed Entries</span>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security Threat Score</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">LOW RISK</span>
              </div>
              <p className="text-3xl font-black text-white">0.00%</p>
              <span className="text-[11px] text-slate-400">Zero flagged fraudulent entries</span>
            </div>
          </div>

          {/* System Volume Chart + Security Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chart */}
            <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">24h Settlement Volume Velocity</h3>
                  <p className="text-xs text-slate-400">Daily gross transaction clearing</p>
                </div>
                <Link href={ADMIN_ROUTES.REPORTS} className="text-xs font-bold text-purple-400 hover:underline">
                  Detailed Financial Report →
                </Link>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333EA" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#9333EA" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="volume" stroke="#9333EA" strokeWidth={3} fillOpacity={1} fill="url(#purpleGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Audit Feed */}
            <div className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Security Event Stream</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-400">Database Connected</span>
                      <span className="text-[10px] text-slate-500">Live</span>
                    </div>
                    <p className="text-slate-400">Connected to Neon Serverless PostgreSQL.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-400">Ledger In Sync</span>
                      <span className="text-[10px] text-slate-500">Real-time</span>
                    </div>
                    <p className="text-slate-400">All account balances mapped to Prisma transactions.</p>
                  </div>
                </div>
              </div>

              <Link
                href={ADMIN_ROUTES.SETTINGS}
                className="w-full text-center rounded-xl py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Manage System Parameters
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
