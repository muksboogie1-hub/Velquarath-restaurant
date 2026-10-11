import React from 'react';
import { Shield, Cookie, RotateCcw, FileText, Accessibility, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageRoute } from '../components/Layout';
import { CookieConsentState, saveCookieConsent } from '../components/CookieConsentManager';
import { RESTAURANT_CONFIG } from '../data/menuData';

interface LegalPageProps {
  onNavigate: (page: PageRoute) => void;
}

const PolicyNavStrip: React.FC<{ current: PageRoute; onNavigate: (p: PageRoute) => void }> = ({
  current,
  onNavigate,
}) => {
  const tabs: { id: PageRoute; label: string }[] = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'cookies', label: 'Cookie Policy & Preferences' },
    { id: 'refunds', label: 'Refund & Cancellation Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'accessibility', label: 'Accessibility Statement' },
  ];

  return (
    <nav aria-label="Legal policies navigation" className="mb-10 pb-4 border-b border-[#332E26] flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = current === t.id;
        return (
          <a
            key={t.id}
            href={`#${t.id}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(t.id);
            }}
            aria-current={active ? 'page' : undefined}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              active
                ? 'bg-[#C9A24B] text-[#141210] font-semibold'
                : 'bg-[#1E1B17] text-[#B8AD96] border border-[#332E26] hover:text-[#F4ECDA]'
            }`}
          >
            {t.label}
          </a>
        );
      })}
    </nav>
  );
};

