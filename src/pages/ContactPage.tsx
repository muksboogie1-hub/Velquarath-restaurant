import React, { useState } from 'react';
import { MapPin, Phone, Clock, AlertTriangle, CheckCircle2, Copy, Car, Accessibility } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/menuData';
import { PageRoute } from '../components/Layout';

interface ContactPageProps {
  onNavigate: (page: PageRoute) => void;
}

interface ContactFormState {
  name: string;
  phoneOrEmail: string;
  topic: string;
  message: string;
  consent: boolean;
}

interface ContactErrors {
  name?: string;
  phoneOrEmail?: string;
  message?: string;
  consent?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    phoneOrEmail: '',
    topic: 'General Enquiry',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<ContactErrors>({});
  const [validatedMessage, setValidatedMessage] = useState<ContactFormState | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (): boolean => {
    const nextErrors: ContactErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name.';
    }
    if (!form.phoneOrEmail.trim() || form.phoneOrEmail.trim().length < 5) {
      nextErrors.phoneOrEmail = 'Please provide a valid phone number or email address so we can reply.';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      nextErrors.message = 'Please enter a message of at least 10 characters.';
    }
    if (!form.consent) {
      nextErrors.consent = 'Please confirm consent to process your enquiry.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCopied(false);
    if (!validate()) {
      setValidatedMessage(null);
      return;
    }
    setValidatedMessage({ ...form });
  };

  const formatEnquiryText = (data: ContactFormState) => {
    return [
      `Velquarath Cafe Enquiry (${data.topic})`,
      `From: ${data.name}`,
      `Contact: ${data.phoneOrEmail}`,
      `Message: ${data.message}`,
    ].join('\n');
  };

  const handleCopy = async () => {
    if (!validatedMessage) return;
    try {
      await navigator.clipboard.writeText(formatEnquiryText(validatedMessage));
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
            Get in Touch · Catering, Private Dining &amp; Directions
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#F4ECDA]">
            Contact &amp; Visit Us
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#B8AD96] leading-relaxed">
            Have a question about tonight’s live music lineup, what’s on the big screen, takeaway orders, or private event catering? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1E1B17] border border-[#332E26] rounded-2xl p-6 space-y-5">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#C9A24B] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-lg font-bold text-[#F4ECDA]">
                    Location &amp; Address
                  </h2>
                  <p className="text-sm text-[#B8AD96] mt-1">
                    {RESTAURANT_CONFIG.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-[#332E26]">
                <Phone className="w-5 h-5 text-[#C9A24B] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-lg font-bold text-[#F4ECDA]">
                    Phone &amp; WhatsApp
                  </h2>
                  <p className="text-sm text-[#B8AD96] mt-1">
                    {RESTAURANT_CONFIG.phone ? (
                      <a
                        href={`tel:+${RESTAURANT_CONFIG.phone}`}
                        className="text-[#C9A24B] font-mono-num hover:underline"
                      >
                        +{RESTAURANT_CONFIG.phone}
                      </a>
                    ) : (
                      <span>{RESTAURANT_CONFIG.displayPhone}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-[#332E26]">
                <Clock className="w-5 h-5 text-[#C9A24B] shrink-0 mt-1" aria-hidden="true" />
                <div className="w-full">
                  <h2 className="font-display text-lg font-bold text-[#F4ECDA] mb-2">
                    Opening Hours
                  </h2>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {RESTAURANT_CONFIG.hours.map((h) => (
                      <div key={h.days} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="font-semibold text-[#F4ECDA]">{h.days}</span>
                        <span className="text-[#B8AD96]">{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1E1B17] border border-[#332E26] rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-base font-bold text-[#F4ECDA]">
                    Free Parking Lot &amp; Street Parking
                  </h3>
                  <p className="text-xs text-[#B8AD96] mt-1 leading-relaxed">
                    Complimentary on-site parking lot and convenient street parking right outside the café.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-[#332E26]">
                <Accessibility className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-base font-bold text-[#F4ECDA]">
                    Full Wheelchair Accessibility
                  </h3>
                  <p className="text-xs text-[#B8AD96] mt-1 leading-relaxed">
                    Step-free wheelchair-accessible entrance, dining seating, restroom, and designated car park spaces.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#1E1B17] border border-[#332E26] rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-[#F4ECDA] mb-2">
              Send an Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-[#B8AD96] mb-6">
              For table bookings, you can also use our dedicated{' '}
              <a
                href="#reservations"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('reservations');
                }}
                className="text-[#C9A24B] underline"
              >
                Reservations Page
              </a>
              .
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-[#F4ECDA] mb-1.5">
                    Your Name <span className="text-[#C9A24B]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'err-contact-name' : undefined}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                  />
                  {errors.name && (
                    <p id="err-contact-name" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-reply" className="block text-xs font-semibold text-[#F4ECDA] mb-1.5">
                    Phone or Email <span className="text-[#C9A24B]">*</span>
                  </label>
                  <input
                    id="contact-reply"
                    type="text"
                    required
                    value={form.phoneOrEmail}
                    onChange={(e) => setForm({ ...form, phoneOrEmail: e.target.value })}
                    aria-invalid={Boolean(errors.phoneOrEmail)}
                    aria-describedby={errors.phoneOrEmail ? 'err-contact-reply' : undefined}
                    placeholder="+263 77... or email@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                  />
                  {errors.phoneOrEmail && (
                    <p id="err-contact-reply" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.phoneOrEmail}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact-topic" className="block text-xs font-semibold text-[#F4ECDA] mb-1.5">
                  Subject / Topic
                </label>
                <select
                  id="contact-topic"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Private Dining & Group Booking">Private Dining &amp; Group Booking</option>
                  <option value="Event Catering Request">Event Catering Request</option>
                  <option value="Live Music & Sport Schedule">Live Music &amp; Sport Schedule</option>
                  <option value="Takeaway / Delivery Question">Takeaway / Delivery Question</option>
                  <option value="Feedback or Dietary Question">Feedback or Dietary Question</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[#F4ECDA] mb-1.5">
                  Message <span className="text-[#C9A24B]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'err-contact-message' : undefined}
                  placeholder="How can we help you?"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                />
                {errors.message && (
                  <p id="err-contact-message" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-start gap-2.5">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? 'err-contact-consent' : undefined}
                    className="mt-1 w-4 h-4 accent-[#C9A24B] rounded cursor-pointer"
                  />
                  <label htmlFor="contact-consent" className="text-xs text-[#B8AD96] leading-relaxed cursor-pointer">
                    I consent to Velquarath Cafe using these details to respond to my enquiry in accordance with the{' '}
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
                {errors.consent && (
                  <p id="err-contact-consent" role="alert" className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.consent}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 text-sm font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors"
              >
                Validate &amp; Prepare Message
              </button>
            </form>

            {validatedMessage && (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 p-5 rounded-xl bg-[#141210] border border-[#C9A24B] space-y-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-base font-bold text-[#F4ECDA]">
                      Message Validated — Backend Connection Pending
                    </h3>
                    <p className="text-xs text-[#B8AD96] mt-1 leading-relaxed">
                      Because a live mail server or backend endpoint (<code className="font-mono">/api/contact</code>) is not yet configured, your message has <strong>not</strong> been dispatched automatically. You can copy your formatted enquiry below or send it directly once the owner’s WhatsApp/email is configured.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#1E1B17] border border-[#332E26] font-mono text-xs text-[#F4ECDA] whitespace-pre-wrap">
                  {formatEnquiryText(validatedMessage)}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2.5 text-xs font-semibold bg-[#26221D] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B] flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Enquiry Text'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
