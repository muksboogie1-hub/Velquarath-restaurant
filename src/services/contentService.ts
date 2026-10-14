import { getSupabaseClient, isSupabaseConfigured, formatSupabaseError } from './supabase';
import { getCurrentAdminUser } from './authService';

export { formatSupabaseError };
import {
  MENU_ITEMS as DEFAULT_MENU_ITEMS,
  RESTAURANT_CONFIG as DEFAULT_RESTAURANT_CONFIG,
  MenuItem,
  RestaurantConfig,
} from '../data/menuData';
import { GALLERY_ITEMS as DEFAULT_GALLERY_ITEMS, GalleryItem } from '../data/galleryData';

export interface SiteContent {
  heroBadge: string;
  heroTitle: string;
  heroTagline: string;
  storyHeadline: string;
  storyIntro: string;
  patioTagline: string;
  announcementTitle?: string;
  announcementBody?: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroBadge: 'Off-the-Grill Meats • Traditional Zimbabwean Plates • Craft Cocktails • Live Music',
  heroTitle: 'Velquarath Cafe',
  heroTagline: 'Sticky ribs, sadza and bream, strong coffee and cold cocktails. Eat on the patio, watch the game, stay for the music.',
  storyHeadline: 'Fire, Tradition & The Sounds of Harare',
  storyIntro: 'Velquarath Cafe was born from an unshakeable love for fire, hearty food, and Zimbabwean hospitality. From flame-grilled sticky ribs to slow-simmered oxtail and sugar beans served with steaming white sadza, we cook food that brings people together.',
  patioTagline: 'Eat on the covered patio, gather around the indoor fireplace, watch live sport on screen, or stay late for live music and cold cocktails.',
};

export interface AppearanceSettings {
  bannerActive: boolean;
  bannerText: string;
  bannerLink: string;
  accentColor: string;
  accentHover: string;
  customLogoUrl?: string;
  customHeroUrl?: string;
}

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  bannerActive: false,
  bannerText: 'Weekend Special: Full Rack Sticky Ribs with Complimentary Craft Beer!',
  bannerLink: '#menu',
  accentColor: '#C9A24B',
  accentHover: '#DFB85E',
};

export interface ReservationRecord {
  id: string;
  guest_name: string;
  email?: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  seating_area: string;
  special_notes?: string;
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  admin_notes?: string;
  created_at: string;
}

const LOCAL_STORAGE_KEYS = {
  MENU: 'velquarath_content_menu',
  CONFIG: 'velquarath_content_config',
  CONTENT: 'velquarath_content_site',
  GALLERY: 'velquarath_content_gallery',
  APPEARANCE: 'velquarath_content_appearance',
  RESERVATIONS: 'velquarath_content_reservations',
};

/**
 * Checks whether the current user is signed in with a verified Supabase account.
 * When in Preview Sandbox Mode, admin write actions save locally rather than
 * dispatching unauthenticated requests to Supabase (which would fail with 401/404).
 */
async function isSupabaseSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const user = await getCurrentAdminUser();
    return Boolean(user && user.isSupabaseAuth);
  } catch {
    return false;
  }
}



// ============================================================================
// MENU MANAGEMENT
// ============================================================================

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('menu_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          name: d.name,
          category: d.category,
          categoryLabel: d.category_label || d.category,
          price: d.price || undefined,
          description: d.description || '',
          image: d.image || '',
          imageAlt: d.image_alt || d.name,
          dietaryOrNote: d.dietary_or_note || undefined,
          featured: Boolean(d.featured),
          comingSoon: Boolean(d.coming_soon),
          isAvailable: d.is_available !== false,
          displayOrder: d.display_order ?? 0,
        }));
      }
    } catch {
      // Tables may not exist yet in Supabase; fallback gracefully
    }
  }

  // Local fallback
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.MENU);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  return DEFAULT_MENU_ITEMS;
}

