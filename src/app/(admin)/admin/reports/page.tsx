'use client';

import { FileBarChart2, TrendingUp, DollarSign, Download, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const revenueData = [
  { month: 'May', revenue: 14200 },
  { month: 'Jun', revenue: 18500 },
  { month: 'Jul', revenue: 22100 },
  { month: 'Aug', revenue: 29800 },
  { month: 'Sep', revenue: 37400 },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Financial Reports & Yield Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Institutional yield tracking, revenue growth curves, and user acquisition metrics.</p>
        </div>

        <button
          onClick={() => toast.success('Financial report exported to PDF')}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20"
        >
          <Download className="h-4 w-4" />
          Download Full Report (PDF)
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Fee Revenue</span>
          <p className="text-3xl font-black text-white">$37,400.00</p>
          <p className="text-xs text-emerald-400 font-semibold">+25.5% vs previous month</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Deposit Expansion</span>
          <p className="text-3xl font-black text-emerald-400">+$1.45M</p>
          <p className="text-xs text-slate-400">New net capital inflow</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Account Yield</span>
          <p className="text-3xl font-black text-cyan-400">4.50% APY</p>
          <p className="text-xs text-slate-400">Daily compounding active</p>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">Monthly Revenue Inflow Trajectory</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
