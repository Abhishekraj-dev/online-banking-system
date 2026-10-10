'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle2, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AccountItem {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number | string;
  currency: string;
}

interface RecipientAccount {
  id: string;
  accountNumber: string;
  accountType: string;
  user: {
    name: string;
    email: string;
  };
}

export default function TransferPage() {
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [recipientAccounts, setRecipientAccounts] = useState<RecipientAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [transferType, setTransferType] = useState<'INTERNAL' | 'OTHER_CLIENT' | 'EXTERNAL'>('OTHER_CLIENT');
  const [fromAccount, setFromAccount] = useState('');
  const [toRecipient, setToRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [txnRef, setTxnRef] = useState('');

  // Fetch real accounts and other registered recipients from database
  useEffect(() => {
    async function fetchData() {
      try {
        const [accRes, recipRes] = await Promise.all([
          fetch('/api/accounts'),
          fetch('/api/accounts?scope=recipients'),
        ]);

        if (accRes.ok) {
          const json = await accRes.json();
          if (json.success && json.data && json.data.length > 0) {
            setAccounts(json.data);
            setFromAccount(json.data[0].id);
          }
        }

        if (recipRes.ok) {
          const recipJson = await recipRes.json();
          if (recipJson.success && recipJson.data) {
            setRecipientAccounts(recipJson.data);
            if (recipJson.data.length > 0) {
              setToRecipient(recipJson.data[0].accountNumber);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load accounts or recipients', err);
      } finally {
        setLoadingAccounts(false);
        setLoadingRecipients(false);
      }
    }
    fetchData();
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toRecipient || !amount || parseFloat(amount) <= 0) {
      toast.error('Please enter or select a valid recipient and amount');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toRecipient,
          amount: parseFloat(amount),
          description: description || undefined,
          type: 'TRANSFER',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Transfer failed');
      }

      setTxnRef(data.data.reference || `TXN-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
      toast.success('Transfer processed and settled successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during transfer.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const internalDestinations = accounts.filter((a) => a.id !== fromAccount);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Money Transfer & Payments</h1>
        <p className="text-xs text-slate-400 mt-1">Execute zero-fee instant transfers to any ApexBank client or external account.</p>
      </div>

      {submitted ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-10 text-center space-y-4">
          <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Transfer Completed</h2>
          <p className="text-sm text-slate-300">Reference #{txnRef} generated & recorded on ledger.</p>
          <p className="text-xs text-slate-400 font-mono">Amount: ${parseFloat(amount).toFixed(2)} USD</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setAmount('');
              setToRecipient(recipientAccounts[0]?.accountNumber || '');
              setDescription('');
            }}
            className="mt-4 rounded-xl px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Execute Another Transfer
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl space-y-6">
          {/* Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTransferType('OTHER_CLIENT');
                setToRecipient(recipientAccounts[0]?.accountNumber || '');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                transferType === 'OTHER_CLIENT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              To ApexBank Client
            </button>
            <button
              type="button"
              onClick={() => {
                setTransferType('INTERNAL');
                setToRecipient(internalDestinations[0]?.id || '');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                transferType === 'INTERNAL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Between My Accounts
            </button>
            <button
              type="button"
              onClick={() => {
                setTransferType('EXTERNAL');
                setToRecipient('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                transferType === 'EXTERNAL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              External Wire / IBAN
            </button>
          </div>

          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pay From Account</label>
              {loadingAccounts ? (
                <div className="flex items-center gap-2 py-3 px-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> Loading active accounts...
                </div>
              ) : (
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountType} ({acc.accountNumber}) - Bal: ${Number(acc.balance).toFixed(2)}
                    </option>
                  ))}
                  {accounts.length === 0 && (
                    <option value="">No active accounts found</option>
                  )}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {transferType === 'OTHER_CLIENT'
                  ? 'Select ApexBank Client / Account'
                  : transferType === 'INTERNAL'
                  ? 'Select Your Destination Account'
                  : 'Recipient Account Number / Email / IBAN'}
              </label>

              {transferType === 'OTHER_CLIENT' ? (
                loadingRecipients ? (
                  <div className="flex items-center gap-2 py-3 px-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> Loading other registered clients...
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={toRecipient}
                      onChange={(e) => setToRecipient(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">-- Choose Other Registered Account --</option>
                      {recipientAccounts.map((rec) => (
                        <option key={rec.id} value={rec.accountNumber}>
                          {rec.user.name} ({rec.user.email}) — {rec.accountNumber} [{rec.accountType}]
                        </option>
                      ))}
                      {recipientAccounts.length === 0 && (
                        <option value="" disabled>No other client accounts registered yet</option>
                      )}
                    </select>
                    {recipientAccounts.length > 0 && (
                      <p className="text-[11px] text-emerald-400">
                        ✓ Instant zero-fee internal transfer to another ApexBank client.
                      </p>
                    )}
                  </div>
                )
              ) : transferType === 'INTERNAL' ? (
                <div>
                  <select
                    value={toRecipient}
                    onChange={(e) => setToRecipient(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Choose Destination Account --</option>
                    {internalDestinations.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountType} ({acc.accountNumber}) - Bal: ${Number(acc.balance).toFixed(2)}
                      </option>
                    ))}
                    {internalDestinations.length === 0 && (
                      <option value="" disabled>No other accounts under your login</option>
                    )}
                  </select>
                  {internalDestinations.length === 0 && (
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Tip: You only have 1 bank account under this login. Use the <strong>&quot;To ApexBank Client&quot;</strong> tab to send money to other registered users, or open a Savings account in &quot;Accounts &amp; Cards&quot;.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    required
                    value={toRecipient}
                    onChange={(e) => setToRecipient(e.target.value)}
                    placeholder="Enter Account Number (ACC-XXXX), Client Email, or IBAN"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    Supports recipient Account Number (e.g. ACC-12431540), registered Email, or IBAN.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Transfer Amount (USD) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Reference / Note</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Savings deposit or invoice payment"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4 text-xs space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-400">Transfer Fee:</span>
                <span className="text-emerald-400">$0.00 (Zero Fee)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-400">Execution Speed:</span>
                <span className="text-white">Instant Settlement</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing Settlement...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Confirm & Execute Transfer
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
