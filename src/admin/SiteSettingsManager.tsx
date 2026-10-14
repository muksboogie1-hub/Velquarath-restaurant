import React, { useState, useEffect } from 'react';
import {
  Database,
  Shield,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  LogOut,
  Sparkles,
  Info,
  Activity,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import {
  getActiveSupabaseConfig,
  isSupabaseConfigured,
  resetSupabaseClient,
} from '../services/supabase';
import {
  seedInitialMenuToSupabase,
  checkSupabaseHealth,
  SupabaseHealthReport,
} from '../services/contentService';
import { adminSignOut } from '../services/authService';

interface SiteSettingsManagerProps {
  onLoggedOut: () => void;
}

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({ onLoggedOut }) => {
  const {
    currentUser,
    menuItems,
    restaurantConfig,
    siteContent,
    appearance,
    refreshAll,
    isSupabaseActive,
  } = useContent();

  const activeCfg = getActiveSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(activeCfg.url || '');
  const [supabaseKey, setSupabaseKey] = useState(activeCfg.key || '');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [seeding, setSeeding] = useState(false);
  const [healthReport, setHealthReport] = useState<SupabaseHealthReport | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const runHealthCheck = async () => {
    setCheckingHealth(true);
    try {
      const report = await checkSupabaseHealth();
      setHealthReport(report);
    } catch {
      // ignore
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    if (isSupabaseActive) {
      runHealthCheck();
    }
  }, [isSupabaseActive]);

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        'velquarath_supabase_settings',
        JSON.stringify({ url: supabaseUrl.trim(), key: supabaseKey.trim() })
      );
      resetSupabaseClient();
      setStatusMsg({
        type: 'success',
        text: 'Supabase configuration saved! Reloading data connection...',
      });
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (e: any) {
      setStatusMsg({ type: 'error', text: 'Failed to save settings: ' + e.message });
    }
  };

  const handleSeedMenu = async () => {
    setSeeding(true);
    setStatusMsg(null);
    const res = await seedInitialMenuToSupabase();
    setSeeding(false);

    if (res.error) {
      setStatusMsg({ type: 'error', text: res.error });
    } else {
      setStatusMsg({
        type: 'success',
        text: `Successfully uploaded ${res.count} menu items, config, and gallery items into your Supabase database!`,
      });
      refreshAll();
      runHealthCheck();
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      restaurantConfig,
      siteContent,
      appearance,
      menuItems,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velquarath-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await adminSignOut();
    onLoggedOut();
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#332E26]">
        <h2 className="font-display text-2xl font-bold text-[#F4ECDA]">Site Settings &amp; Backend</h2>
        <p className="text-xs text-[#B8AD96] mt-1">
          Manage database connections, cloud storage, data backups, and administrator security.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-700 text-emerald-200'
              : 'bg-red-950/60 border border-red-700 text-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* HEALTH DIAGNOSTIC CARD */}
      <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#332E26]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#26221D] text-[#C9A24B]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#F4ECDA]">
                Backend Health &amp; Schema Diagnostics
              </h3>
              <p className="text-xs text-[#B8AD96]">
                Verify whether your Supabase tables and image storage bucket are initialized.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={runHealthCheck}
            disabled={checkingHealth}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-xs font-semibold text-[#C9A24B] border border-[#332E26] self-start sm:self-auto disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
            <span>{checkingHealth ? 'Checking...' : 'Check Supabase Health'}</span>
          </button>
        </div>

        {healthReport ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* Table Health */}
            <div className="p-3.5 rounded-xl bg-[#141210] border border-[#332E26] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F4ECDA]">Public Tables</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    healthReport.menuTable && healthReport.configTable
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                      : 'bg-red-950/80 text-red-300 border border-red-700/50'
                  }`}
                >
                  {healthReport.menuTable && healthReport.configTable ? '✓ Ready' : '✗ Missing'}
                </span>
              </div>
              <p className="text-[11px] text-[#B8AD96]">
                {healthReport.menuTable && healthReport.configTable
                  ? 'All public content tables exist and are accessible.'
                  : "Tables not created yet. Please execute 'supabase-schema.sql' in your SQL Editor."}
              </p>
            </div>

            {/* Admin RLS Whitelist Table */}
            <div className="p-3.5 rounded-xl bg-[#141210] border border-[#332E26] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F4ECDA]">RLS Whitelist</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    healthReport.adminTable
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                      : 'bg-red-950/80 text-red-300 border border-red-700/50'
                  }`}
                >
                  {healthReport.adminTable ? '✓ Protected' : '✗ Missing'}
                </span>
              </div>
              <p className="text-[11px] text-[#B8AD96]">
                {healthReport.adminTable
                  ? 'admin_users table active with is_admin() RLS authorization.'
                  : 'admin_users table not found. Execute the updated supabase-schema.sql.'}
              </p>
            </div>

            {/* Storage Bucket Health */}
            <div className="p-3.5 rounded-xl bg-[#141210] border border-[#332E26] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F4ECDA]">Storage Bucket</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    healthReport.storageBucket
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                      : 'bg-red-950/80 text-red-300 border border-red-700/50'
                  }`}
                >
                  {healthReport.storageBucket ? '✓ Ready' : '✗ Missing'}
                </span>
              </div>
              <p className="text-[11px] text-[#B8AD96]">
                {healthReport.storageBucket
                  ? "Bucket 'restaurant-media' is active for photo uploads."
                  : "Bucket 'restaurant-media' not found. Create under Storage -> New Bucket."}
              </p>
            </div>

            {/* Auth Session */}
            <div className="p-3.5 rounded-xl bg-[#141210] border border-[#332E26] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F4ECDA]">Auth Mode</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    currentUser?.isSupabaseAuth
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                  }`}
                >
                  {currentUser?.isSupabaseAuth ? '✓ Supabase User' : '⚡ Preview Sandbox'}
                </span>
              </div>
              <p className="text-[11px] text-[#B8AD96]">
                {currentUser?.isSupabaseAuth
                  ? `Signed in as ${currentUser.email} with live JWT tokens.`
                  : 'Operating in local preview sandbox. Live edits require Supabase login.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-[#141210] border border-dashed border-[#332E26] text-center text-xs text-[#736B5E]">
            Click &quot;Check Supabase Health&quot; above to verify your tables and storage bucket.
          </div>
        )}
      </div>

      {/* SUPABASE CLOUD DATABASE CONNECTION */}
      <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#332E26]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#26221D] text-[#C9A24B]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#F4ECDA]">
                Supabase Credentials Configuration
              </h3>
              <p className="text-xs text-[#B8AD96]">
                Configure project URL and anon public key.
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto border ${
              isSupabaseActive
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                : 'bg-amber-950/70 text-amber-300 border-amber-700/60'
            }`}
          >
            {isSupabaseActive ? '● Supabase Configured' : '○ Not Configured'}
          </div>
        </div>

        <div className="bg-[#141210] p-4 rounded-lg border border-[#332E26] text-xs text-[#B8AD96] space-y-2">
          <div className="flex items-start gap-2 text-[#F4ECDA] font-semibold">
            <Info className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
            <span>How to initialize your database &amp; bucket (1-minute setup):</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] leading-relaxed">
            <li>
              In your Supabase project dashboard, click <strong>SQL Editor</strong> on the left.
            </li>
            <li>
              Click <strong>New Query</strong>, copy all code from <code className="bg-[#1E1B17] px-1 py-0.5 rounded text-[#C9A24B]">supabase-schema.sql</code>, paste it, and click <strong>Run</strong>.
            </li>
            <li>
              Once the query completes with <em>&quot;Success&quot;</em>, click <strong>Check Supabase Health</strong> above. All diagnostic indicators will turn green!
            </li>
          </ol>
        </div>

        <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://abcdefghijklm.supabase.co"
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2.5 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Supabase Public Anon Key
            </label>
            <input
              type="text"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2.5 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none font-mono"
            />
            <p className="text-[11px] text-[#736B5E] mt-1">
              The anon key is safe for client-side web apps because tables are protected by Row-Level Security (RLS).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleSeedMenu}
              disabled={seeding || !supabaseUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-xs font-semibold text-[#C9A24B] border border-[#332E26] disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{seeding ? 'Uploading...' : 'Seed Supabase with Current Menu (45 Dishes)'}</span>
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs transition-colors shadow-lg cursor-pointer"
            >
              Save &amp; Connect Supabase
            </button>
          </div>
        </form>
      </div>

      {/* DATA BACKUP & EXPORT */}
      <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-[#C9A24B] pb-2 border-b border-[#332E26]">
          <Download className="w-4 h-4" />
          <h3 className="font-display text-base font-bold text-[#F4ECDA]">
            Website Data Backup &amp; Export
          </h3>
        </div>
        <p className="text-xs text-[#B8AD96]">
          Download a complete JSON snapshot of all menu items, dishes, prices, hours, and customized website text for safekeeping.
        </p>
        <button
          type="button"
          onClick={handleExportBackup}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-[#F4ECDA] border border-[#332E26] text-xs font-semibold transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#C9A24B]" />
          <span>Download Complete Content Backup (.json)</span>
        </button>
      </div>

      {/* ADMINISTRATOR SESSION */}
      <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-[#C9A24B] pb-2 border-b border-[#332E26]">
          <Shield className="w-4 h-4" />
          <h3 className="font-display text-base font-bold text-[#F4ECDA]">
            Administrator Account
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#141210] border border-[#332E26]">
          <div>
            <div className="text-xs font-semibold text-[#F4ECDA]">
              {currentUser?.email || 'velquarath@gmail.com'}
            </div>
            <div className="text-[11px] text-[#B8AD96] mt-0.5">
              Active Session • {currentUser?.isSupabaseAuth ? 'Supabase Authenticated' : 'Preview Sandbox Mode'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
