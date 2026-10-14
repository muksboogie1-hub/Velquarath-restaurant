import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

/**
 * Sanitizes and validates the public Supabase URL.
 * Automatically corrects duplicate copy-pastes (e.g. https://xxx.supabase.cohttps://xxx.supabase.co).
 */
function sanitizeUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim().replace(/^["']|["']$/g, '').trim();
  const match = trimmed.match(/(https:\/\/[a-z0-9-]+\.supabase\.co)/i);
  if (match) return match[1];
  return trimmed.replace(/\/+$/, '');
}

/**
 * Security check: ensures secret/service-role keys are never packaged into client bundles.
 */
function isServiceRoleKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim().replace(/^["']|["']$/g, '').trim();
  if (trimmed.includes('service_role') || trimmed.startsWith('sb_secret_')) return true;

  const parts = trimmed.split('.');
  if (parts.length === 3) {
    try {
      const decodedStr = Buffer.from(parts[1], 'base64').toString('utf8');
      const payload = JSON.parse(decodedStr);
      if (payload.role === 'service_role' || payload.role === 'supabase_admin') return true;
    } catch {
      // ignore
    }
  }
  return false;
}

export default defineConfig(({ mode, command }) => {
  // Load environment variables from .env, .env.production, and process.env
  const env = loadEnv(mode, process.cwd(), '');

  const rawUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const rawKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const supabaseUrl = sanitizeUrl(rawUrl);
  const supabaseKey = rawKey.trim().replace(/^["']|["']$/g, '').trim();

  // Security enforcement: NEVER allow service_role or secret keys in client bundles
  if (isServiceRoleKey(supabaseKey)) {
    throw new Error(
      '\n====================================================================================\n' +
      '❌ [CRITICAL SECURITY ERROR: Service-Role or Secret Key Detected!]\n' +
      '====================================================================================\n' +
      'A service-role or secret key was found in your build environment.\n' +
      'Frontend client code running in visitors\' browsers MUST ONLY use the public\n' +
      'anon or publishable key (starting with "sb_publishable_" or "eyJ...").\n\n' +
      'The build has been aborted immediately to protect your Supabase database from unauthorized access.\n' +
      'Replace the key with your project\'s public publishable/anon key from:\n' +
      'Supabase Dashboard -> Project Settings -> API -> Project API Keys -> "anon public".\n' +
      '====================================================================================\n'
    );
  }

  const allowUnconfigured = process.env.ALLOW_UNCONFIGURED_BUILD === 'true';
  const isMissing = !supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project');

  if (command === 'build') {
    if (isMissing) {
      if (allowUnconfigured) {
        console.warn(
          '\n⚠️  [Supabase Build Warning] Building without Supabase credentials (ALLOW_UNCONFIGURED_BUILD=true).\n' +
          'Static assets compiled into dist/ will require browser-level configuration on the live /admin page.\n'
        );
      } else {
        throw new Error(
          '\n\n====================================================================================\n' +
          '❌ [Supabase Build Error: Missing Production Credentials]\n' +
          '====================================================================================\n' +
          'Production Vite build cannot complete because Supabase credentials are not configured.\n\n' +
          'Why this happened:\n' +
          '  Your Cloudflare Worker serves static assets only (from ./dist).\n' +
          '  Runtime environment variables and Cloudflare dashboard secrets do NOT exist in the\n' +
          '  visitor\'s browser. Therefore, the public Supabase URL and publishable/anon key\n' +
          '  MUST be present during the Vite build so Vite can bake them into the static bundle.\n' +
          '  If Cloudflare UI "Build Variables" cannot be saved, supply them at build time.\n\n' +
          'How to configure and build reliably without Cloudflare runtime variables:\n' +
          '  Option 1 (Recommended): Create a `.env.production` or `.env` file in the project root:\n' +
          '    VITE_SUPABASE_URL="https://<your-project-id>.supabase.co"\n' +
          '    VITE_SUPABASE_ANON_KEY="<your-public-anon-key>"\n' +
          '    (Note: `.env*` is already in .gitignore, keeping your secrets safe from git commits)\n\n' +
          '  Option 2: Pass environment variables inline during build:\n' +
          '    VITE_SUPABASE_URL="https://..." VITE_SUPABASE_ANON_KEY="..." npm run build\n\n' +
          'How to deploy the corrected build to your existing Cloudflare Worker:\n' +
          '  1. Run the production build with credentials: npm run build\n' +
          '  2. Deploy the static assets in ./dist:        npx wrangler deploy\n\n' +
          'Security reminder:\n' +
          '  Use ONLY your public anon or sb_publishable key. NEVER provide the service-role key.\n' +
          '====================================================================================\n\n'
        );
      }
    } else {
      console.log(
        `\n✅ [Supabase Build Config] Verified: ${supabaseUrl} (Anon Key: ${supabaseKey.slice(0, 14)}...)\n` +
        `Credentials successfully verified and prepared for static bundle baking.\n`
      );
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    // Define baked-in build variables for reliable static-asset resolution
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
