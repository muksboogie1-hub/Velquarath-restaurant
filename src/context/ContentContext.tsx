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

export interface OperationResult {
  success: boolean;
  error?: string;
}

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
  initialLoadError: string | null;
  isOfflineFallback: boolean;
  dismissOfflineFallback: () => void;
  refreshAll: () => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<OperationResult>;
  removeMenuItem: (id: string) => Promise<OperationResult>;
  updateConfig: (cfg: RestaurantConfig) => Promise<OperationResult>;
  updateContent: (content: SiteContent) => Promise<OperationResult>;
  updateAppearance: (app: AppearanceSettings) => Promise<OperationResult>;
  addGalleryItem: (item: GalleryItem) => Promise<OperationResult>;
  removeGalleryItem: (id: string) => Promise<OperationResult>;
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
  ) => Promise<OperationResult>;
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
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);

  const refreshAll = async () => {
    setLoading(true);
    setInitialLoadError(null);
    const configured = isSupabaseConfigured();
    setIsSupabaseActive(configured);

    if (!configured) {
      // Preview Sandbox / Unconfigured mode: display fallback without error
      setIsOfflineFallback(true);
      setLoading(false);
      return;
    }

    try {
      const fetchPromise = Promise.all([
        fetchMenuItems(),
        fetchRestaurantConfig(),
        fetchSiteContent(),
        fetchGalleryItems(),
        fetchAppearanceSettings(),
        fetchReservations(),
        getCurrentAdminUser(),
      ]);

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                'Connection to live restaurant database timed out. Network may be slow or unavailable.'
              )
            ),
          7500
        )
      );

      const [m, cfg, c, g, app, res, u] = await Promise.race([fetchPromise, timeoutPromise]);
      setMenuItems(m);
      setRestaurantConfig(cfg);
      setSiteContent(c);
      setGalleryItems(g);
      setAppearance(app);
      setReservations(res);
      setCurrentUser(u);
      setIsOfflineFallback(false);
      setInitialLoadError(null);
    } catch (e: any) {
      console.error('Error loading content from Supabase:', e);
      setInitialLoadError(
        e?.message || 'Unable to connect to live restaurant database. Daily board and pricing may be unavailable.'
      );
    } finally {
      setLoading(false);
    }
  };

  const dismissOfflineFallback = () => {
    setIsOfflineFallback(true);
    setInitialLoadError(null);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleUpdateMenuItem = async (item: MenuItem): Promise<OperationResult> => {
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
    }
    return res;
  };

  const handleRemoveMenuItem = async (id: string): Promise<OperationResult> => {
    const res = await deleteMenuItem(id);
    if (res.success) {
      setMenuItems((prev) => prev.filter((i) => i.id !== id));
    }
    return res;
  };

  const handleUpdateConfig = async (cfg: RestaurantConfig): Promise<OperationResult> => {
    const res = await saveRestaurantConfig(cfg);
    if (res.success) setRestaurantConfig(cfg);
    return res;
  };

  const handleUpdateContent = async (content: SiteContent): Promise<OperationResult> => {
    const res = await saveSiteContent(content);
    if (res.success) setSiteContent(content);
    return res;
  };

  const handleUpdateAppearance = async (app: AppearanceSettings): Promise<OperationResult> => {
    const res = await saveAppearanceSettings(app);
    if (res.success) setAppearance(app);
    return res;
  };

  const handleAddGalleryItem = async (item: GalleryItem): Promise<OperationResult> => {
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
    }
    return res;
  };

  const handleRemoveGalleryItem = async (id: string): Promise<OperationResult> => {
    const res = await deleteGalleryItem(id);
    if (res.success) {
      setGalleryItems((prev) => prev.filter((i) => i.id !== id));
    }
    return res;
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
  ): Promise<OperationResult> => {
    const res = await updateReservationStatus(id, status, notes);
    if (res.success) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status, admin_notes: notes !== undefined ? notes : r.admin_notes } : r
        )
      );
    }
    return res;
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
        initialLoadError,
        isOfflineFallback,
        dismissOfflineFallback,
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
