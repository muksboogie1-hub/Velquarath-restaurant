import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from Vite environment variables or owner-configured override in localStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && !envUrl.includes('your-project')) {
    return { url: envUrl, key: envKey };
  }

  // Allow admin to configure directly in the UI settings tab
  try {
    const customConfig = localStorage.getItem('velquarath_supabase_settings');
    if (customConfig) {
      const parsed = JSON.parse(customConfig);
      if (parsed.url && parsed.key) {
        return { url: parsed.url, key: parsed.key };
      }
    }
  } catch (e) {
    // ignore localStorage read error
  }

  return { url: '', key: '' };
};

export const isSupabaseConfigured = (): boolean => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.key && !cfg.url.includes('your-project'));
};

export const getActiveSupabaseConfig = () => getSupabaseConfig();

// =====================================================================
// SINGLETON CLIENT PATTERN:
// Prevents "Multiple GoTrueClient instances detected" warning by reusing
// a single shared instance throughout the app lifecycle.
// =====================================================================

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const cfg = getSupabaseConfig();
  if (!cfg.url || !cfg.key || cfg.url.includes('your-project')) {
    return null;
  }

  // Return existing singleton instance if configuration has not changed
  if (cachedClient && cachedUrl === cfg.url && cachedKey === cfg.key) {
    return cachedClient;
  }

  // Initialize once and cache
  cachedUrl = cfg.url;
  cachedKey = cfg.key;
  cachedClient = createClient(cfg.url, cfg.key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'velquarath_supabase_auth_token',
    },
  });

  return cachedClient;
};

// Helper to reset the singleton if credentials are changed in settings
export const resetSupabaseClient = () => {
  cachedClient = null;
  cachedUrl = '';
  cachedKey = '';
};

export const supabase: SupabaseClient | null = getSupabaseClient();