export async function saveMenuItem(item: MenuItem): Promise<{ success: boolean; error?: string }> {
  const hasLiveSession = await isSupabaseSession();
  const client = getSupabaseClient();

  // If in Preview Sandbox Mode, save directly to local storage
  if (!hasLiveSession || !client) {
    try {
      const current = await fetchMenuItems();
      const index = current.findIndex((i) => i.id === item.id);
      let updated: MenuItem[];
      if (index >= 0) {
        updated = [...current];
        updated[index] = item;
      } else {
        updated = [item, ...current];
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(updated));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to save to local sandbox' };
    }
  }

  // Real Supabase write
  try {
    const { error } = await client.from('menu_items').upsert(
      {
        id: item.id,
        name: item.name,
        category: item.category,
        category_label: item.categoryLabel,
        price: item.price || null,
        description: item.description || '',
        image: item.image || null,
        image_alt: item.imageAlt || item.name,
        dietary_or_note: item.dietaryOrNote || null,
        featured: Boolean(item.featured),
        coming_soon: Boolean(item.comingSoon),
        is_available: item.isAvailable !== false,
        display_order: item.displayOrder ?? 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      if (error.message?.includes('Could not find the table') || (error as any).code === 'PGRST205') {
        // Keep in local cache so user's work is not lost
        const current = await fetchMenuItems();
        const index = current.findIndex((i) => i.id === item.id);
        const updated = index >= 0 ? current.map((x) => (x.id === item.id ? item : x)) : [item, ...current];
        localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(updated));

        return {
          success: false,
          error:
            "Table 'menu_items' does not exist in your Supabase project yet. Please run 'supabase-schema.sql' in your Supabase SQL Editor. Your changes have been preserved locally in the meantime.",
        };
      }
      return { success: false, error: formatSupabaseError(error) };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network request failed' };
  }
}

export async function deleteMenuItem(id: string): Promise<{ success: boolean; error?: string }> {
  const hasLiveSession = await isSupabaseSession();
  const client = getSupabaseClient();

  if (hasLiveSession && client) {
    try {
      const { error } = await client.from('menu_items').delete().eq('id', id);
      if (error) {
        return { success: false, error: formatSupabaseError(error) };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Delete operation failed' };
    }
  }

  try {
    const current = await fetchMenuItems();
    const filtered = current.filter((i) => i.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(filtered));
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ============================================================================
// RESTAURANT CONFIG (Hours, Phone, Address)
// ============================================================================

export async function fetchRestaurantConfig(): Promise<RestaurantConfig> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('restaurant_config')
        .select('*')
        .eq('id', 'main')
        .single();

      if (!error && data) {
        return {
          name: data.name || DEFAULT_RESTAURANT_CONFIG.name,
          tagline: data.tagline || DEFAULT_RESTAURANT_CONFIG.tagline,
          phone: data.phone || '',
          displayPhone: data.display_phone || DEFAULT_RESTAURANT_CONFIG.displayPhone,
          email: data.email || '',
          address: data.address || DEFAULT_RESTAURANT_CONFIG.address,
          city: data.city || 'Harare',
          country: data.country || 'Zimbabwe',
          hours: data.hours || DEFAULT_RESTAURANT_CONFIG.hours,
          backendConfigured: true,
        };
      }
    } catch {
      // Table may not exist yet
    }
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.CONFIG);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  return DEFAULT_RESTAURANT_CONFIG;
}

export async function saveRestaurantConfig(config: RestaurantConfig): Promise<{ success: boolean; error?: string }> {
  const hasLiveSession = await isSupabaseSession();
  const client = getSupabaseClient();

  if (!hasLiveSession || !client) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CONFIG, JSON.stringify(config));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  try {
    const { error } = await client.from('restaurant_config').upsert(
      {
        id: 'main',
        name: config.name,
        tagline: config.tagline,
        phone: config.phone,
        display_phone: config.displayPhone,
        email: config.email,
        address: config.address,
        city: config.city,
        country: config.country,
        hours: config.hours,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CONFIG, JSON.stringify(config));
      return { success: false, error: formatSupabaseError(error) };
    }
    return { success: true };
  } catch (err: any) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CONFIG, JSON.stringify(config));
    return { success: false, error: err.message || 'Network request failed' };
  }
}

