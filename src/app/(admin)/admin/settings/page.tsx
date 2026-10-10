'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [dailyLimit, setDailyLimit] = useState('10000');
  const [apyRate, setApyRate] = useState('4.50');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const limit = json.data.find((s: { key: string }) => s.key === 'DAILY_TRANSFER_LIMIT');
            const apy = json.data.find((s: { key: string }) => s.key === 'SAVINGS_APY_RATE');
            const maint = json.data.find((s: { key: string }) => s.key === 'MAINTENANCE_MODE');

            if (limit) setDailyLimit(limit.value);
            if (apy) setApyRate(apy.value);
            if (maint) setMaintenanceMode(maint.value === 'true');
          }
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'DAILY_TRANSFER_LIMIT', value: dailyLimit, description: 'Maximum daily outbound transfer limit per customer (USD)' },
            { key: 'SAVINGS_APY_RATE', value: apyRate, description: 'Apex high-yield savings APY percentage' },
            { key: 'MAINTENANCE_MODE', value: String(maintenanceMode), description: 'System-wide maintenance window lock' },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save settings');
      }

      toast.success('System settings saved and applied to database');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving settings';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white">System Configuration & Limits</h1>
        <p className="text-xs text-slate-400 mt-1">Configure global transaction caps, interest rates, and system flags in the database.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          <span>Loading system parameters from database...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-400" />
              Global Risk Limits & Yield Rates
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Max Daily Transfer Limit per Customer (USD)</label>
              <input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">High-Yield Savings APY Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={apyRate}
                onChange={(e) => setApyRate(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">System Maintenance Window</p>
                <p className="text-xs text-slate-400">Lock non-admin logins for scheduled database maintenance.</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  maintenanceMode ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {maintenanceMode ? 'Maintenance Locked' : 'Normal Operation'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving Configuration...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save System Configuration
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
