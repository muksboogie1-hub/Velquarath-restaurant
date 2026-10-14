import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export interface AdminUser {
  email: string;
  id: string;
  role?: string;
  isSupabaseAuth: boolean;
}

export interface AdminMember {
  id: string;
  userId?: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
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
 * On live production, ONLY verified Supabase authentication sessions are accepted.
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (user) {
        // Query admin_users whitelist table if available
        let role = 'admin';
        try {
          const { data: adminRecord } = await client
            .from('admin_users')
            .select('role, is_active')
            .eq('user_id', user.id)
            .single();

          if (adminRecord) {
            if (!adminRecord.is_active) {
              // Admin account has been revoked
              await client.auth.signOut();
              return null;
            }
            role = adminRecord.role || 'admin';
          }
        } catch {
          // Table may not be queried yet or offline fallback
        }

        return {
          email: user.email || 'admin@velquarath.com',
          id: user.id,
          role,
          isSupabaseAuth: true,
        };
      }
    } catch {
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
            role: 'owner',
            isSupabaseAuth: false,
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return null;
}

/**
 * Authenticates an existing administrator via real Supabase Auth.
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
          error: 'Incorrect email or password. Access is restricted to authorized administrators.',
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
      // Verify authorization against admin_users whitelist table
      try {
        const { data: adminRecord, error: adminErr } = await client
          .from('admin_users')
          .select('role, is_active')
          .eq('user_id', data.user.id)
          .single();

        if (!adminErr && adminRecord && !adminRecord.is_active) {
          await client.auth.signOut();
          return {
            success: false,
            error: 'This administrator account has been deactivated. Contact the restaurant owner.',
          };
        }
      } catch {
        // Table may be pending initial execution
      }

      return {
        success: true,
        user: {
          email: data.user.email || email,
          id: data.user.id,
          role: 'admin',
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
 * Signs out the current admin from both Supabase Auth and preview sessions.
 */
export async function adminSignOut(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch {
      // ignore
    }
  }
  sessionStorage.removeItem(PREVIEW_SESSION_KEY);
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
    role: 'owner',
    isSupabaseAuth: false,
  };

  sessionStorage.setItem(PREVIEW_SESSION_KEY, JSON.stringify(user));
  return { success: true, user };
}

// =====================================================================
// AUTHENTICATED ADMINISTRATOR PROVISIONING (Protected Admin-Only Methods)
// =====================================================================

const LOCAL_ADMIN_MEMBERS_KEY = 'velquarath_admin_members_cache';

/**
 * Fetches the list of authorized administrators.
 * Only callable by an authenticated administrator.
 */
export async function fetchAdminTeam(): Promise<AdminMember[]> {
  const client = getSupabaseClient();
  const current = await getCurrentAdminUser();

  if (client && current?.isSupabaseAuth) {
    try {
      const { data, error } = await client
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          userId: d.user_id,
          email: d.email,
          role: d.role || 'admin',
          isActive: d.is_active !== false,
          createdAt: d.created_at,
        }));
      }
    } catch {
      // fallback to local cache
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_ADMIN_MEMBERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }

  return [
    {
      id: 'admin_primary_owner',
      email: current?.email || 'velquarath@gmail.com',
      role: 'owner',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Creates a new administrator account.
 * Only executable from inside the authenticated admin panel by an existing administrator.
 */
export async function createAdminMember(
  email: string,
  password?: string,
  role = 'admin'
): Promise<{ success: boolean; error?: string; member?: AdminMember }> {
  const current = await getCurrentAdminUser();
  if (!current) {
    return { success: false, error: 'Unauthorized: Only signed-in administrators can create admin accounts.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const client = getSupabaseClient();

  if (client && current.isSupabaseAuth) {
    try {
      // 1. If password provided, register user via Supabase Auth
      let authUserId: string | undefined;
      if (password && password.length >= 6) {
        const { data: signUpData, error: signUpErr } = await client.auth.signUp({
          email: cleanEmail,
          password,
        });

        if (signUpErr && !signUpErr.message.includes('already registered')) {
          return { success: false, error: signUpErr.message };
        }
        if (signUpData.user) {
          authUserId = signUpData.user.id;
        }
      }

      // 2. Insert into admin_users whitelist table
      const { data: inserted, error: insertErr } = await client
        .from('admin_users')
        .upsert(
          {
            email: cleanEmail,
            role,
            is_active: true,
            user_id: authUserId || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        )
        .select()
        .single();

      if (insertErr) {
        return { success: false, error: insertErr.message };
      }

      const member: AdminMember = {
        id: inserted.id,
        userId: inserted.user_id,
        email: inserted.email,
        role: inserted.role || role,
        isActive: true,
        createdAt: inserted.created_at,
      };

      return { success: true, member };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create administrator record in database.' };
    }
  }

  // Preview Sandbox local management fallback
  try {
    const list = await fetchAdminTeam();
    if (list.some((m) => m.email === cleanEmail)) {
      return { success: false, error: 'An administrator with this email already exists.' };
    }

    const newMember: AdminMember = {
      id: 'admin_' + Date.now(),
      email: cleanEmail,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    list.push(newMember);
    localStorage.setItem(LOCAL_ADMIN_MEMBERS_KEY, JSON.stringify(list));
    return { success: true, member: newMember };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Toggles an administrator's active access status.
 */
export async function toggleAdminStatus(memberId: string, isActive: boolean): Promise<boolean> {
  const current = await getCurrentAdminUser();
  if (!current) return false;

  const client = getSupabaseClient();
  if (client && current.isSupabaseAuth) {
    try {
      const { error } = await client
        .from('admin_users')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', memberId);

      if (!error) return true;
    } catch {
      // fallback
    }
  }

  try {
    const list = await fetchAdminTeam();
    const updated = list.map((m) => (m.id === memberId ? { ...m, isActive } : m));
    localStorage.setItem(LOCAL_ADMIN_MEMBERS_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

/**
 * Deletes or revokes an administrator record.
 */
export async function deleteAdminMember(memberId: string): Promise<boolean> {
  const current = await getCurrentAdminUser();
  if (!current) return false;

  const client = getSupabaseClient();
  if (client && current.isSupabaseAuth) {
    try {
      const { error } = await client.from('admin_users').delete().eq('id', memberId);
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  try {
    const list = await fetchAdminTeam();
    const filtered = list.filter((m) => m.id !== memberId);
    localStorage.setItem(LOCAL_ADMIN_MEMBERS_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}
