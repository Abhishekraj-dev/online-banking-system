'use client';

import { useState, useEffect } from 'react';
import { Landmark, Plus, Copy, Check, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number | string;
  currency: string;
  status: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newAccountType, setNewAccountType] = useState('SAVINGS');
  const [initialDeposit, setInitialDeposit] = useState('500');
  const [creating, setCreating] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAccounts(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load accounts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCopyIBAN = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedAccount(iban);
    toast.success('IBAN copied to clipboard!');
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountType: newAccountType,
          initialDeposit: parseFloat(initialDeposit) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to open account');
      }

      toast.success('New bank account opened successfully!');
      setModalOpen(false);
      fetchAccounts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating account';
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Accounts & Cards</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your active banking accounts and view routing credentials.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="h-4 w-4" />
          Open New Account
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span>Loading bank accounts from database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {accounts.map((acc) => {
            const iban = `US89 APEX 0001 ${acc.accountNumber.replace(/\D/g, '') || '8821 9401'}`;
            return (
              <div
                key={acc.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 hover:border-blue-500/40 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{acc.accountType} Account</h3>
                      <p className="text-xs text-slate-400">Account No: {acc.accountNumber}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    {acc.status}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Balance</span>
                  <p className="text-3xl font-black text-white mt-1">
                    ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {acc.currency}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">IBAN / Routing Number</span>
                    <p className="font-mono font-semibold text-slate-200">{iban}</p>
                  </div>
                  <button
                    onClick={() => handleCopyIBAN(iban)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy IBAN"
                  >
                    {copiedAccount === iban ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Open Account Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Open New Bank Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Type</label>
                <select
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="SAVINGS">High-Yield Savings (4.5% APY)</option>
                  <option value="CHECKING">Primary Checking</option>
                  <option value="BUSINESS">Commercial Business Checking</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Opening Deposit (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {creating ? 'Opening...' : 'Confirm & Open'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