// ============================================================================
// WEBSITE CONTENT (Headlines, Story, Intro)
// ============================================================================

export async function fetchSiteContent(): Promise<SiteContent> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('site_content')
        .select('*')
        .eq('id', 'main')
        .single();

      if (!error && data) {
        return {
          heroBadge: data.hero_badge || DEFAULT_SITE_CONTENT.heroBadge,
          heroTitle: data.hero_title || DEFAULT_SITE_CONTENT.heroTitle,
          heroTagline: data.hero_tagline || DEFAULT_SITE_CONTENT.heroTagline,
          storyHeadline: data.story_headline || DEFAULT_SITE_CONTENT.storyHeadline,
          storyIntro: data.story_intro || DEFAULT_SITE_CONTENT.storyIntro,
          patioTagline: data.patio_tagline || DEFAULT_SITE_CONTENT.patioTagline,
        };
      }
    } catch {
      // Table may not exist yet
    }
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.CONTENT);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  return DEFAULT_SITE_CONTENT;
}

export async function saveSiteContent(content: SiteContent): Promise<{ success: boolean; error?: string }> {
  const hasLiveSession = await isSupabaseSession();
  const client = getSupabaseClient();

  if (!hasLiveSession || !client) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CONTENT, JSON.stringify(content));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  try {
    const { error } = await client.from('site_content').upsert(
      {
        id: 'main',
        hero_badge: content.heroBadge,
        hero_title: content.heroTitle,
        hero_tagline: content.heroTagline,
        story_headline: content.storyHeadline,
        story_intro: content.storyIntro,
        patio_tagline: content.patioTagline,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CONTENT, JSON.stringify(content));
      return { success: false, error: formatSupabaseError(error) };
    }
    return { success: true };
  } catch (err: any) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CONTENT, JSON.stringify(content));
    return { success: false, error: err.message || 'Network request failed' };
  }
}

// ============================================================================
// GALLERY ITEMS
// ============================================================================

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          caption: d.caption || '',
          category: d.category,
          categoryLabel: d.category_label || d.category,
          src: d.src,
          alt: d.alt || d.title,
          spanWide: Boolean(d.span_wide),
        }));
      }
    } catch {
      // Table may not exist yet
    }
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.GALLERY);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  return DEFAULT_GALLERY_ITEMS;
}

