import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string;
  keyMasked: string;
  source: 'build_time_env' | 'browser_storage' | 'none';
  error?: string;
}

const STORAGE_KEY = 'velquarath_supabase_settings';

/**
 * Sanitizes and normalizes the public Supabase URL.
 * Automatically fixes duplicate copy-pastes (e.g. https://xxx.supabase.cohttps://xxx.supabase.co).
 */
export function sanitizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim().replace(/^["']|["']$/g, '').trim();
  const match = trimmed.match(/(https:\/\/[a-z0-9-]+\.supabase\.co)/i);
  if (match) return match[1];
  return trimmed.replace(/\/+$/, '');
}

/**
 * Deep security inspection: checks whether a key is a service-role or secret key.
 */
export function isServiceRoleKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim().replace(/^["']|["']$/g, '').trim();
  if (trimmed.includes('service_role') || trimmed.startsWith('sb_secret_')) return true;

  const parts = trimmed.split('.');
  if (parts.length === 3) {
    try {
      let decodedStr = '';
      if (typeof atob === 'function') {
        decodedStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      }
      if (decodedStr) {
        const payload = JSON.parse(decodedStr);
        if (payload.role === 'service_role' || payload.role === 'supabase_admin') {
          return true;
        }
      }
    } catch {
      // ignore
    }
  }
  return false;
}

/**
 * Validates the Supabase public key.
 * Security enforcement: NEVER allows service-role keys on the client.
 */
export function validateSupabaseKey(key?: string): { valid: boolean; error?: string } {
  if (!key) return { valid: false, error: 'Key is empty' };
  const trimmed = key.trim().replace(/^["']|["']$/g, '').trim();

  // Reject service role and secret keys immediately
  if (isServiceRoleKey(trimmed)) {
    const securityError =
      'CRITICAL SECURITY ERROR: Service-role or secret key detected. Only public anon/publishable keys are permitted in frontend code.';
    console.error(securityError);
    return { valid: false, error: securityError };
  }

  // Accept valid Supabase anon JWTs (eyJ...) or new publishable format (sb_publishable_...)
  if (trimmed.startsWith('sb_publishable_') || trimmed.startsWith('eyJ')) {
    return { valid: true };
  }

  // Accept other standard public tokens if >= 20 chars
  if (trimmed.length >= 20) {
    return { valid: true };
  }

  return { valid: false, error: 'Invalid Supabase key format' };
}

/**
 * Retrieves the active Supabase configuration.
 * Resolution hierarchy:
 * 1. Build-time injected environment variables (Vite define / import.meta.env).
 * 2. Browser-level configuration in localStorage (allows live setup even if Cloudflare build variables failed).
 */
export const getSupabaseConfig = (): { url: string; key: string } => {
  // 1. Check build-time environment variables
  const envUrl = sanitizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const envKeyCheck = validateSupabaseKey(envKey);
  if (envUrl && envKey && envKeyCheck.valid && !envUrl.includes('your-project')) {
    return { url: envUrl, key: envKey };
  }

  // 2. Check browser-level override stored in localStorage
  if (typeof window !== 'undefined') {
    try {
      const customConfig = localStorage.getItem(STORAGE_KEY);
      if (customConfig) {
        const parsed = JSON.parse(customConfig);
        const storedUrl = sanitizeSupabaseUrl(parsed.url);
        const storedKey = (parsed.key || '').trim();
        const storedKeyCheck = validateSupabaseKey(storedKey);

        if (storedUrl && storedKey && storedKeyCheck.valid && !storedUrl.includes('your-project')) {
          return { url: storedUrl, key: storedKey };
        }
      }
    } catch {
      // ignore localStorage read errors
    }
  }

  return { url: '', key: '' };
};

/**
 * Checks whether Supabase credentials are valid and ready for use.
 */
export const isSupabaseConfigured = (): boolean => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.key && !cfg.url.includes('your-project'));
};

/**
 * Returns comprehensive configuration diagnostics for the admin dashboard and health checks.
 */
export const getSupabaseConfigStatus = (): SupabaseConfigStatus => {
  const envUrl = sanitizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  // Check if build environment supplied valid credentials
  if (envUrl && envKey && !envUrl.includes('your-project')) {
    const keyCheck = validateSupabaseKey(envKey);
    if (keyCheck.valid) {
      return {
        isConfigured: true,
        url: envUrl,
        keyMasked: `${envKey.slice(0, 10)}...${envKey.slice(-4)}`,
        source: 'build_time_env',
      };
    }
    return {
      isConfigured: false,
      url: envUrl,
      keyMasked: '',
      source: 'build_time_env',
      error: keyCheck.error,
    };
  }

  // Check browser-level storage
  if (typeof window !== 'undefined') {
    try {
      const customConfig = localStorage.getItem(STORAGE_KEY);
      if (customConfig) {
        const parsed = JSON.parse(customConfig);
        const storedUrl = sanitizeSupabaseUrl(parsed.url);
        const storedKey = (parsed.key || '').trim();
        const keyCheck = validateSupabaseKey(storedKey);

        if (storedUrl && storedKey && keyCheck.valid && !storedUrl.includes('your-project')) {
          return {
            isConfigured: true,
            url: storedUrl,
            keyMasked: `${storedKey.slice(0, 10)}...${storedKey.slice(-4)}`,
            source: 'browser_storage',
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return {
    isConfigured: false,
    url: '',
    keyMasked: '',
    source: 'none',
    error:
      'Supabase credentials are not configured in this static build. To connect your database, rebuild with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.production and deploy with `npx wrangler deploy`, or use the in-browser connection drawer below.',
  };
};

export const getActiveSupabaseConfig = () => getSupabaseConfig();

/**
 * Saves Supabase credentials to the browser's localStorage.
 * Useful when Cloudflare Workers static build variables could not be saved in Cloudflare UI.
 */
export const saveSupabaseBrowserConfig = (
  rawUrl: string,
  rawKey: string
): { success: boolean; error?: string } => {
  const url = sanitizeSupabaseUrl(rawUrl);
  const key = rawKey.trim();

  if (!url || !url.startsWith('https://')) {
    return { success: false, error: 'Please enter a valid Supabase project URL (must start with https://)' };
  }

  const keyCheck = validateSupabaseKey(key);
  if (!keyCheck.valid) {
    return { success: false, error: keyCheck.error || 'Invalid Supabase key' };
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ url, key }));
    resetSupabaseClient();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save configuration to browser storage' };
  }
};

/**
 * Clears any browser-level Supabase override.
 */
export const clearSupabaseBrowserConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    resetSupabaseClient();
  } catch {
    // ignore
  }
};

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
