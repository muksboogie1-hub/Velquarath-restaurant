import React, { useState, useEffect } from 'react';
import { Layout, PageRoute } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { StoryPage } from './pages/StoryPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ContactPage } from './pages/ContactPage';
import {
  PrivacyPage,
  CookiePage,
  RefundsPage,
  TermsPage,
  AccessibilityPage,
} from './pages/LegalPages';
import {
  CookieConsentManager,
  CookieConsentState,
  getStoredCookieConsent,
} from './components/CookieConsentManager';
import { RESTAURANT_CONFIG } from './data/menuData';
import { ContentProvider, useContent } from './context/ContentContext';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';

const VALID_ROUTES: PageRoute[] = [
  'home',
  'menu',
  'story',
  'gallery',
  'reservations',
  'contact',
  'privacy',
  'cookies',
  'refunds',
  'terms',
  'accessibility',
  'admin',
];

function resolveInitialRoute(): PageRoute {
  // Check hash first (e.g. #admin, #menu)
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase();
  if (VALID_ROUTES.includes(hash as PageRoute)) {
    return hash as PageRoute;
  }

  // Check pathname (e.g. /admin, /menu)
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/^\/+|\/+$/g, '').toLowerCase();
  let path = window.location.pathname
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.html$/i, '')
    .toLowerCase();

  if (baseUrl && path.startsWith(baseUrl)) {
    path = path.slice(baseUrl.length).replace(/^\/+/, '');
  }

  if (path === 'index' || path === '') return 'home';
  if (VALID_ROUTES.includes(path as PageRoute)) {
    return path as PageRoute;
  }

  return 'home';
}

function MainApp() {
  const { restaurantConfig, currentUser } = useContent();
  const config = restaurantConfig?.name ? restaurantConfig : RESTAURANT_CONFIG;

  const [currentPage, setCurrentPage] = useState<PageRoute>(resolveInitialRoute);
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string | undefined>(undefined);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsentState>(() =>
    getStoredCookieConsent()
  );

  useEffect(() => {
    const handleHashChange = () => {
      const next = resolveInitialRoute();
      setCurrentPage(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const pageTitles: Record<PageRoute, string> = {
      home: `${config.name} | Fire-Grilled Meats, Traditional Zimbabwean Cuisine & Craft Cocktails`,
      menu: `Menu | ${config.name} – Grill, Traditional Mains, Sadza, Brunch & Cocktails`,
      story: `Our Story & Vibe | ${config.name}`,
      gallery: `Food & Venue Gallery | ${config.name}`,
      reservations: `Book a Table | ${config.name}`,
      contact: `Contact & Opening Hours | ${config.name}`,
      privacy: `Privacy Policy | ${config.name}`,
      cookies: `Cookie Policy & Preferences | ${config.name}`,
      refunds: `Refund & Cancellation Policy | ${config.name}`,
      terms: `Terms & Conditions | ${config.name}`,
      accessibility: `Accessibility Statement | ${config.name}`,
      admin: `Admin Dashboard | ${config.name}`,
    };
    document.title = pageTitles[currentPage] || pageTitles.home;
  }, [currentPage, config.name]);

  const handleNavigate = (page: PageRoute, category?: string) => {
    if (category) {
      setMenuCategoryFilter(category);
    } else if (page !== 'menu') {
      setMenuCategoryFilter(undefined);
    }
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState(null, '', `#${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ADMIN VIEW: Isolated from public navigation
  if (currentPage === 'admin') {
    if (currentUser) {
      return (
        <AdminLayout
          onNavigateHome={() => handleNavigate('home')}
          onLogout={() => handleNavigate('home')}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={() => handleNavigate('admin')}
        onBackToSite={() => handleNavigate('home')}
      />
    );
  }

  // PUBLIC WEBSITE VIEW
  return (
    <Layout
      currentPage={currentPage}
      onNavigate={(page) => handleNavigate(page)}
      onOpenCookieModal={() => setCookieModalOpen(true)}
    >
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'menu' && (
        <MenuPage
          initialCategory={menuCategoryFilter}
          onNavigate={(page) => handleNavigate(page)}
        />
      )}
      {currentPage === 'story' && (
        <StoryPage onNavigate={(page) => handleNavigate(page)} />
      )}
      {currentPage === 'gallery' && (
        <GalleryPage onNavigate={(page) => handleNavigate(page)} />
      )}
      {currentPage === 'reservations' && (
        <ReservationsPage onNavigate={(page) => handleNavigate(page)} />
      )}
      {currentPage === 'contact' && (
        <ContactPage onNavigate={(page) => handleNavigate(page)} />
      )}
      {currentPage === 'privacy' && (
        <PrivacyPage onNavigate={(page) => handleNavigate(page)} />
      )}
      {currentPage === 'cookies' && (
        <CookiePage
          onNavigate={(page) => handleNavigate(page)}
          consent={cookieConsent}
          onUpdateConsent={setCookieConsent}
          onOpenCookieModal={() => setCookieModalOpen(true)}
        />
      )}
      {currentPage === 'refunds' && (
        <RefundsPage onNavigate={(page) => handleNavigate(page)} />
      )}
      {currentPage === 'terms' && (
        <TermsPage onNavigate={(page) => handleNavigate(page)} />
      )}
      {currentPage === 'accessibility' && (
        <AccessibilityPage onNavigate={(page) => handleNavigate(page)} />
      )}

      <CookieConsentManager
        isOpen={cookieModalOpen}
        onClose={() => setCookieModalOpen(false)}
        onNavigateCookiePolicy={() => handleNavigate('cookies')}
        consent={cookieConsent}
        onUpdateConsent={setCookieConsent}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <MainApp />
    </ContentProvider>
  );
}