// ==========================================
// 1. PRIVACY POLICY PAGE
// ==========================================
export const PrivacyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 bg-[#141210] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PolicyNavStrip current="privacy" onNavigate={onNavigate} />

        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-6 h-6 text-[#C9A24B]" aria-hidden="true" />
          <p className="text-xs font-semibold text-[#C9A24B] tracking-wide">
            Data Protection &amp; Visitor Privacy
          </p>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F4ECDA] mb-6">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-sm sm:text-base text-[#B8AD96] leading-relaxed">
          <div className="p-5 rounded-xl bg-[#1E1B17] border border-[#332E26]">
            <h2 className="font-display text-lg font-bold text-[#F4ECDA] mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
              <span>Important Notice &amp; Owner Details Required</span>
            </h2>
            <p className="text-xs sm:text-sm">
              This Privacy Policy accurately describes the technical operation of the Velquarath Cafe website and is structured with reference to Zimbabwe’s <strong>Cyber and Data Protection Act [Chapter 12:07]</strong> (regulated by POTRAZ as the Data Protection Authority) as well as international standards (such as the GDPR for international visitors). Because legal compliance depends on the restaurant’s internal business operations, <strong>this notice does not constitute formal legal advice or a guarantee of statutory certification</strong>. Before commercial launch, the restaurant owner must supply:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm mt-2 space-y-1 text-[#F4ECDA]">
              <li>Registered legal entity name and company registration number in Zimbabwe</li>
              <li>Physical street address in {RESTAURANT_CONFIG.city}, {RESTAURANT_CONFIG.country}</li>
              <li>Designated Data Protection Officer (DPO) or privacy contact email and phone number</li>
            </ul>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              1. Personal Data We Collect
            </h2>
            <p>
              We practice strict data minimization. When you browse Velquarath Cafe, we do not require you to create an account or submit personal data. If you choose to use our <strong>Reservation Request</strong> or <strong>Contact Enquiry</strong> forms, we ask only for:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Identity &amp; Contact Data:</strong> Your name, phone/WhatsApp number, and optional email address.</li>
              <li><strong>Booking Details:</strong> Preferred date, time, party size, seating area preference, and any voluntary dietary or accessibility notes you choose to share.</li>
              <li><strong>Technical Browser Preference:</strong> A local storage key (<code className="font-mono text-xs text-[#F4ECDA]">afrotopia_cookie_consent_v1</code>) stored on your own device to record your cookie preferences.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              2. How Your Data Is Processed (Current Frontend Status)
            </h2>
            <p>
              In the current configuration of this website, reservation and contact forms validate your input in your browser and format a summary so you can copy it or send it directly via WhatsApp (once the owner’s phone number is configured). No personal data is silently transmitted to third-party servers, marketing databases, or external analytics platforms.
            </p>
            <p>
              When the restaurant owner connects a backend reservation/email endpoint (<code className="font-mono text-xs text-[#F4ECDA]">/api/reservations</code> or <code className="font-mono text-xs text-[#F4ECDA]">/api/contact</code>), your submitted details will be processed solely to confirm your table, accommodate dietary or accessibility needs, and reply to your enquiry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              3. Third-Party Services &amp; Technical Audit
            </h2>
            <p>
              We have audited all scripts, stylesheets, fonts, and media assets loaded by this website:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>No Analytics or Ad Trackers:</strong> We do not use Google Analytics, Meta Pixels, TikTok Pixels, or any third-party behavioral advertising scripts.</li>
              <li><strong>Local Food &amp; Interior Photography:</strong> All food and restaurant images are served directly from the application’s own asset bundle without hotlinking to external image CDNs.</li>
              <li><strong>Web Fonts (Google Fonts):</strong> This site loads the <em>Fraunces</em>, <em>Plus Jakarta Sans</em>, and <em>JetBrains Mono</em> typefaces from <code className="font-mono text-xs text-[#F4ECDA]">fonts.googleapis.com</code> and <code className="font-mono text-xs text-[#F4ECDA]">fonts.gstatic.com</code>. Your browser sends a standard HTTP request (including your IP address) to Google’s font servers to fetch these font files.</li>
              <li><strong>WhatsApp External Links:</strong> If you click a WhatsApp booking link (when enabled by the owner), you will be directed to WhatsApp (<code className="font-mono text-xs text-[#F4ECDA]">wa.me</code>), which is governed by WhatsApp’s own privacy policy.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              4. Your Rights Under Zimbabwean &amp; International Law
            </h2>
            <p>
              Under the Zimbabwe Cyber and Data Protection Act [Chapter 12:07] and applicable data protection laws, data subjects have the right to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Be informed about how your personal data is collected and used;</li>
              <li>Request access to, correction of, or deletion of personal data held about you;</li>
              <li>Object to or withdraw consent for processing at any time;</li>
              <li>Lodge a complaint with the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ) or your local supervisory authority.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. COOKIE POLICY & PREFERENCES PAGE
// ==========================================
interface CookiePageProps extends LegalPageProps {
  consent: CookieConsentState;
  onUpdateConsent: (next: CookieConsentState) => void;
  onOpenCookieModal: () => void;
}

export const CookiePage: React.FC<CookiePageProps> = ({
  onNavigate,
  consent,
  onUpdateConsent,
  onOpenCookieModal,
}) => {
  const handleQuickAcceptAll = () => {
    onUpdateConsent(
      saveCookieConsent({ functional: true, analytics: false, marketing: false })
    );
  };

  const handleQuickReject = () => {
    onUpdateConsent(
      saveCookieConsent({ functional: false, analytics: false, marketing: false })
    );
  };

  return (
    <div className="py-12 md:py-20 bg-[#141210] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PolicyNavStrip current="cookies" onNavigate={onNavigate} />

        <div className="flex items-center gap-3 mb-3">
          <Cookie className="w-6 h-6 text-[#C9A24B]" aria-hidden="true" />
          <p className="text-xs font-semibold text-[#C9A24B] tracking-wide">
            Transparent Storage Audit &amp; Consent Controls
          </p>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F4ECDA] mb-6">
          Cookie Policy &amp; Preferences
        </h1>

        {/* Interactive Live Consent Control Panel */}
        <div className="p-6 rounded-2xl bg-[#1E1B17] border border-[#332E26] mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#332E26]">
            <div>
              <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
                Your Current Cookie &amp; Storage Status
              </h2>
              <p className="text-xs text-[#B8AD96] mt-1">
                {consent.decided
                  ? `Preferences saved on ${new Date(consent.timestamp).toLocaleString()}`
                  : 'You have not yet saved custom cookie preferences (Non-essential storage is off by default).'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono-num text-[#C9A24B]">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Zero Trackers Active</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5 text-xs">
            <div className="p-3.5 rounded-xl bg-[#141210] border border-[#332E26]">
              <span className="text-[#B8AD96] block">Strictly Necessary</span>
              <strong className="text-[#F4ECDA] text-sm">Enabled (Required)</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141210] border border-[#332E26]">
              <span className="text-[#B8AD96] block">Functional Preferences</span>
              <strong className="text-[#F4ECDA] text-sm">
                {consent.functional ? 'Allowed' : 'Disabled'}
              </strong>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141210] border border-[#332E26]">
              <span className="text-[#B8AD96] block">Analytics &amp; Marketing</span>
              <strong className="text-[#B8AD96] text-sm">Not Used (0 Scripts)</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleQuickAcceptAll}
              className="px-4 py-2.5 text-xs font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={handleQuickReject}
              className="px-4 py-2.5 text-xs font-semibold bg-[#26221D] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B] transition-colors"
            >
              Reject Non-Essential
            </button>
            <button
              type="button"
              onClick={onOpenCookieModal}
              className="px-4 py-2.5 text-xs font-semibold bg-[#141210] text-[#C9A24B] border border-[#C9A24B]/40 rounded-lg hover:border-[#C9A24B] transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Customise Preferences</span>
            </button>
          </div>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-[#B8AD96] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              1. Complete Audit of Cookies &amp; Local Storage
            </h2>
            <p>
              Unlike websites that load dozens of hidden tracking cookies, Velquarath Cafe has been engineered for privacy by default. Below is the exact inventory of browser storage and external requests on this site:
            </p>
            <div className="overflow-x-auto border border-[#332E26] rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#1E1B17] text-[#F4ECDA] border-b border-[#332E26]">
                  <tr>
                    <th className="p-3.5 font-semibold">Name / Resource</th>
                    <th className="p-3.5 font-semibold">Type</th>
                    <th className="p-3.5 font-semibold">Purpose</th>
                    <th className="p-3.5 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#332E26] bg-[#141210]">
                  <tr>
                    <td className="p-3.5 font-mono text-xs text-[#C9A24B]">afrotopia_cookie_consent_v1</td>
                    <td className="p-3.5">First-Party LocalStorage</td>
                    <td className="p-3.5">Stores your Accept / Reject / Customise cookie decision so the banner does not reappear on every page.</td>
                    <td className="p-3.5 font-mono-num">Persistent (until cleared)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-xs text-[#C9A24B]">Google Fonts CSS/WOFF2</td>
                    <td className="p-3.5">Third-Party Font Asset</td>
                    <td className="p-3.5">Loads Fraunces, Plus Jakarta Sans, and JetBrains Mono fonts for typography. Does not set tracking cookies.</td>
                    <td className="p-3.5 font-mono-num">Browser Cache</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              2. Policy on Future Analytics
            </h2>
            <p>
              We do not load Google Analytics, advertising pixels, or session recording tools by default. If the restaurant owner ever proposes adding privacy-friendly analytics in the future, we will update this table to explain exactly what metrics are collected and ensure those scripts remain strictly blocked until you grant explicit opt-in consent.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. REFUND & CANCELLATION POLICY PAGE
// ==========================================
export const RefundsPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 bg-[#141210] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PolicyNavStrip current="refunds" onNavigate={onNavigate} />

        <div className="flex items-center gap-3 mb-3">
          <RotateCcw className="w-6 h-6 text-[#C9A24B]" aria-hidden="true" />
          <p className="text-xs font-semibold text-[#C9A24B] tracking-wide">
            Bookings, Takeaway, Delivery &amp; Catering Terms
          </p>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F4ECDA] mb-6">
          Refund &amp; Cancellation Policy
        </h1>

        <div className="space-y-8 text-sm sm:text-base text-[#B8AD96] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              1. Table Reservations &amp; Cancellations
            </h2>
            <p>
              Standard table reservations at Velquarath Cafe do not require an online deposit. If your plans change or your party size adjusts, please notify us as early as possible so we can release the table for other guests. We hold reserved tables for <strong>20 minutes</strong> past the scheduled reservation time before releasing them to walk-in guests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              2. Dine-In, Takeaway &amp; Delivery Orders
            </h2>
            <p>
              We take pride in preparing our flame-grilled meats, traditional Zimbabwean stews, burgers, and drinks fresh to order.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Order Modifications:</strong> If you need to cancel or amend a takeaway or delivery order, please call the restaurant immediately. Once food preparation on the grill or in the kitchen has begun, orders cannot be cancelled free of charge.</li>
              <li><strong>Quality &amp; Accuracy Guarantee:</strong> If an item in your dine-in, takeaway, or delivery order is incorrect, missing, or does not meet our quality standards, please inform your server immediately (for dine-in) or contact us within 2 hours of collection/delivery. We will gladly prepare a replacement dish or issue an appropriate refund via your original payment method (credit card, debit card, NFC mobile payment, or cash).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              3. Private Dining Room &amp; Event Catering Deposits
            </h2>
            <p>
              For large group bookings in our Private Dining Room or off-site event catering where a pre-arranged deposit is agreed directly with management:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Cancellations made at least <strong>72 hours</strong> prior to the event are eligible for a full refund of any deposit paid, less any non-recoverable custom procurement costs agreed in writing.</li>
              <li>Cancellations made less than <strong>48 hours</strong> before a catered event where fresh meats, fish, and produce have already been prepared may forfeit the deposit.</li>
            </ul>
            <p className="text-xs text-[#C9A24B]">
              <em>Owner Note: Please verify and customise the exact notice periods and deposit percentages above to match your in-house catering contracts and Zimbabwe Consumer Protection Act [Chapter 14:44] requirements.</em>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. TERMS & CONDITIONS PAGE
// ==========================================
export const TermsPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 bg-[#141210] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PolicyNavStrip current="terms" onNavigate={onNavigate} />

        <div className="flex items-center gap-3 mb-3">
          <FileText className="w-6 h-6 text-[#C9A24B]" aria-hidden="true" />
          <p className="text-xs font-semibold text-[#C9A24B] tracking-wide">
            Website Use, Menu Availability &amp; House Rules
          </p>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F4ECDA] mb-6">
          Terms &amp; Conditions
        </h1>

        <div className="space-y-8 text-sm sm:text-base text-[#B8AD96] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              1. Menu Items, Seasonal Availability &amp; Pricing
            </h2>
            <p>
              Our menu features both signature grill items and traditional Zimbabwean dishes (including fresh Kariba bream, road runner, game curries, and seasonal starters such as madora and mopane worms). Availability of certain traditional and game dishes may vary based on fresh market supply.
            </p>
            <p>
              Where prices are displayed on this website, they reflect the figures supplied by Velquarath Cafe. For items without a listed online price, current pricing is displayed on our in-house menus and chalkboards at the restaurant and confirmed prior to ordering.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              2. Allergens &amp; Dietary Information
            </h2>
            <p>
              Several traditional Zimbabwean dishes on our menu — including <em>Roasted Nzungu</em>, <em>Chibage &amp; Nzungu</em>, <em>Rice, Beans &amp; Nuts</em>, and stews enriched with groundnut butter (<em>dovi</em>) — contain <strong>peanuts / groundnuts</strong>. Our kitchen also handles gluten, dairy, eggs, fish, and game meats. Please inform your server of any food allergies or dietary requirements before ordering.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              3. Alcohol Service &amp; Responsible Enjoyment
            </h2>
            <p>
              In accordance with Zimbabwean liquor licensing laws, alcoholic beverages — including our signature cocktails (<em>Afrotopia Gnt, Njuzu Fever, The Somgaga, Summa Yo Muthi, The Pungwe, Chi Slender</em>), lagers (<em>Zambezi, Black Label</em>), and wines — are served strictly to persons aged <strong>18 years and older</strong>. Management reserves the right to request valid identification and to refuse alcohol service to any patron in the interest of safety.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              4. Payments &amp; Governing Law
            </h2>
            <p>
              We accept credit cards, debit cards, and NFC mobile payments as well as cash at the restaurant. These Terms &amp; Conditions are governed by the laws of the Republic of Zimbabwe.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. ACCESSIBILITY STATEMENT PAGE
// ==========================================
export const AccessibilityPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 bg-[#141210] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PolicyNavStrip current="accessibility" onNavigate={onNavigate} />

        <div className="flex items-center gap-3 mb-3">
          <Accessibility className="w-6 h-6 text-[#C9A24B]" aria-hidden="true" />
          <p className="text-xs font-semibold text-[#C9A24B] tracking-wide">
            Physical Venue &amp; Digital WCAG 2.1 AA Commitment
          </p>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F4ECDA] mb-6">
          Accessibility Statement
        </h1>

        <div className="space-y-8 text-sm sm:text-base text-[#B8AD96] leading-relaxed">
          <section className="p-6 rounded-2xl bg-[#172B21] border border-[#C9A24B]/30 space-y-3 text-[#F4ECDA]">
            <h2 className="font-display text-xl font-bold text-[#C9A24B]">
              1. Physical Restaurant Accessibility at Velquarath Cafe
            </h2>
            <p className="text-sm text-[#E2D9C5]">
              We are committed to ensuring that every guest can dine, relax, and enjoy live music and sport comfortably at Velquarath Cafe. Our physical venue provides:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
                <span>Wheelchair-accessible step-free entrance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
                <span>Wheelchair-accessible dining tables &amp; patio seating</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
                <span>Wheelchair-accessible restroom / toilet facilities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
                <span>Wheelchair-accessible car park &amp; free street parking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
                <span>High chairs and kids’ menu for families</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
                <span>Table service and staff assistance on request</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              2. Digital Website Accessibility Features
            </h2>
            <p>
              We have designed this website to conform to <strong>WCAG 2.1 Level AA</strong> guidelines so that visitors using screen readers, keyboard-only navigation, or reduced-motion settings can access all content seamlessly:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Keyboard Navigation &amp; Skip Links:</strong> Every page includes a "Skip to main content" link, visible gold focus rings (<code className="font-mono text-xs text-[#F4ECDA]">:focus-visible</code>), and keyboard-operable menus, category tabs, forms, and gallery lightboxes (including <code className="font-mono text-xs text-[#F4ECDA]">Escape</code> and arrow-key support).</li>
              <li><strong>High-Contrast Palette:</strong> Warm cream typography (<code className="font-mono text-xs text-[#F4ECDA]">#F4ECDA</code>) and gold accents (<code className="font-mono text-xs text-[#C9A24B]">#C9A24B</code>) on deep charcoal (<code className="font-mono text-xs text-[#F4ECDA]">#141210</code>) exceed the 4.5:1 contrast ratio required for body text.</li>
              <li><strong>Reduced Motion Respect:</strong> All scroll animations and the ambient hearth ember canvas automatically disable when your operating system or browser has <code className="font-mono text-xs text-[#F4ECDA]">prefers-reduced-motion: reduce</code> enabled.</li>
              <li><strong>Semantic HTML &amp; Descriptive Alt Text:</strong> All food and venue photographs include descriptive alternative text, and all form inputs have explicit <code className="font-mono text-xs text-[#F4ECDA]">&lt;label&gt;</code> associations and <code className="font-mono text-xs text-[#F4ECDA]">role="alert"</code> error announcements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F4ECDA]">
              3. Feedback &amp; Assistance
            </h2>
            <p>
              If you encounter any accessibility barrier on our website or would like to arrange specific seating or assistance ahead of your visit, please reach out via our{' '}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contact');
                }}
                className="text-[#C9A24B] underline"
              >
                Contact Page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
