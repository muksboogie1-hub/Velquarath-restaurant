import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MenuItem,
  RestaurantConfig,
} from '../data/menuData';
import { GalleryItem } from '../data/galleryData';
import {
  SiteContent,
  AppearanceSettings,
  ReservationRecord,
  DEFAULT_SITE_CONTENT,
  DEFAULT_APPEARANCE,
  fetchMenuItems,
  saveMenuItem,
  deleteMenuItem,
  fetchRestaurantConfig,
  saveRestaurantConfig,
  fetchSiteContent,
  saveSiteContent,
  fetchGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  fetchAppearanceSettings,
  saveAppearanceSettings,
  fetchReservations,
  submitReservation,
  updateReservationStatus,
} from '../services/contentService';
import { AdminUser, getCurrentAdminUser } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabase';

interface ContentContextType {
  menuItems: MenuItem[];
  restaurantConfig: RestaurantConfig;
  siteContent: SiteContent;
  galleryItems: GalleryItem[];
  appearance: AppearanceSettings;
  reservations: ReservationRecord[];
  currentUser: AdminUser | null;
  loading: boolean;
  isSupabaseActive: boolean;
  refreshAll: () => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<boolean>;
  removeMenuItem: (id: string) => Promise<boolean>;
  updateConfig: (cfg: RestaurantConfig) => Promise<boolean>;
  updateContent: (content: SiteContent) => Promise<boolean>;
  updateAppearance: (app: AppearanceSettings) => Promise<boolean>;
  addGalleryItem: (item: GalleryItem) => Promise<boolean>;
  removeGalleryItem: (id: string) => Promise<boolean>;
  bookReservation: (data: {
    guestName: string;
    email?: string;
    phone: string;
    date: string;
    time: string;
    partySize: number;
    seatingArea: string;
    notes?: string;
  }) => Promise<{ success: boolean; id: string }>;
  changeReservationStatus: (
    id: string,
    status: 'pending' | 'confirmed' | 'declined' | 'completed',
    notes?: string
  ) => Promise<boolean>;
  setCurrentUser: (user: AdminUser | null) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig>({} as RestaurantConfig);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [appearance, setAppearance] = useState<AppearanceSettings>(DEFAULT_APPEARANCE);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);

  const refreshAll = async () => {
    try {
      setIsSupabaseActive(isSupabaseConfigured());
      const [m, cfg, c, g, app, res, u] = await Promise.all([
        fetchMenuItems(),
        fetchRestaurantConfig(),
        fetchSiteContent(),
        fetchGalleryItems(),
        fetchAppearanceSettings(),
        fetchReservations(),
        getCurrentAdminUser(),
      ]);
      setMenuItems(m);
      setRestaurantConfig(cfg);
      setSiteContent(c);
      setGalleryItems(g);
      setAppearance(app);
      setReservations(res);
      setCurrentUser(u);
    } catch (e) {
      console.error('Error loading content:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleUpdateMenuItem = async (item: MenuItem): Promise<boolean> => {
    const res = await saveMenuItem(item);
    if (res.success) {
      setMenuItems((prev) => {
        const idx = prev.findIndex((i) => i.id === item.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = item;
          return next;
        }
        return [item, ...prev];
      });
      return true;
    }
    return false;
  };

  const handleRemoveMenuItem = async (id: string): Promise<boolean> => {
    const ok = await deleteMenuItem(id);
    if (ok) {
      setMenuItems((prev) => prev.filter((i) => i.id !== id));
    }
    return ok;
  };

  const handleUpdateConfig = async (cfg: RestaurantConfig): Promise<boolean> => {
    const res = await saveRestaurantConfig(cfg);
    if (res.success) setRestaurantConfig(cfg);
    return res.success;
  };

  const handleUpdateContent = async (content: SiteContent): Promise<boolean> => {
    const res = await saveSiteContent(content);
    if (res.success) setSiteContent(content);
    return res.success;
  };

  const handleUpdateAppearance = async (app: AppearanceSettings): Promise<boolean> => {
    const res = await saveAppearanceSettings(app);
    if (res.success) setAppearance(app);
    return res.success;
  };

  const handleAddGalleryItem = async (item: GalleryItem): Promise<boolean> => {
    const res = await saveGalleryItem(item);
    if (res.success) {
      setGalleryItems((prev) => {
        const idx = prev.findIndex((i) => i.id === item.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = item;
          return next;
        }
        return [item, ...prev];
      });
      return true;
    }
    return false;
  };

  const handleRemoveGalleryItem = async (id: string): Promise<boolean> => {
    const ok = await deleteGalleryItem(id);
    if (ok) {
      setGalleryItems((prev) => prev.filter((i) => i.id !== id));
    }
    return ok;
  };

  const handleBookReservation = async (data: {
    guestName: string;
    email?: string;
    phone: string;
    date: string;
    time: string;
    partySize: number;
    seatingArea: string;
    notes?: string;
  }) => {
    const res = await submitReservation(data);
    if (res.success) {
      const refreshed = await fetchReservations();
      setReservations(refreshed);
    }
    return res;
  };

  const handleChangeReservationStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'declined' | 'completed',
    notes?: string
  ): Promise<boolean> => {
    const ok = await updateReservationStatus(id, status, notes);
    if (ok) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status, admin_notes: notes !== undefined ? notes : r.admin_notes } : r
        )
      );
    }
    return ok;
  };

  return (
    <ContentContext.Provider
      value={{
        menuItems,
        restaurantConfig,
        siteContent,
        galleryItems,
        appearance,
        reservations,
        currentUser,
        loading,
        isSupabaseActive,
        refreshAll,
        updateMenuItem: handleUpdateMenuItem,
        removeMenuItem: handleRemoveMenuItem,
        updateConfig: handleUpdateConfig,
        updateContent: handleUpdateContent,
        updateAppearance: handleUpdateAppearance,
        addGalleryItem: handleAddGalleryItem,
        removeGalleryItem: handleRemoveGalleryItem,
        bookReservation: handleBookReservation,
        changeReservationStatus: handleChangeReservationStatus,
        setCurrentUser,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
};
