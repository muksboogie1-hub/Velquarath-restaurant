import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/menuData';

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
  | 'accessibility';

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

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 h-16 bg-[#141210]/95 backdrop-blur-md border-b border-[#332E26]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, 'home')}
            className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#F4ECDA] hover:text-[#C9A24B] transition-colors whitespace-nowrap shrink-0"
          >
            {RESTAURANT_CONFIG.name}
          </a>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7 text-sm font-medium">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'text-[#C9A24B] border-[#C9A24B] font-semibold'
                      : 'text-[#B8AD96] border-transparent hover:text-[#F4ECDA] hover:border-[#332E26]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#reservations"
              onClick={(e) => handleLinkClick(e, 'reservations')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors whitespace-nowrap shrink-0"
            >
              Book a Table
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden p-2.5 text-[#F4ECDA] hover:text-[#C9A24B] rounded-lg border border-[#332E26] bg-[#1E1B17]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Accessible Mobile Menu Drawer with Independent Scroll & Backdrop Lock */}
        {mobileMenuOpen && (
          <>
            <div
              aria-hidden="true"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-black/65 backdrop-blur-xs z-40"
            />
            <nav
              id="mobile-navigation-drawer"
              aria-label="Mobile navigation"
              className="md:hidden fixed inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain z-50 bg-[#1E1B17] border-b border-[#332E26] px-4 pt-3 pb-8 shadow-2xl"
            >
              <ul className="space-y-1">
                {PRIMARY_NAV_ITEMS.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleLinkClick(e, item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-[#26221D] text-[#C9A24B] font-semibold'
                            : 'text-[#F4ECDA] hover:bg-[#26221D]'
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
                <li className="pt-2">
                  <a
                    href="#reservations"
                    onClick={(e) => handleLinkClick(e, 'reservations')}
                    className="block w-full text-center px-4 py-3 rounded-lg text-sm font-semibold bg-[#C9A24B] text-[#141210] hover:bg-[#DFB85E]"
                  >
                    Book a Table
                  </a>
                </li>
              </ul>

              <div className="mt-5 pt-4 border-t border-[#332E26]">
                <p className="px-3 text-xs font-semibold text-[#B8AD96] mb-2">
                  Policies & Information
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {LEGAL_NAV_ITEMS.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleLinkClick(e, item.id)}
                      className="px-3 py-1.5 text-xs text-[#B8AD96] hover:text-[#F4ECDA] rounded"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Professional Connected Footer */}
      <footer className="bg-[#100E0C] border-t border-[#332E26] text-[#B8AD96] pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#332E26]">
            {/* Column 1: Brand & Essence */}
            <div>
              <a
                href="#home"
                onClick={(e) => handleLinkClick(e, 'home')}
                className="font-display text-2xl font-extrabold text-[#F4ECDA] hover:text-[#C9A24B] transition-colors inline-block mb-3"
              >
                {RESTAURANT_CONFIG.name}
              </a>
              <p className="text-sm text-[#B8AD96] leading-relaxed mb-4">
                {RESTAURANT_CONFIG.tagline}
              </p>
              <p className="text-xs text-[#B8AD96]/80">
                Dine-in · Takeaway · Delivery · Private Dining · Outdoor Patio · Wheelchair Accessible
              </p>
            </div>

            {/* Column 2: Explore Pages */}
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
                Policies & Compliance
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
                    className="text-left hover:text-[#C9A24B] transition-colors underline decoration-[#332E26] underline-offset-4"
                  >
                    Manage Cookie Preferences
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Visit & Hours */}
            <div>
              <h2 className="font-display text-base font-semibold text-[#F4ECDA] mb-4">
                Visit & Opening Hours
              </h2>
              <div className="space-y-2 text-xs leading-relaxed">
                <p className="text-[#F4ECDA] font-medium">{RESTAURANT_CONFIG.address}</p>
                <p>
                  Phone / WhatsApp:{' '}
                  {RESTAURANT_CONFIG.phone ? (
                    <a
                      href={`tel:+${RESTAURANT_CONFIG.phone}`}
                      className="text-[#C9A24B] hover:underline font-mono-num"
                    >
                      +{RESTAURANT_CONFIG.phone}
                    </a>
                  ) : (
                    <span className="text-[#B8AD96] italic">{RESTAURANT_CONFIG.displayPhone}</span>
                  )}
                </p>
                <div className="pt-2 space-y-1.5 border-t border-[#332E26]/60 mt-2">
                  {RESTAURANT_CONFIG.hours.map((h) => (
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
            <p>© {new Date().getFullYear()} {RESTAURANT_CONFIG.name}. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <span>Credit, Debit & NFC Mobile Payments Accepted</span>
              <span aria-hidden="true">·</span>
              <span>Free Wheelchair-Accessible Parking</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
