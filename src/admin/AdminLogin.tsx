import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import {
  adminSignIn,
  enterPreviewSandbox,
  isPreviewEnvironment,
} from '../services/authService';
import { useContent } from '../context/ContentContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const { isSupabaseActive, setCurrentUser } = useContent();
  const [email, setEmail] = useState('velquarath@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPreview = isPreviewEnvironment();

  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminSignIn(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        onLoginSuccess();
      } else {
        setError(res.error || 'Incorrect email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnterSandbox = () => {
    const res = enterPreviewSandbox(email);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      onLoginSuccess();
    } else {
      setError(res.error || 'Could not launch preview mode.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141210] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to site button */}
      <div className="w-full max-w-md mb-6">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#B8AD96] hover:text-[#C9A24B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-[#1E1B17] border border-[#332E26] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-[#26221D] border border-[#C9A24B]/30 text-[#C9A24B] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#F4ECDA]">
            Velquarath Restaurant
          </h1>
          <p className="text-xs text-[#B8AD96] mt-1">
            Owner &amp; Administrator Portal
          </p>
        </div>

        {/* Live Backend Connection Status */}
        <div
          className={`mb-6 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
            isSupabaseActive
              ? 'bg-emerald-950/40 border border-emerald-700/50 text-emerald-200'
              : 'bg-zinc-900 border border-zinc-700 text-zinc-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#C9A24B]" />
          <div>
            <strong>Access Protection:</strong>{' '}
            {isSupabaseActive
              ? 'Protected by Supabase Authentication & Row-Level Security whitelist.'
              : 'Supabase credentials not configured in environment.'}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSupabaseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8AD96] mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B8AD96] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="velquarath@gmail.com"
                className="w-full bg-[#141210] border border-[#332E26] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F4ECDA] placeholder-[#736B5E] focus:border-[#C9A24B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8AD96] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B8AD96] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your admin password"
                className="w-full bg-[#141210] border border-[#332E26] rounded-lg pl-10 pr-10 py-2.5 text-sm text-[#F4ECDA] placeholder-[#736B5E] focus:border-[#C9A24B] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8AD96] hover:text-[#F4ECDA] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-2 cursor-pointer"
          >
            {loading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Log In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* PREVIEW SANDBOX OPTION (Only available in AI Studio preview / dev, NEVER in production) */}
        {isPreview && (
          <div className="mt-8 pt-6 border-t border-[#332E26]">
            <div className="p-3.5 rounded-xl bg-[#141210] border border-amber-900/40 text-xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Studio Preview Sandbox</span>
              </div>
              <p className="text-[#B8AD96] text-[11px] leading-relaxed">
                Development mode active: you can test the dashboard in local sandbox mode without querying live Supabase credentials.
              </p>
              <button
                type="button"
                onClick={handleEnterSandbox}
                className="w-full py-2 px-3 rounded-lg bg-[#26221D] hover:bg-[#332E26] border border-[#332E26] text-amber-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch Local Sandbox Mode</span>
              </button>
              <div className="text-[10px] text-[#736B5E] text-center">
                Strictly restricted to preview environment • Blocked on live production domain
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#332E26]/50 text-center">
          <p className="text-[11px] text-[#736B5E]">
            Closed Administrative Area • Access restricted to authorized personnel • Protected by RLS
          </p>
        </div>
      </div>
    </div>
  );
};
