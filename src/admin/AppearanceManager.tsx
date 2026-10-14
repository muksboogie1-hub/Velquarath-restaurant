import React, { useState } from 'react';
import { Palette, Bell, CheckCircle2, Save, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { AppearanceSettings } from '../services/contentService';

const COLOR_PRESETS = [
  { name: 'Warm Velquarath Gold (Default)', color: '#C9A24B', hover: '#DFB85E' },
  { name: 'Ember Bronze', color: '#D97706', hover: '#F59E0B' },
  { name: 'Emerald Velvet', color: '#10B981', hover: '#34D399' },
  { name: 'Fire Ochre', color: '#EA580C', hover: '#FB923C' },
  { name: 'Royal Crimson', color: '#E11D48', hover: '#F43F5E' },
];

export const AppearanceManager: React.FC = () => {
  const { appearance, updateAppearance } = useContent();
  const [formData, setFormData] = useState<AppearanceSettings>({ ...appearance });
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await updateAppearance(formData);
    setSaving(false);
    if (ok) {
      setStatus('Appearance settings saved successfully!');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#332E26]">
        <h2 className="font-display text-2xl font-bold text-[#F4ECDA]">Appearance &amp; Visuals</h2>
        <p className="text-xs text-[#B8AD96] mt-1">
          Customize website visual highlights, top promotional announcement banners, and brand accent tones.
        </p>
      </div>

      {status && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{status}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* TOP ANNOUNCEMENT BANNER */}
        <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#332E26]">
            <div className="flex items-center gap-2 text-[#C9A24B]">
              <Bell className="w-4 h-4" />
              <h3 className="font-display text-base font-bold text-[#F4ECDA]">
                Top Announcement Banner
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bannerActive}
                onChange={(e) => setFormData({ ...formData, bannerActive: e.target.checked })}
                className="w-4 h-4 accent-[#C9A24B]"
              />
              <span className="text-xs font-semibold text-[#F4ECDA]">
                {formData.bannerActive ? '● Banner Enabled' : '○ Banner Hidden'}
              </span>
            </label>
          </div>

          <p className="text-xs text-[#B8AD96]">
            Displays an eye-catching banner at the very top of every page for happy hour specials, live events, or public holidays.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Banner Text Message
            </label>
            <input
              type="text"
              value={formData.bannerText}
              onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
              placeholder="e.g. 🔥 Weekend Special: Full Rack Sticky Ribs with Complimentary Craft Beer!"
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2.5 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Button / Action Link (Optional)
            </label>
            <input
              type="text"
              value={formData.bannerLink}
              onChange={(e) => setFormData({ ...formData, bannerLink: e.target.value })}
              placeholder="#menu or #reservations"
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none font-mono"
            />
          </div>

          {/* Banner Live Preview */}
          <div className="mt-4 pt-4 border-t border-[#332E26]">
            <p className="text-[11px] font-semibold text-[#B8AD96] uppercase tracking-wider mb-2">
              Banner Live Preview:
            </p>
            {formData.bannerActive ? (
              <div
                style={{ backgroundColor: formData.accentColor }}
                className="text-[#141210] py-2 px-4 rounded-lg flex items-center justify-between text-xs font-semibold transition-all shadow-md"
              >
                <span>{formData.bannerText}</span>
                <span className="inline-flex items-center gap-1 underline text-[11px] font-bold">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#141210] border border-dashed border-[#332E26] text-center text-xs text-[#736B5E]">
                Banner is currently disabled. Toggle &quot;Banner Enabled&quot; above to activate on the live site.
              </div>
            )}
          </div>
        </div>

        {/* ACCENT COLOR THEME */}
        <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-[#C9A24B] pb-3 border-b border-[#332E26]">
            <Palette className="w-4 h-4" />
            <h3 className="font-display text-base font-bold text-[#F4ECDA]">
              Brand Accent Palette
            </h3>
          </div>

          <p className="text-xs text-[#B8AD96]">
            Select an accent tone for action buttons, gold badges, and border highlights.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.color}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    accentColor: preset.color,
                    accentHover: preset.hover,
                  })
                }
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  formData.accentColor === preset.color
                    ? 'border-[#C9A24B] bg-[#26221D]'
                    : 'border-[#332E26] bg-[#141210] hover:border-[#736B5E]'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full border border-black/30 shadow-inner shrink-0"
                  style={{ backgroundColor: preset.color }}
                />
                <div>
                  <div className="font-semibold text-xs text-[#F4ECDA]">{preset.name}</div>
                  <div className="text-[10px] text-[#B8AD96] font-mono">{preset.color}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs transition-colors shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Appearance Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
