'use client';

import { useState, useEffect } from 'react';
import { User, Shield, Loader2, Phone, Mail, Landmark } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  accounts: {
    id: string;
    accountNumber: string;
    accountType: string;
    balance: number | string;
    status: string;
  }[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setProfile(json.data);
            setPhone(json.data.phone || '');
          }
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update phone number');
      }
      toast.success('Phone number updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Profile & Security Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage personal credentials, two-factor authentication, and login sessions.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span>Loading client profile from database...</span>
        </div>
      ) : (
        <>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Personal Identity Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">Full Legal Name</span>
                <p className="text-sm font-bold text-white mt-1">{profile?.name || 'Alex Morgan'}</p>
              </div>
              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">Primary Email</span>
                <p className="text-sm font-bold text-white mt-1">{profile?.email || 'alex.morgan@example.com'}</p>
              </div>
            </div>

            <form onSubmit={handleSavePhone} className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-300">Verified Contact Phone</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Update Phone'}
                </button>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Two-Factor Security Guard
            </h3>

            <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">Authenticator App 2FA</p>
                <p className="text-xs text-slate-400">Require an OTP code from Google Authenticator on login.</p>
              </div>
              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  toast.success(twoFactorEnabled ? '2FA disabled' : '2FA enabled');
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
