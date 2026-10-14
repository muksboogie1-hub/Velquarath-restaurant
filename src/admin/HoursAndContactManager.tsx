import React, { useState } from 'react';
import {
  Clock,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { RestaurantConfig } from '../data/menuData';

export const HoursAndContactManager: React.FC = () => {
  const { restaurantConfig, updateConfig } = useContent();
  const [formData, setFormData] = useState<RestaurantConfig>({
    ...restaurantConfig,
    hours: restaurantConfig.hours || [
      { days: 'Monday – Thursday', time: '08:00 – 22:00 (Breakfast, Lunch & Dinner)' },
      { days: 'Friday – Saturday', time: '08:00 – Late (Live Music, Sport & Late-Night Grill)' },
      { days: 'Sunday', time: '08:30 – 21:00 (Sunday Brunch, Traditional Plates & Jazz)' },
    ],
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleHourChange = (index: number, field: 'days' | 'time', value: string) => {
    const nextHours = [...formData.hours];
    nextHours[index] = { ...nextHours[index], [field]: value };
    setFormData({ ...formData, hours: nextHours });
  };

  const handleAddHourRow = () => {
    setFormData({
      ...formData,
      hours: [...formData.hours, { days: 'Public Holidays', time: '10:00 – 20:00' }],
    });
  };

  const handleRemoveHourRow = (index: number) => {
    setFormData({
      ...formData,
      hours: formData.hours.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const res = await updateConfig(formData);
    setSaving(false);
    if (res.success) {
      setStatus({ type: 'success', message: 'Opening hours and contact details updated successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({
        type: 'error',
        message: res.error || 'Failed to save settings. Please check database permissions.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#332E26]">
        <h2 className="font-display text-2xl font-bold text-[#F4ECDA]">Opening Hours &amp; Contact</h2>
        <p className="text-xs text-[#B8AD96] mt-1">
          Update restaurant operating hours, WhatsApp reservation phone number, address, and email.
        </p>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
            status.type === 'error'
              ? 'bg-red-950/70 border-red-700/70 text-red-200'
              : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
          }`}
        >
          {status.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold block mb-0.5">
              {status.type === 'error' ? 'Database Save Error' : 'Success'}
            </span>
            <span>{status.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* OPERATING HOURS */}
        <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#332E26]">
            <div className="flex items-center gap-2 text-[#C9A24B]">
              <Clock className="w-4 h-4" />
              <h3 className="font-display text-base font-bold text-[#F4ECDA]">
                Weekly Operating Hours
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddHourRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-xs font-semibold text-[#C9A24B] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Day / Holiday</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.hours.map((row, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-lg bg-[#141210] border border-[#332E26]"
              >
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    value={row.days}
                    onChange={(e) => handleHourChange(idx, 'days', e.target.value)}
                    placeholder="e.g. Monday – Thursday"
                    className="w-full bg-[#1E1B17] border border-[#332E26] rounded px-3 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none font-semibold"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={row.time}
                    onChange={(e) => handleHourChange(idx, 'time', e.target.value)}
                    placeholder="e.g. 08:00 – 22:00 (Breakfast, Lunch & Dinner)"
                    className="w-full bg-[#1E1B17] border border-[#332E26] rounded px-3 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                  />
                </div>
                {formData.hours.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveHourRow(idx)}
                    className="p-2 rounded bg-[#26221D] hover:bg-red-950/60 text-[#B8AD96] hover:text-red-400 self-end sm:self-auto cursor-pointer"
                    title="Remove hours row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PHONE & WHATSAPP */}
        <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-[#C9A24B] pb-3 border-b border-[#332E26]">
            <Phone className="w-4 h-4" />
            <h3 className="font-display text-base font-bold text-[#F4ECDA]">
              Phone, WhatsApp &amp; Email
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                WhatsApp Phone Number (International format, no + or spaces)
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-[#C9A24B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 263771234567"
                  className="w-full bg-[#141210] border border-[#332E26] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none font-mono"
                />
              </div>
              <p className="text-[11px] text-[#736B5E] mt-1">
                Filling this in activates direct one-tap WhatsApp bookings and call buttons across the site!
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                Display Phone Number (Public text shown to guests)
              </label>
              <input
                type="text"
                value={formData.displayPhone}
                onChange={(e) => setFormData({ ...formData, displayPhone: e.target.value })}
                placeholder="e.g. +263 77 123 4567 / +263 24 212 3456"
                className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Contact &amp; Reservations Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B8AD96] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. bookings@velquarath.com"
                className="w-full bg-[#141210] border border-[#332E26] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-[#C9A24B] pb-3 border-b border-[#332E26]">
            <MapPin className="w-4 h-4" />
            <h3 className="font-display text-base font-bold text-[#F4ECDA]">
              Physical Location &amp; Address
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Full Street Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 14 Enterprise Road, Newlands, Harare, Zimbabwe"
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#B8AD96] mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#B8AD96] mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs transition-colors shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Hours & Contact Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
