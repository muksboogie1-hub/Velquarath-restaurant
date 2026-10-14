-- =====================================================================
-- VELQUARATH CAFE & RESTAURANT - PRODUCTION HARDENED SUPABASE SETUP
-- =====================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> click 'SQL Editor' on the left menu.
-- 3. Click 'New Query', paste this ENTIRE script, and click 'Run'.
-- This script safely creates all tables, policies, and the storage bucket.
-- It is idempotent: you can run it multiple times without errors.

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT,
    price TEXT,
    description TEXT,
    image TEXT,
    image_alt TEXT,
    dietary_or_note TEXT,
    featured BOOLEAN DEFAULT FALSE,
    coming_soon BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. RESTAURANT CONFIGURATION TABLE (Opening hours, address, phone, WhatsApp)
CREATE TABLE IF NOT EXISTS public.restaurant_config (
    id TEXT PRIMARY KEY DEFAULT 'main',
    name TEXT NOT NULL DEFAULT 'Velquarath Cafe',
    tagline TEXT DEFAULT 'Sticky ribs, sadza and bream, strong coffee and cold cocktails. Eat on the patio, watch the game, stay for the music.',
    phone TEXT DEFAULT '',
    display_phone TEXT DEFAULT 'Phone number to be confirmed by owner',
    email TEXT DEFAULT '',
    address TEXT DEFAULT 'Harare, Zimbabwe (Exact street address to be confirmed by owner)',
    city TEXT DEFAULT 'Harare',
    country TEXT DEFAULT 'Zimbabwe',
    hours JSONB DEFAULT '[
        {"days": "Monday – Thursday", "time": "08:00 – 22:00 (Breakfast, Brunch, Lunch & Dinner)"},
        {"days": "Friday – Saturday", "time": "08:00 – Late (Live Music, Sport & Late-Night Grill)"},
        {"days": "Sunday", "time": "08:30 – 21:00 (Sunday Brunch, Traditional Plates & Jazz)"}
    ]'::jsonb,
    social_instagram TEXT DEFAULT '',
    social_facebook TEXT DEFAULT '',
    social_tripadvisor TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. SITE CONTENT TABLE (Hero texts, story, vibe)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    hero_badge TEXT DEFAULT 'Off-the-Grill Meats • Traditional Zimbabwean Plates • Craft Cocktails • Live Music',
    hero_title TEXT DEFAULT 'Velquarath Cafe',
    hero_tagline TEXT DEFAULT 'Sticky ribs, sadza and bream, strong coffee and cold cocktails. Eat on the patio, watch the game, stay for the music.',
    story_headline TEXT DEFAULT 'The Velquarath Story',
    story_intro TEXT DEFAULT 'Velquarath Cafe was born from an unshakeable love for fire, hearty food, and Zimbabwean hospitality.',
    patio_tagline TEXT DEFAULT 'Eat on the covered patio, gather around the indoor fireplace, watch live sport on screen, or stay late for live music and cold cocktails.',
    vibe_highlights JSONB DEFAULT '[
        {"icon": "flame", "title": "Off the Charcoal Grill", "desc": "Smoky, fall-off-the-bone sticky pork ribs, charred BBQ quarter chicken, and tender ribeye steaks glazed in our signature sauce."},
        {"icon": "utensils", "title": "Traditional Mains & Hot Sadza", "desc": "Steaming hot white sadza served alongside slow-simmered oxtail & sugar beans, crispy whole Kariba bream, and organic road runner chicken."},
        {"icon": "music", "title": "Patio Vibes & Weekend Sessions", "desc": "Sit out on the covered patio, enjoy cold craft cocktails and frosty Zambezi lagers, watch the weekend match, and unwind with live music sets."}
    ]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. GALLERY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    caption TEXT,
    category TEXT NOT NULL,
    category_label TEXT,
    src TEXT NOT NULL,
    alt TEXT,
    span_wide BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. APPEARANCE SETTINGS TABLE (Announcement banner, colors)
