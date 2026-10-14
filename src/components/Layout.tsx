import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/menuData';
import { useContent } from '../context/ContentContext';

export type PageRoute =
  | 'home'
  | 'menu'
  | 'story'
  | 'gallery'
  | 'reservations'
  | 'contact'
  | 'privacy'
  | 'cookies'
  | 'refunds'
  | 'terms'
  | 'accessibility'
  | 'admin';

interface LayoutProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenCookieModal: () => void;
  children: React.ReactNode;
}

const PRIMARY_NAV_ITEMS: { id: PageRoute; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'story', label: 'Our Story' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

const LEGAL_NAV_ITEMS: { id: PageRoute; label: string }[] = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'cookies', label: 'Cookie Policy' },
  { id: 'refunds', label: 'Refunds & Cancellations' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'accessibility', label: 'Accessibility' },
];

export const Layout: React.FC<LayoutProps> = ({
  currentPage,
  onNavigate,
  onOpenCookieModal,
  children,
}) => {
  const { restaurantConfig, appearance } = useContent();
  const config = restaurantConfig.name ? restaurantConfig : RESTAURANT_CONFIG;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change or Escape key
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock background page scroll when mobile menu is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, page: PageRoute) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141210] text-[#F4ECDA]">
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#C9A24B] focus:text-[#141210] focus:font-semibold focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Optional Top Announcement Banner (Configured from Admin Appearance) */}
      {appearance?.bannerActive && appearance?.bannerText && (
        <aside
          role="region"
          aria-label="Announcement"
          style={{ backgroundColor: appearance.accentColor || '#C9A24B' }}
          className="text-[#141210] py-2 px-4 text-center text-xs font-semibold z-50 flex items-center justify-center gap-2"
        >
          <span>{appearance.bannerText}</span>
          {appearance.bannerLink && (
            <a
              href={appearance.bannerLink}
              onClick={(e) => {
                const target = appearance.bannerLink.replace(/^#\/?/, '') as PageRoute;
                if (target) {
                  e.preventDefault();
                  onNavigate(target);
                }
              }}
              className="inline-flex items-center gap-1 underline text-[11px] font-bold hover:opacity-80"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </aside>
      )}

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 h-16 bg-[#141210]/95 backdrop-blur-md border-b border-[#332E26]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="shrink-0">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, 'home')}
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#F4ECDA] hover:text-[#C9A24B] transition-colors"
            >
              {config.name}
            </a>
          </div>

          {/* Zone 2: Centered desktop navigation links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#C9A24B] bg-[#1E1B17]'
                      : 'text-[#B8AD96] hover:text-[#F4ECDA] hover:bg-[#1E1B17]/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Exactly one primary CTA button + Mobile hamburger toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#reservations"
              onClick={(e) => handleLinkClick(e, 'reservations')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141210]"
            >
              Book a Table
            </a>

            {/* Accessible Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden p-2 text-[#B8AD96] hover:text-[#F4ECDA] hover:bg-[#1E1B17] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B]"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Accessible Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-16 z-40 bg-[#141210]/95 backdrop-blur-md md:hidden overflow-y-auto"
            id="mobile-navigation-drawer"
            aria-label="Mobile navigation"
          >
            <div className="p-6 space-y-4 max-w-sm mx-auto">
              <nav className="flex flex-col space-y-2">
                {PRIMARY_NAV_ITEMS.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleLinkClick(e, item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive
                          ? 'text-[#141210] bg-[#C9A24B] font-semibold'
                          : 'text-[#F4ECDA] hover:bg-[#1E1B17]'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
                <a
                  href="#reservations"
                  onClick={(e) => handleLinkClick(e, 'reservations')}
                  className="mt-2 w-full py-3.5 px-4 text-center text-sm font-semibold uppercase tracking-wider bg-[#C9A24B] text-[#141210] rounded-xl hover:bg-[#DFB85E] transition-colors"
                >
                  Book a Table
                </a>
              </nav>
              <div className="pt-6 border-t border-[#332E26] space-y-2 text-xs text-[#B8AD96]">
                <p className="text-[#F4ECDA] font-medium">{config.name}</p>
                <p>{config.address}</p>
                <p>{config.displayPhone}</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1E1B17] border-t border-[#332E26] text-[#B8AD96]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#332E26]">
            {/* Column 1: Brand & Tagline */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-[#F4ECDA]">{config.name}</h2>
              <p className="text-xs leading-relaxed text-[#B8AD96]">
                {config.tagline}
              </p>
              <div className="pt-2">
                <a
                  href="#reservations"
                  onClick={(e) => handleLinkClick(e, 'reservations')}
                  className="inline-flex items-center text-xs font-semibold text-[#C9A24B] hover:text-[#DFB85E] underline decoration-[#C9A24B]/40 underline-offset-4"
                >
                  Reserve Your Table Online →
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h2 className="font-display text-base font-semibold text-[#F4ECDA] mb-4">
                Explore Velquarath
              </h2>
              <ul className="space-y-2.5 text-sm">
                {[...PRIMARY_NAV_ITEMS, { id: 'reservations' as PageRoute, label: 'Reservations' }].map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleLinkClick(e, item.id)}
                      className="hover:text-[#C9A24B] transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Policies & Legal */}
            <div>
              <h2 className="font-display text-base font-semibold text-[#F4ECDA] mb-4">
                Policies &amp; Compliance
              </h2>
              <ul className="space-y-2.5 text-sm">
                {LEGAL_NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleLinkClick(e, item.id)}
                      className="hover:text-[#C9A24B] transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={onOpenCookieModal}
                    className="text-left hover:text-[#C9A24B] transition-colors underline decoration-[#332E26] underline-offset-4 cursor-pointer"
                  >
                    Manage Cookie Preferences
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Visit & Hours */}
            <div>
              <h2 className="font-display text-base font-semibold text-[#F4ECDA] mb-4">
                Visit &amp; Opening Hours
              </h2>
              <div className="space-y-2 text-xs leading-relaxed">
                <p className="text-[#F4ECDA] font-medium">{config.address}</p>
                <p>
                  Phone / WhatsApp:{' '}
                  {config.phone ? (
                    <a
                      href={`tel:+${config.phone}`}
                      className="text-[#C9A24B] hover:underline font-mono-num"
                    >
                      +{config.phone}
                    </a>
                  ) : (
                    <span className="text-[#B8AD96] italic">{config.displayPhone}</span>
                  )}
                </p>
                <div className="pt-2 space-y-1.5 border-t border-[#332E26]/60 mt-2">
                  {(config.hours || []).map((h) => (
                    <div key={h.days}>
                      <span className="text-[#F4ECDA] font-medium">{h.days}:</span>{' '}
                      <span className="text-[#B8AD96]">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8AD96]/80">
            <p>© {new Date().getFullYear()} {config.name}. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <span>Credit, Debit &amp; NFC Mobile Payments Accepted</span>
              <span aria-hidden="true">•</span>
              <span>Free Wheelchair-Accessible Parking</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
