import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Sliders } from 'lucide-react';

export interface CookieConsentState {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  decided: boolean;
}

const STORAGE_KEY = 'afrotopia_cookie_consent_v1';

export const DEFAULT_CONSENT: CookieConsentState = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: '',
  decided: false,
};

export function getStoredCookieConsent(): CookieConsentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;
    const parsed = JSON.parse(raw);
    return {
      essential: true,
      functional: Boolean(parsed.functional),
      analytics: false, // No analytics trackers are installed on this site
      marketing: false, // No advertising pixels are installed on this site
      timestamp: parsed.timestamp || '',
      decided: Boolean(parsed.decided),
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

export function saveCookieConsent(state: Omit<CookieConsentState, 'essential' | 'timestamp' | 'decided'>): CookieConsentState {
  const updated: CookieConsentState = {
    essential: true,
    functional: state.functional,
    analytics: state.analytics,
    marketing: state.marketing,
    timestamp: new Date().toISOString(),
    decided: true,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors in restricted browsing modes
  }
  return updated;
}

interface CookieConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateCookiePolicy: () => void;
  consent: CookieConsentState;
  onUpdateConsent: (next: CookieConsentState) => void;
}

export const CookieConsentManager: React.FC<CookieConsentModalProps> = ({
  isOpen,
  onClose,
  onNavigateCookiePolicy,
  consent,
  onUpdateConsent,
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [functional, setFunctional] = useState(consent.functional);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);

  useEffect(() => {
    setFunctional(consent.functional);
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
  }, [consent]);

  // Respect 10s dwell rule so we never fire an intrusive arrival popup on first load
  useEffect(() => {
    if (consent.decided) {
      setShowBanner(false);
      return;
    }
    const timer = setTimeout(() => {
      if (!getStoredCookieConsent().decided) {
        setShowBanner(true);
      }
    }, 10500);
    return () => clearTimeout(timer);
  }, [consent.decided]);

  const handleAcceptAll = () => {
    const next = saveCookieConsent({
      functional: true,
      analytics: false, // Explicitly kept false as no 3rd party analytics are loaded
      marketing: false,
    });
    onUpdateConsent(next);
    setShowBanner(false);
    onClose();
  };

  const handleRejectNonEssential = () => {
    const next = saveCookieConsent({
      functional: false,
      analytics: false,
      marketing: false,
    });
    onUpdateConsent(next);
    setShowBanner(false);
    onClose();
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const next = saveCookieConsent({
      functional,
      analytics: false,
      marketing: false,
    });
    onUpdateConsent(next);
    setShowBanner(false);
    onClose();
  };

  return (
    <>
      {/* Subtle Non-Intrusive Bottom Consent Bar (appears only if undecided after 10s dwell) */}
      {showBanner && !isOpen && !consent.decided && (
        <aside
          aria-label="Cookie consent notice"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-[#1E1B17]/95 backdrop-blur-md border border-[#332E26] rounded-xl p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="font-display text-base font-semibold text-[#F4ECDA] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
              <span>Privacy & Cookie Preferences</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowBanner(false)}
              className="text-[#B8AD96] hover:text-[#F4ECDA] p-1 rounded"
              aria-label="Dismiss cookie notice for now"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#B8AD96] leading-relaxed mb-4">
            We use strictly necessary local storage to remember your privacy choices. We do not load Google Analytics, advertising pixels, or third-party tracking cookies.{' '}
            <button
              type="button"
              onClick={() => {
                setShowBanner(false);
                onNavigateCookiePolicy();
              }}
              className="underline text-[#C9A24B] hover:text-[#DFB85E] whitespace-nowrap"
            >
              Read Cookie Policy
            </button>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-3.5 py-2 text-xs font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors whitespace-nowrap shrink-0"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={handleRejectNonEssential}
              className="px-3.5 py-2 text-xs font-semibold bg-[#26221D] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B] transition-colors whitespace-nowrap shrink-0"
            >
              Reject Non-Essential
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBanner(false);
                onNavigateCookiePolicy();
              }}
              className="px-3 py-2 text-xs font-medium text-[#B8AD96] hover:text-[#F4ECDA] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Customise</span>
            </button>
          </div>
        </aside>
      )}

      {/* Full Customise Cookie Preferences Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
        >
          <div className="bg-[#1E1B17] border border-[#332E26] rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#332E26]">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#C9A24B]" aria-hidden="true" />
                <h2 id="cookie-modal-title" className="font-display text-xl font-bold text-[#F4ECDA]">
                  Customise Cookie Preferences
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[#B8AD96] hover:text-[#F4ECDA] rounded-lg"
                aria-label="Close cookie preferences modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustom} className="mt-5 space-y-5">
              <p className="text-sm text-[#B8AD96] leading-relaxed">
                Control how Velquarath Cafe uses browser storage and cookies. We have audited all scripts and assets on this website: no third-party advertising pixels or analytics trackers are loaded.
              </p>

              <div className="space-y-3">
                {/* Strictly Necessary */}
                <div className="p-4 rounded-xl bg-[#141210] border border-[#332E26]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#F4ECDA]">
                      1. Strictly Necessary Storage
                    </span>
                    <span className="text-xs font-mono-num text-[#C9A24B]">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-[#B8AD96] leading-relaxed">
                    Stores your cookie consent choice (`afrotopia_cookie_consent_v1`) in local storage so we do not repeatedly prompt you. No personal data is transmitted.
                  </p>
                </div>

                {/* Functional */}
                <div className="p-4 rounded-xl bg-[#141210] border border-[#332E26]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label htmlFor="toggle-functional" className="text-sm font-semibold text-[#F4ECDA] cursor-pointer">
                      2. Functional & Dietary Filter Preferences
                    </label>
                    <input
                      id="toggle-functional"
                      type="checkbox"
                      checked={functional}
                      onChange={(e) => setFunctional(e.target.checked)}
                      className="w-4 h-4 accent-[#C9A24B] rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-[#B8AD96] leading-relaxed">
                    Allows the browser to remember your last-selected menu category filter or draft reservation notes during your session.
                  </p>
                </div>

                {/* Analytics */}
                <div className="p-4 rounded-xl bg-[#141210] border border-[#332E26] opacity-75">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label htmlFor="toggle-analytics" className="text-sm font-semibold text-[#F4ECDA]">
                      3. Analytics & Performance Cookies
                    </label>
                    <span className="text-xs text-[#B8AD96]">Not Used</span>
                  </div>
                  <p className="text-xs text-[#B8AD96] leading-relaxed">
                    We do not load Google Analytics or third-party traffic trackers. If analytics are ever proposed in the future, they will remain disabled until you grant explicit opt-in consent.
                  </p>
                </div>

                {/* Marketing */}
                <div className="p-4 rounded-xl bg-[#141210] border border-[#332E26] opacity-75">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label htmlFor="toggle-marketing" className="text-sm font-semibold text-[#F4ECDA]">
                      4. Advertising & Retargeting Pixels
                    </label>
                    <span className="text-xs text-[#B8AD96]">Not Used</span>
                  </div>
                  <p className="text-xs text-[#B8AD96] leading-relaxed">
                    Zero third-party ad networks, social tracking pixels, or cross-site profiling scripts are present on this website.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#332E26] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-xs font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors whitespace-nowrap shrink-0"
                  >
                    Accept All
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectNonEssential}
                    className="px-4 py-2 text-xs font-semibold bg-[#26221D] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B] transition-colors whitespace-nowrap shrink-0"
                  >
                    Reject Non-Essential
                  </button>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#1F3A2D] text-[#F4ECDA] border border-[#C9A24B]/40 rounded-lg hover:bg-[#294D3B] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
