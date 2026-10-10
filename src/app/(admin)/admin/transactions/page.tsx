'use client';

import { useState } from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, ShieldCheck, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const globalLedger = [
    { id: 'TXN-994101', user: 'Alex Morgan', type: 'DEPOSIT', amount: 5000.00, date: 'Sep 25, 2026', status: 'COMPLETED' },
    { id: 'TXN-994102', user: 'Alex Morgan', type: 'INTEREST', amount: 183.45, date: 'Sep 24, 2026', status: 'COMPLETED' },
    { id: 'TXN-994103', user: 'Sarah Jenkins', type: 'TRANSFER', amount: 1200.00, date: 'Sep 22, 2026', status: 'COMPLETED' },
    { id: 'TXN-994104', user: 'David Miller', type: 'WITHDRAWAL', amount: 450.00, date: 'Sep 18, 2026', status: 'FLAGGED' },
  ];

  const filtered = globalLedger.filter(
    (t) => t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Global Audit Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time system-wide financial transactions and fraud review queue.</p>
        </div>

        <button
          onClick={() => toast.success('Global audit report exported to CSV')}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700"
        >
          <Download className="h-4 w-4" />
          Export Global Audit (CSV)
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by transaction reference or user name..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
        />
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Account Holder</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-purple-400">{t.id}</td>
                  <td className="px-6 py-4 font-semibold text-white">{t.user}</td>
                  <td className="px-6 py-4 font-bold text-slate-300">{t.type}</td>
                  <td className="px-6 py-4 font-bold">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] ${t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-black text-white">${t.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