export async function saveGalleryItem(item: GalleryItem): Promise<{ success: boolean; error?: string }> {
  const hasLiveSession = await isSupabaseSession();
  const client = getSupabaseClient();

  if (!hasLiveSession || !client) {
    try {
      const current = await fetchGalleryItems();
      const index = current.findIndex((i) => i.id === item.id);
      let updated: GalleryItem[];
      if (index >= 0) {
        updated = [...current];
        updated[index] = item;
      } else {
        updated = [item, ...current];
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.GALLERY, JSON.stringify(updated));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  try {
    const { error } = await client.from('gallery_items').upsert(
      {
        id: item.id,
        title: item.title,
        caption: item.caption,
        category: item.category,
        category_label: item.categoryLabel,
        src: item.src,
        alt: item.alt,
        span_wide: Boolean(item.spanWide),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      return { success: false, error: formatSupabaseError(error) };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gallery item save failed' };
  }
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  const hasLiveSession = await isSupabaseSession();
  const client = getSupabaseClient();

  if (hasLiveSession && client) {
    try {
      const { error } = await client.from('gallery_items').delete().eq('id', id);
      if (error) return { success: false, error: formatSupabaseError(error) };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Delete operation failed' };
    }
  }

  try {
    const current = await fetchGalleryItems();
    const filtered = current.filter((i) => i.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.GALLERY, JSON.stringify(filtered));
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ============================================================================
// APPEARANCE SETTINGS
// ============================================================================

export async function fetchAppearanceSettings(): Promise<AppearanceSettings> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('appearance_settings')
        .select('*')
        .eq('id', 'main')
        .single();

      if (!error && data) {
        return {
          bannerActive: Boolean(data.banner_active),
          bannerText: data.banner_text || DEFAULT_APPEARANCE.bannerText,
          bannerLink: data.banner_link || DEFAULT_APPEARANCE.bannerLink,
          accentColor: data.accent_color || DEFAULT_APPEARANCE.accentColor,
          accentHover: data.accent_hover || DEFAULT_APPEARANCE.accentHover,
          customLogoUrl: data.custom_logo_url || undefined,
          customHeroUrl: data.custom_hero_url || undefined,
        };
      }
    } catch {
      // Table may not exist yet
    }
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.APPEARANCE);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  return DEFAULT_APPEARANCE;
}

export async function saveAppearanceSettings(settings: AppearanceSettings): Promise<{ success: boolean; error?: string }> {
  const hasLiveSession = await isSupabaseSession();
  const client = getSupabaseClient();

  if (!hasLiveSession || !client) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.APPEARANCE, JSON.stringify(settings));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  try {
    const { error } = await client.from('appearance_settings').upsert(
      {
        id: 'main',
        banner_active: settings.bannerActive,
        banner_text: settings.bannerText,
        banner_link: settings.bannerLink,
        accent_color: settings.accentColor,
        accent_hover: settings.accentHover,
        custom_logo_url: settings.customLogoUrl || null,
        custom_hero_url: settings.customHeroUrl || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.APPEARANCE, JSON.stringify(settings));
      return { success: false, error: formatSupabaseError(error) };
    }
    return { success: true };
  } catch (err: any) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPEARANCE, JSON.stringify(settings));
    return { success: false, error: err.message || 'Appearance save failed' };
  }
}

// ============================================================================
// RESERVATIONS (Real persistent booking storage)
// ============================================================================

export async function fetchReservations(): Promise<ReservationRecord[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as ReservationRecord[];
      }
    } catch {
      // Table may not exist yet
    }
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.RESERVATIONS);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  return [];
}

