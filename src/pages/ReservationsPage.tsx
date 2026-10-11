import React, { useState } from 'react';
import { Calendar, Clock, Users, AlertTriangle, CheckCircle2, Copy, MessageSquare, ShieldCheck } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/menuData';
import { PageRoute } from '../components/Layout';

interface ReservationsPageProps {
  onNavigate: (page: PageRoute) => void;
}

interface ReservationFormData {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  seatingArea: string;
  occasionOrDietary: string;
  consentToContact: boolean;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  date?: string;
  time?: string;
  guests?: string;
  consentToContact?: string;
}

export const ReservationsPage: React.FC<ReservationsPageProps> = ({ onNavigate }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<ReservationFormData>({
    fullName: '',
    phone: '',
    email: '',
    date: todayStr,
    time: '19:00',
    guests: '2',
    seatingArea: 'Outdoor Patio',
    occasionOrDietary: '',
    consentToContact: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [validatedSummary, setValidatedSummary] = useState<ReservationFormData | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }
    const phoneClean = formData.phone.replace(/[\s\-()]/g, '');
    if (!phoneClean || !/^\+?[0-9]{7,15}$/.test(phoneClean)) {
      newErrors.phone = 'Please enter a valid phone or WhatsApp number (7 to 15 digits).';
    }
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = 'Please enter a valid email address or leave optional email blank.';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a reservation date.';
    } else if (formData.date < todayStr) {
      newErrors.date = 'Reservation date cannot be in the past.';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a preferred dining time.';
    }
    const guestsNum = parseInt(formData.guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 50) {
      newErrors.guests = 'Please specify between 1 and 50 guests.';
    }
    if (!formData.consentToContact) {
      newErrors.consentToContact =
        'Please confirm that Velquarath Cafe may use these details to process your reservation.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCopied(false);
    if (!validate()) {
      setValidatedSummary(null);
      return;
    }
    // Honest handling: validate and prepare payload without faking a backend send
    setValidatedSummary({ ...formData });
  };

  const formatBookingMessage = (data: ReservationFormData) => {
    return [
      `Hi Velquarath Cafe, I would like to request a table reservation:`,
      `• Name: ${data.fullName}`,
      `• Date: ${data.date} at ${data.time}`,
      `• Party Size: ${data.guests} ${Number(data.guests) === 1 ? 'guest' : 'guests'}`,
      `• Preferred Area: ${data.seatingArea}`,
      `• Phone: ${data.phone}`,
      data.email ? `• Email: ${data.email}` : '',
      data.occasionOrDietary ? `• Notes / Dietary: ${data.occasionOrDietary}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleCopySummary = async () => {
    if (!validatedSummary) return;
    try {
      await navigator.clipboard.writeText(formatBookingMessage(validatedSummary));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-[#141210] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold text-[#C9A24B] tracking-wide mb-2">
            Table Reservations · Patio, Fireplace &amp; Private Dining
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#F4ECDA]">
            Book a Table
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#B8AD96] leading-relaxed">
            Reserve a table for breakfast, brunch, lunch, dinner, live sport on the big screen, or live music nights. Brunch and lunch reservations are strongly recommended.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Reservation Form */}
          <div className="lg:col-span-7 bg-[#1E1B17] border border-[#332E26] rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-[#F4ECDA] mb-2">
              Reservation Request Form
            </h2>
            <p className="text-xs sm:text-sm text-[#B8AD96] mb-6">
              We collect only the information strictly necessary to hold your table and contact you regarding your booking. Fields marked with <span className="text-[#C9A24B]">*</span> are required.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="res-fullName"
                    className="block text-xs font-semibold text-[#F4ECDA] mb-1.5"
                  >
                    Full Name <span className="text-[#C9A24B]">*</span>
                  </label>
                  <input
                    id="res-fullName"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'err-res-fullName' : undefined}
                    placeholder="e.g. Tendai Moyo"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                  />
                  {errors.fullName && (
                    <p id="err-res-fullName" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="res-phone"
                    className="block text-xs font-semibold text-[#F4ECDA] mb-1.5"
                  >
                    Phone or WhatsApp Number <span className="text-[#C9A24B]">*</span>
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'err-res-phone' : undefined}
                    placeholder="e.g. +263 77 123 4567"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                  />
                  {errors.phone && (
                    <p id="err-res-phone" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="res-date"
                    className="block text-xs font-semibold text-[#F4ECDA] mb-1.5"
                  >
                    Preferred Date <span className="text-[#C9A24B]">*</span>
                  </label>
                  <input
                    id="res-date"
                    type="date"
                    required
                    min={todayStr}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby={errors.date ? 'err-res-date' : undefined}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                  />
                  {errors.date && (
                    <p id="err-res-date" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.date}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="res-time"
                    className="block text-xs font-semibold text-[#F4ECDA] mb-1.5"
                  >
                    Preferred Time <span className="text-[#C9A24B]">*</span>
                  </label>
                  <select
                    id="res-time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                  >
                    <option value="08:30">08:30 (Breakfast)</option>
                    <option value="10:30">10:30 (Brunch)</option>
                    <option value="12:30">12:30 (Lunch)</option>
                    <option value="14:00">14:00 (Afternoon Grill)</option>
                    <option value="17:30">17:30 (Happy Hour)</option>
                    <option value="19:00">19:00 (Dinner)</option>
                    <option value="20:30">20:30 (Evening &amp; Live Music)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="res-guests"
                    className="block text-xs font-semibold text-[#F4ECDA] mb-1.5"
                  >
                    Party Size <span className="text-[#C9A24B]">*</span>
                  </label>
                  <input
                    id="res-guests"
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: e.target.value })
                    }
                    aria-invalid={Boolean(errors.guests)}
                    aria-describedby={errors.guests ? 'err-res-guests' : undefined}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                  />
                  {errors.guests && (
                    <p id="err-res-guests" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.guests}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="res-seatingArea"
                    className="block text-xs font-semibold text-[#F4ECDA] mb-1.5"
                  >
                    Preferred Seating Area
                  </label>
                  <select
                    id="res-seatingArea"
                    value={formData.seatingArea}
                    onChange={(e) =>
                      setFormData({ ...formData, seatingArea: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                  >
                    <option value="Outdoor Patio">Outdoor Patio</option>
                    <option value="Indoor Fireplace Lounge">Indoor Fireplace Lounge</option>
                    <option value="Near Big Screen (Live Sport)">Near Big Screen (Live Sport)</option>
                    <option value="Private Dining Room">Private Dining Room</option>
                    <option value="Wheelchair-Accessible Table">Wheelchair-Accessible Table</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="res-email"
                    className="block text-xs font-semibold text-[#F4ECDA] mb-1.5"
                  >
                    Email Address <span className="text-[#B8AD96] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="res-email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'err-res-email' : undefined}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                  />
                  {errors.email && (
                    <p id="err-res-email" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="res-notes"
                  className="block text-xs font-semibold text-[#F4ECDA] mb-1.5"
                >
                  Special Requests, High Chairs, or Dietary Notes <span className="text-[#B8AD96] font-normal">(Optional)</span>
                </label>
                <textarea
                  id="res-notes"
                  rows={3}
                  value={formData.occasionOrDietary}
                  onChange={(e) =>
                    setFormData({ ...formData, occasionOrDietary: e.target.value })
                  }
                  placeholder="Let us know if you need high chairs, kids' menus, wheelchair access, or have food allergies..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                />
              </div>

              {/* Privacy Consent Checkbox */}
              <div className="pt-2">
                <div className="flex items-start gap-2.5">
                  <input
                    id="res-consent"
                    type="checkbox"
                    checked={formData.consentToContact}
                    onChange={(e) =>
                      setFormData({ ...formData, consentToContact: e.target.checked })
                    }
                    aria-invalid={Boolean(errors.consentToContact)}
                    aria-describedby={errors.consentToContact ? 'err-res-consent' : undefined}
                    className="mt-1 w-4 h-4 accent-[#C9A24B] rounded cursor-pointer"
                  />
                  <label htmlFor="res-consent" className="text-xs text-[#B8AD96] leading-relaxed cursor-pointer">
                    I agree that Velquarath Cafe may process my name, contact details, and booking preferences solely to manage this reservation request in accordance with the{' '}
                    <a
                      href="#privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('privacy');
                      }}
                      className="text-[#C9A24B] underline"
                    >
                      Privacy Policy
                    </a>
                    . <span className="text-[#C9A24B]">*</span>
                  </label>
                </div>
                {errors.consentToContact && (
                  <p id="err-res-consent" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.consentToContact}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 text-sm font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors"
              >
                Validate &amp; Prepare Reservation Request
              </button>
            </form>

            {/* Honest Backend Status & Actionable Output */}
            {validatedSummary && (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 p-5 rounded-xl bg-[#141210] border border-[#C9A24B] space-y-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-base font-bold text-[#F4ECDA]">
                      Reservation Details Validated — Ready to Send
                    </h3>
                    <p className="text-xs text-[#B8AD96] mt-1 leading-relaxed">
                      <strong>Important Notice:</strong> An automated server-side booking database or email relay is not yet connected to this website, so your reservation has <strong>not</strong> been automatically transmitted.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#1E1B17] border border-[#332E26] font-mono text-xs text-[#F4ECDA] whitespace-pre-wrap">
                  {formatBookingMessage(validatedSummary)}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {RESTAURANT_CONFIG.phone ? (
                    <a
                      href={`https://wa.me/${RESTAURANT_CONFIG.phone}?text=${encodeURIComponent(
                        formatBookingMessage(validatedSummary)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 text-xs font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" aria-hidden="true" />
                      <span>Send via WhatsApp Now</span>
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="px-4 py-2.5 text-xs font-semibold bg-[#26221D] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B] flex items-center gap-1.5"
                  >
                    <Copy className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Booking Summary'}</span>
                  </button>
                </div>

                {!RESTAURANT_CONFIG.phone && (
                  <p className="text-xs text-amber-300/90 bg-amber-950/30 border border-amber-700/40 rounded-lg p-3">
                    <strong>Owner Setup Note:</strong> To enable one-click WhatsApp booking or server-side email delivery, set <code className="font-mono">RESTAURANT_CONFIG.phone</code> in <code className="font-mono">src/data/menuData.ts</code> (e.g. <code className="font-mono">"263771234567"</code>) or connect a <code className="font-mono">POST /api/reservations</code> backend endpoint.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Reservation Guidelines & Policy Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1E1B17] border border-[#332E26] rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-[#F4ECDA] mb-4">
                Reservation &amp; Dining Guide
              </h2>
              <ul className="space-y-4 text-sm text-[#B8AD96]">
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C9A24B] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <strong className="text-[#F4ECDA] block">Brunch &amp; Lunch Recommended</strong>
                    Walk-ins are always welcome, but reservations are recommended for weekend brunch, busy lunch hours, and live music or big-screen sport nights.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-[#C9A24B] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <strong className="text-[#F4ECDA] block">Groups, Private Dining &amp; Catering</strong>
                    We offer a private dining room for celebrations and corporate gatherings, as well as full event catering.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#C9A24B] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <strong className="text-[#F4ECDA] block">Table Hold &amp; Cancellations</strong>
                    We hold reserved tables for 20 minutes past your booking time. Need to change or cancel? See our{' '}
                    <a
                      href="#refunds"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('refunds');
                      }}
                      className="text-[#C9A24B] underline"
                    >
                      Refund &amp; Cancellation Policy
                    </a>
                    .
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#172B21] border border-[#C9A24B]/30 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#C9A24B]" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-[#F4ECDA]">
                  Data Minimization &amp; Security
                </h3>
              </div>
              <p className="text-xs text-[#E2D9C5] leading-relaxed">
                This form collects only your name, phone number, party size, and date/time. No payment card details or sensitive personal identifiers are requested online. All payments (credit card, debit card, NFC mobile payments) are processed securely in person at the restaurant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