CREATE TABLE IF NOT EXISTS public.appearance_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    banner_active BOOLEAN DEFAULT FALSE,
    banner_text TEXT DEFAULT 'Weekend Special: Full Rack Sticky Ribs with Complimentary Craft Beer!',
    banner_link TEXT DEFAULT '#menu',
    accent_color TEXT DEFAULT '#C9A24B',
    accent_hover TEXT DEFAULT '#DFB85E',
    custom_logo_url TEXT,
    custom_hero_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. RESERVATIONS TABLE (Real guest bookings)
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    reservation_date TEXT NOT NULL,
    reservation_time TEXT NOT NULL,
    party_size INTEGER NOT NULL,
    seating_area TEXT DEFAULT 'Any Available',
    special_notes TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'declined', 'completed'
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. AUTHORIZED ADMINISTRATOR WHITELIST TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin', -- 'owner', 'manager', 'admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & AUTHORIZATION FUNCTION
-- =====================================================================

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appearance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Security Definer function to check if the caller is an active verified administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid() AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Trigger function: automatically enrolls any registered auth user whose email exists in admin_users,
-- or automatically registers the very first user as the primary 'owner'
CREATE OR REPLACE FUNCTION public.handle_admin_auth_sync()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if email exists in admin_users and link user_id
    UPDATE public.admin_users
    SET user_id = NEW.id, updated_at = NOW()
    WHERE LOWER(email) = LOWER(NEW.email);

    -- If no admins exist at all in admin_users, automatically grant the first registered user 'owner' role
    IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE is_active = TRUE) THEN
        INSERT INTO public.admin_users (user_id, email, role, is_active)
        VALUES (NEW.id, NEW.email, 'owner', TRUE)
        ON CONFLICT (email) DO UPDATE SET user_id = NEW.id, is_active = TRUE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_admin_sync ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_sync
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_admin_auth_sync();

-- 1. PUBLIC READ POLICIES (Anyone can see menu, config, content, gallery, appearance)
DROP POLICY IF EXISTS "Public can view menu items" ON public.menu_items;
CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view restaurant config" ON public.restaurant_config;
CREATE POLICY "Public can view restaurant config" ON public.restaurant_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
CREATE POLICY "Public can view site content" ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view gallery items" ON public.gallery_items;
CREATE POLICY "Public can view gallery items" ON public.gallery_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view appearance settings" ON public.appearance_settings;
CREATE POLICY "Public can view appearance settings" ON public.appearance_settings FOR SELECT USING (true);

-- 2. PUBLIC RESERVATION SUBMISSION (Guests can submit bookings; CANNOT read others' bookings)
DROP POLICY IF EXISTS "Public can submit reservations" ON public.reservations;
CREATE POLICY "Public can submit reservations" ON public.reservations FOR INSERT WITH CHECK (true);

-- 3. ADMIN-ONLY POLICIES (Only authorized admins in public.admin_users can read/write protected tables)
DROP POLICY IF EXISTS "Admin full access to menu_items" ON public.menu_items;
CREATE POLICY "Admin full access to menu_items" ON public.menu_items FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access to restaurant_config" ON public.restaurant_config;
CREATE POLICY "Admin full access to restaurant_config" ON public.restaurant_config FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access to site_content" ON public.site_content;
CREATE POLICY "Admin full access to site_content" ON public.site_content FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access to gallery_items" ON public.gallery_items;
CREATE POLICY "Admin full access to gallery_items" ON public.gallery_items FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access to appearance_settings" ON public.appearance_settings;
CREATE POLICY "Admin full access to appearance_settings" ON public.appearance_settings FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access to reservations" ON public.reservations;
CREATE POLICY "Admin full access to reservations" ON public.reservations FOR ALL 
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access to admin_users" ON public.admin_users;
CREATE POLICY "Admin full access to admin_users" ON public.admin_users FOR ALL 
USING (public.is_admin() OR user_id = auth.uid()) WITH CHECK (public.is_admin() OR user_id = auth.uid());

-- =====================================================================
-- STORAGE BUCKET: restaurant-media (For food photos and hero banners)
-- =====================================================================

-- Create bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'restaurant-media', 
    'restaurant-media', 
    true, 
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
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

-- =====================================================================
-- INITIAL DEFAULT RECORDS & OWNER BOOTSTRAP
-- =====================================================================

INSERT INTO public.restaurant_config (id, name, tagline, display_phone, email, address, city, country)
VALUES (
    'main',
    'Velquarath Cafe',
    'Sticky ribs, sadza and bream, strong coffee and cold cocktails. Eat on the patio, watch the game, stay for the music.',
    'Phone number to be confirmed by owner',
    '',
    'Harare, Zimbabwe (Exact street address to be confirmed by owner)',
    'Harare',
    'Zimbabwe'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_content (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.appearance_settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- Pre-seed owner email into admin_users so current admin account is immediately active upon schema execution
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('velquarath@gmail.com', 'owner', TRUE)
ON CONFLICT (email) DO NOTHING;
