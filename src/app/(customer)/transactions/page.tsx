'use client';

import { useState, useEffect } from 'react';
import { Search, Download, ArrowDownLeft, ArrowUpRight, Loader2, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionItem {
  id: string;
  reference: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: string;
}

export default function TransactionsPage() {
  const [ledger, setLedger] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch('/api/transactions');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setLedger(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load transactions', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const filtered = ledger.filter((item) => {
    const desc = item.description || '';
    const matchesSearch =
      desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    if (ledger.length === 0) {
      toast.error('No transactions available to export');
      return;
    }

    const headers = ['Reference', 'Type', 'Amount', 'Currency', 'Status', 'Description', 'Date'];
    const rows = ledger.map((t) => [
      t.reference,
      t.type,
      t.amount,
      t.currency,
      t.status,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      new Date(t.createdAt).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Transaction statement exported to CSV');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Transaction History Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Audit logs and completed settlement records from the database.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <Download className="h-4 w-4" />
          Export Statement (CSV)
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by description or transaction reference..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'TRANSFER', 'DEPOSIT', 'BILL_PAYMENT'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span>Fetching transactions from ledger...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-12 text-center text-slate-400">
          <p className="font-semibold">No transactions match your search query.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800/60">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-900/80 transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold ${
                      item.type === 'DEPOSIT'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : item.type === 'TRANSFER'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {item.type === 'DEPOSIT' ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : item.type === 'TRANSFER' ? (
                      <ArrowLeftRight className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.description || `${item.type} Transaction`}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      Ref: {item.reference} • {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p
                    className={`text-base font-black ${
                      item.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {item.type === 'DEPOSIT' ? '+' : '-'}${Number(item.amount).toFixed(2)} {item.currency}
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold mt-1">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
