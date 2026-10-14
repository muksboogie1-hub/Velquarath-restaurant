import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export interface AdminUser {
  email: string;
  id: string;
  isSupabaseAuth: boolean;
}

const PREVIEW_SESSION_KEY = 'velquarath_admin_preview_session';

/**
 * Checks whether the app is currently running in a local development or
 * AI Studio preview environment rather than the live deployed production domain.
 */
export function isPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host.includes('run.app') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host === ''
  );
}

/**
 * Retrieves the current admin user session.
 * On live production, ONLY real Supabase authentication sessions are accepted.
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        return {
          email: user.email || 'admin@velquarath.com',
          id: user.id,
          isSupabaseAuth: true,
        };
      }
    } catch (e) {
      // ignore
    }
  }

  // Preview fallback: strictly restricted to local/preview sandbox environments
  if (isPreviewEnvironment()) {
    try {
      const raw = sessionStorage.getItem(PREVIEW_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) {
          return {
            email: parsed.email,
            id: 'preview_admin_session',
            isSupabaseAuth: false,
          };
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return null;
}

/**
 * Authenticates an admin user via real Supabase Auth.
 */
export async function adminSignIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      error:
        'Supabase is not configured yet. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or use Sandbox Preview Mode.',
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        return {
          success: false,
          error:
            'Incorrect email or password. If you have not created your admin user in Supabase yet, click "First-Time Setup (Create Supabase Admin)" below.',
        };
      }
      if (error.message.toLowerCase().includes('email not confirmed')) {
        return {
          success: false,
          error:
            'Email confirmation is required by your Supabase project. Check your inbox or disable "Confirm email" in Supabase Auth -> Providers -> Email.',
        };
      }
      return { success: false, error: error.message };
    }

    if (data.user) {
      return {
        success: true,
        user: {
          email: data.user.email || email,
          id: data.user.id,
          isSupabaseAuth: true,
        },
      };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication request failed' };
  }

  return { success: false, error: 'Authentication failed. Please verify credentials.' };
}

/**
 * Registers an admin user into Supabase Auth.
 * Useful for first-time setup directly from the application.
 */
export async function adminSignUp(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; message?: string; user?: AdminUser }> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase credentials are not configured yet.',
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long.',
    };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password: password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // If Supabase has email confirmation enabled, session might be null until confirmed
      if (data.session) {
        return {
          success: true,
          message: 'Admin account created and logged in successfully!',
          user: {
            email: data.user.email || email,
            id: data.user.id,
            isSupabaseAuth: true,
          },
        };
      } else {
        return {
          success: true,
          message:
            'Account created in Supabase! If your Supabase project requires email confirmation, please check your email inbox to verify.',
        };
      }
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create account in Supabase' };
  }

  return { success: false, error: 'Could not create account in Supabase.' };
}

/**
 * Preview Sandbox Login:
 * Strictly isolated for local developer / AI Studio preview testing.
 * NEVER allowed on the production domain.
 */
export function enterPreviewSandbox(email = 'velquarath@gmail.com'): {
  success: boolean;
  error?: string;
  user?: AdminUser;
} {
  if (!isPreviewEnvironment()) {
    return {
      success: false,
      error: 'Sandbox preview mode is disabled on production. Please log in with Supabase credentials.',
    };
  }

  const user: AdminUser = {
    email: email.trim() || 'velquarath@gmail.com',
    id: 'preview_sandbox_user',
    isSupabaseAuth: false,
  };

  sessionStorage.setItem(PREVIEW_SESSION_KEY, JSON.stringify(user));
  return { success: true, user };
}

/**
 * Signs out the current admin from both Supabase Auth and preview sessions.
 */
export async function adminSignOut(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      // ignore
    }
  }
  sessionStorage.removeItem(PREVIEW_SESSION_KEY);
}
