'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, KeyRound, UserCheck, ShieldAlert } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { PUBLIC_ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error('Invalid credentials. Check email and password.');
      } else {
        toast.success('Authentication successful! Redirecting...');
        // Check role or default to dashboard
        if (email.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch {
      toast.error('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('alex.morgan@example.com');
    setPassword('Password123!');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@apexbank.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href={PUBLIC_ROUTES.HOME} className="inline-flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/30">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          ApexBank Portal Login
        </h2>
        <p className="text-xs text-slate-400">
          Enter your credentials to access your high-yield accounts.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Quick Demo Login Fill Buttons */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-3 space-y-2">
            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider text-center">Quick Demo Login Shortcuts</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                Customer Demo
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-purple-400" />
                Admin Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <span className="text-xs text-blue-400 hover:underline cursor-pointer">Forgot PIN?</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-10 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Secure Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            Don&apos;t have an ApexBank account yet?{' '}
            <Link href={PUBLIC_ROUTES.REGISTER} className="text-blue-400 font-bold hover:underline">
              Open An Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