export async function submitReservation(data: {
  guestName: string;
  email?: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  seatingArea: string;
  notes?: string;
}): Promise<{ success: boolean; id: string }> {
  const client = getSupabaseClient();
  const newId = 'res_' + Date.now();

  if (client) {
    try {
      const { data: inserted, error } = await client
        .from('reservations')
        .insert({
          guest_name: data.guestName,
          email: data.email || null,
          phone: data.phone,
          reservation_date: data.date,
          reservation_time: data.time,
          party_size: data.partySize,
          seating_area: data.seatingArea,
          special_notes: data.notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (!error && inserted) {
        return { success: true, id: inserted.id };
      }
    } catch {
      // fallback
    }
  }

  try {
    const list = await fetchReservations();
    const record: ReservationRecord = {
      id: newId,
      guest_name: data.guestName,
      email: data.email,
      phone: data.phone,
      reservation_date: data.date,
      reservation_time: data.time,
      party_size: data.partySize,
      seating_area: data.seatingArea,
      special_notes: data.notes,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    list.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
    return { success: true, id: newId };
  } catch {
    return { success: false, id: '' };
  }
}

export async function updateReservationStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'declined' | 'completed',
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const hasLiveSession = await isSupabaseSession();
  const client = getSupabaseClient();

  if (hasLiveSession && client) {
    try {
      const updatePayload: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (adminNotes !== undefined) {
        updatePayload.admin_notes = adminNotes;
      }
      const { error } = await client.from('reservations').update(updatePayload).eq('id', id);
      if (error) {
        return { success: false, error: formatSupabaseError(error) };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update reservation status' };
    }
  }

  try {
    const list = await fetchReservations();
    const index = list.findIndex((r) => r.id === id);
    if (index >= 0) {
      list[index].status = status;
      if (adminNotes !== undefined) list[index].admin_notes = adminNotes;
      localStorage.setItem(LOCAL_STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
      return { success: true };
    }
  } catch (e: any) {
    return { success: false, error: e.message };
  }

  return { success: false, error: 'Reservation record not found' };
}

// ============================================================================
// IMAGE UPLOAD (Supabase Storage bucket 'restaurant-media' with safe fallback)
// ============================================================================

export async function uploadImage(file: File): Promise<{ url: string; error?: string }> {
  // Read local file as Data URL preview
  const readDataUrl = (): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });

  const previewUrl = await readDataUrl();
  const hasLiveSession = await isSupabaseSession();
  const client = getSupabaseClient();

  // If in Preview Sandbox Mode (or client missing), save directly as local preview URL
  if (!hasLiveSession || !client) {
    return { url: previewUrl };
  }

  // Live Supabase Authenticated Session: upload to 'restaurant-media' bucket
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await client.storage
      .from('restaurant-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      // If bucket is not found, attempt to create it automatically
      const isMissingBucket =
        error.message?.toLowerCase().includes('bucket not found') ||
        (error as any).statusCode === '404' ||
        (error as any).error?.toLowerCase?.().includes('bucket not found');

      if (isMissingBucket) {
        try {
          const { error: createErr } = await client.storage.createBucket('restaurant-media', {
            public: true,
          });
          if (!createErr) {
            const retry = await client.storage.from('restaurant-media').upload(filePath, file);
            if (!retry.error && retry.data) {
              const { data: retryPub } = client.storage
                .from('restaurant-media')
                .getPublicUrl(retry.data.path);
              return { url: retryPub.publicUrl };
            }
          }
        } catch {
          // creation failed or disallowed
        }
        return {
          url: previewUrl,
          error:
            "Storage bucket 'restaurant-media' not found in your Supabase project. Please create a public bucket named 'restaurant-media' in your Supabase Dashboard (Storage -> New Bucket), or run 'supabase-schema.sql' in the SQL Editor. In the meantime, your photo is saved locally for preview.",
        };
      }

      return {
        url: previewUrl,
        error: formatSupabaseError(error),
      };
    }

    const { data: publicUrlData } = client.storage
      .from('restaurant-media')
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  } catch (err: any) {
    return {
      url: previewUrl,
      error: err.message || 'Supabase storage upload error. Preview preserved locally.',
    };
  }
}

// ============================================================================
// ONE-CLICK SEED TO SUPABASE
// ============================================================================

export async function seedInitialMenuToSupabase(): Promise<{ count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { count: 0, error: 'Supabase is not configured yet. Please enter your credentials first.' };
  }

  const user = await getCurrentAdminUser();
  if (!user?.isSupabaseAuth) {
    return {
      count: 0,
      error: 'You must be signed in with a real Supabase admin account to seed cloud tables. Please log in with Supabase first.',
    };
  }

  try {
    // 1. Seed Menu Items
    const rows = DEFAULT_MENU_ITEMS.map((item, index) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      category_label: item.categoryLabel,
      price: item.price || null,
      description: item.description || '',
      image: item.image || null,
      image_alt: item.imageAlt || item.name,
      dietary_or_note: item.dietaryOrNote || null,
      featured: Boolean(item.featured),
      coming_soon: Boolean(item.comingSoon),
      is_available: true,
      display_order: index,
    }));

    const { error: menuErr } = await client.from('menu_items').upsert(rows, { onConflict: 'id' });
    if (menuErr) {
      if (menuErr.message?.includes('Could not find the table') || (menuErr as any).code === 'PGRST205') {
        return {
          count: 0,
          error:
            "Could not find table 'menu_items' in Supabase. Please open your Supabase Dashboard -> SQL Editor and execute 'supabase-schema.sql' first.",
        };
      }
      throw menuErr;
    }

    // 2. Seed Restaurant Config
    const { error: cfgErr } = await client.from('restaurant_config').upsert(
      {
        id: 'main',
        name: DEFAULT_RESTAURANT_CONFIG.name,
        tagline: DEFAULT_RESTAURANT_CONFIG.tagline,
        phone: DEFAULT_RESTAURANT_CONFIG.phone,
        display_phone: DEFAULT_RESTAURANT_CONFIG.displayPhone,
        email: DEFAULT_RESTAURANT_CONFIG.email,
        address: DEFAULT_RESTAURANT_CONFIG.address,
        city: DEFAULT_RESTAURANT_CONFIG.city,
        country: DEFAULT_RESTAURANT_CONFIG.country,
        hours: DEFAULT_RESTAURANT_CONFIG.hours,
      },
      { onConflict: 'id' }
    );
    if (cfgErr) throw cfgErr;

    // 3. Seed Site Content
    const { error: siteErr } = await client.from('site_content').upsert(
      {
        id: 'main',
        hero_badge: DEFAULT_SITE_CONTENT.heroBadge,
        hero_title: DEFAULT_SITE_CONTENT.heroTitle,
        hero_tagline: DEFAULT_SITE_CONTENT.heroTagline,
        story_headline: DEFAULT_SITE_CONTENT.storyHeadline,
        story_intro: DEFAULT_SITE_CONTENT.storyIntro,
        patio_tagline: DEFAULT_SITE_CONTENT.patioTagline,
      },
      { onConflict: 'id' }
    );
    if (siteErr) throw siteErr;

    // 4. Seed Gallery
    const galleryRows = DEFAULT_GALLERY_ITEMS.map((g, index) => ({
      id: g.id,
      title: g.title,
      caption: g.caption,
      category: g.category,
      category_label: g.categoryLabel,
      src: g.src,
      alt: g.alt,
      span_wide: Boolean(g.spanWide),
      display_order: index,
    }));
    const { error: galErr } = await client.from('gallery_items').upsert(galleryRows, { onConflict: 'id' });
    if (galErr) throw galErr;

    return { count: rows.length };
  } catch (err: any) {
    return { count: 0, error: formatSupabaseError(err) };
  }
}

