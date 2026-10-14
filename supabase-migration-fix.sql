-- =====================================================================
-- VELQUARATH CAFE & RESTAURANT - DATABASE MIGRATION & RLS REPAIR SCRIPT
-- =====================================================================
-- Target: Fixes PostgreSQL RLS permission error 42501 on save operations
-- Idempotent: Safe to review and run multiple times in Supabase SQL Editor.
-- =====================================================================

-- 1. Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure public.admin_users whitelist table exists
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin', -- 'owner', 'manager', 'admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Security Definer authorization function: public.is_admin()
-- Validates caller against public.admin_users using either direct user_id link
-- OR cryptographically verified JWT email. Fixed search_path prevents search-path hijacking.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE (
            user_id = auth.uid()
            OR (
                (auth.jwt() ->> 'email') IS NOT NULL
                AND LOWER(email) = LOWER(auth.jwt() ->> 'email')
            )
        )
        AND is_active = TRUE
    );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 4. Corrected self-healing administrator sync function: public.sync_current_admin()
-- Assigns ROW_COUNT to an integer variable and returns whether affected rows > 0.
-- Callable by authenticated users to associate their Supabase auth UID with their whitelisted record.
CREATE OR REPLACE FUNCTION public.sync_current_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_affected_rows integer;
BEGIN
    IF auth.uid() IS NULL OR (auth.jwt() ->> 'email') IS NULL THEN
        RETURN FALSE;
    END IF;

    UPDATE public.admin_users
    SET user_id = auth.uid(), updated_at = NOW()
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
      AND (user_id IS NULL OR user_id <> auth.uid())
      AND is_active = TRUE;

    GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
    RETURN v_affected_rows > 0;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_current_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.sync_current_admin() TO authenticated;

-- 5. Trigger function: public.handle_admin_auth_sync()
-- Automatically associates user_id when an approved admin registers.
-- Strictly NO automatic promotion of arbitrary first users.
CREATE OR REPLACE FUNCTION public.handle_admin_auth_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Strictly associate user_id only if email already exists in approved admin_users whitelist
    UPDATE public.admin_users
    SET user_id = NEW.id, updated_at = NOW()
    WHERE LOWER(email) = LOWER(NEW.email)
      AND is_active = TRUE;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_admin_sync ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_sync
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_admin_auth_sync();

-- 6. Ensure approved administrator allowlist records exist
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('velquarath@gmail.com', 'owner', TRUE)
ON CONFLICT (email) DO UPDATE SET is_active = TRUE;

INSERT INTO public.admin_users (email, role, is_active)
VALUES ('codictobi@gmail.com', 'owner', TRUE)
ON CONFLICT (email) DO UPDATE SET is_active = TRUE;

-- 7. Safely link any already-registered Supabase auth users to their admin_users rows
UPDATE public.admin_users a
SET user_id = u.id, updated_at = NOW()
FROM auth.users u
WHERE LOWER(a.email) = LOWER(u.email)
  AND (a.user_id IS NULL OR a.user_id <> u.id)
  AND a.is_active = TRUE;

-- 8. Refresh Row Level Security policies on all tables
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appearance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Menu Items
DROP POLICY IF EXISTS "Public can view menu items" ON public.menu_items;
CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to menu_items" ON public.menu_items;
CREATE POLICY "Admin full access to menu_items" ON public.menu_items FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Restaurant Config
DROP POLICY IF EXISTS "Public can view restaurant config" ON public.restaurant_config;
CREATE POLICY "Public can view restaurant config" ON public.restaurant_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to restaurant_config" ON public.restaurant_config;
CREATE POLICY "Admin full access to restaurant_config" ON public.restaurant_config FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Site Content
DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
CREATE POLICY "Public can view site content" ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to site_content" ON public.site_content;
CREATE POLICY "Admin full access to site_content" ON public.site_content FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Gallery Items
DROP POLICY IF EXISTS "Public can view gallery items" ON public.gallery_items;
CREATE POLICY "Public can view gallery items" ON public.gallery_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to gallery_items" ON public.gallery_items;
CREATE POLICY "Admin full access to gallery_items" ON public.gallery_items FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Appearance Settings
DROP POLICY IF EXISTS "Public can view appearance settings" ON public.appearance_settings;
CREATE POLICY "Public can view appearance settings" ON public.appearance_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to appearance_settings" ON public.appearance_settings;
CREATE POLICY "Admin full access to appearance_settings" ON public.appearance_settings FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Reservations
DROP POLICY IF EXISTS "Public can submit reservations" ON public.reservations;
CREATE POLICY "Public can submit reservations" ON public.reservations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access to reservations" ON public.reservations;
CREATE POLICY "Admin full access to reservations" ON public.reservations FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Admin Users Policies (Self-inspection & Admin Management)
DROP POLICY IF EXISTS "Admin full access to admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin view own or all admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin modify admin_users" ON public.admin_users;

CREATE POLICY "Admin view own or all admin_users" ON public.admin_users FOR SELECT 
USING (public.is_admin() OR user_id = auth.uid() OR LOWER(email) = LOWER(auth.jwt() ->> 'email'));

CREATE POLICY "Admin modify admin_users" ON public.admin_users FOR ALL 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- 9. Storage Policies for restaurant-media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'restaurant-media', 
    'restaurant-media', 
    true, 
    52428800, 
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read restaurant-media" ON storage.objects;
CREATE POLICY "Public can read restaurant-media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'restaurant-media');

DROP POLICY IF EXISTS "Admin can upload to restaurant-media" ON storage.objects;
CREATE POLICY "Admin can upload to restaurant-media" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'restaurant-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can update restaurant-media" ON storage.objects;
CREATE POLICY "Admin can update restaurant-media" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'restaurant-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can delete from restaurant-media" ON storage.objects;
CREATE POLICY "Admin can delete from restaurant-media" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'restaurant-media' AND public.is_admin());
