'use client';

import { useState } from 'react';
import { CreditCard, Shield, Lock, Unlock, Plus, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerServicesPage() {
  const [cardFrozen, setCardFrozen] = useState(false);

  const toggleFreeze = () => {
    setCardFrozen(!cardFrozen);
    toast.success(cardFrozen ? 'Virtual card unfrozen' : 'Virtual card frozen');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Banking Services & Card Control</h1>
        <p className="text-xs text-slate-400 mt-1">Manage security limits, generate disposable cards, or request loan overdrafts.</p>
      </div>

      {/* Card Controls */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Apex Virtual Platinum Card</h3>
            <p className="text-xs text-slate-400">Card ending in **9821</p>
          </div>
          <button
            onClick={toggleFreeze}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              cardFrozen ? 'bg-emerald-600 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {cardFrozen ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold">Monthly Online Limit</span>
            <p className="text-xl font-bold text-white">$5,000.00 / month</p>
          </div>
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold">International Transactions</span>
            <p className="text-xl font-bold text-emerald-400">Enabled (Zero Fee)</p>
          </div>
        </div>

        <button
          onClick={() => toast.success('New disposable virtual card generated!')}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          Generate Disposable Virtual Card Number
        </button>
      </div>
    </div>
  );
}