// ============================================================================
// SYSTEM HEALTH DIAGNOSTIC
// ============================================================================

export interface SupabaseHealthReport {
  configured: boolean;
  userAuthenticated: boolean;
  adminAuthorized: boolean;
  menuTable: boolean;
  configTable: boolean;
  adminTable: boolean;
  storageBucket: boolean;
  error?: string;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealthReport> {
  const client = getSupabaseClient();
  const user = await getCurrentAdminUser();
  const report: SupabaseHealthReport = {
    configured: isSupabaseConfigured(),
    userAuthenticated: Boolean(user?.isSupabaseAuth),
    adminAuthorized: false,
    menuTable: false,
    configTable: false,
    adminTable: false,
    storageBucket: false,
  };

  if (!client || !report.configured) {
    return report;
  }

  try {
    const { error: mErr } = await client.from('menu_items').select('id').limit(1);
    report.menuTable = !mErr;

    const { error: cErr } = await client.from('restaurant_config').select('id').limit(1);
    report.configTable = !cErr;

    const { error: aErr } = await client.from('admin_users').select('id').limit(1);
    report.adminTable = !aErr;

    if (user?.id) {
      try {
        const { data: adminRecord } = await client
          .from('admin_users')
          .select('id, user_id, is_active')
          .eq('user_id', user.id)
          .maybeSingle();

        report.adminAuthorized = Boolean(adminRecord && adminRecord.is_active);
      } catch {
        // ignore
      }
    }

    const { data: buckets } = await client.storage.listBuckets();
    report.storageBucket = Boolean(
      buckets?.some((b) => b.id === 'restaurant-media' || b.name === 'restaurant-media')
    );
  } catch (err: any) {
    report.error = err.message || 'Health check error';
  }

  return report;
}
