import React, { useState } from 'react';
import { Save, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SiteContent } from '../services/contentService';

export const ContentManager: React.FC = () => {
  const { siteContent, updateContent } = useContent();
  const [formData, setFormData] = useState<SiteContent>({ ...siteContent });
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const ok = await updateContent(formData);
    setSaving(false);
    if (ok) {
      setStatus('Website text and headlines updated successfully!');
      setTimeout(() => setStatus(null), 3500);
    } else {
      setStatus('Failed to update content. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#332E26]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#F4ECDA]">Website Content</h2>
          <p className="text-xs text-[#B8AD96] mt-1">
            Update headlines, hero descriptions, restaurant story copy, and atmosphere text without editing code.
          </p>
        </div>
      </div>

      {status && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{status}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* HERO SECTION CONTENT */}
        <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-[#C9A24B] pb-2 border-b border-[#332E26]">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-display text-base font-bold text-[#F4ECDA]">
              Homepage Hero Section
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Top Gold Badge / Subtitle Tagline
            </label>
            <input
              type="text"
              value={formData.heroBadge}
              onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2.5 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
            />
            <p className="text-[11px] text-[#736B5E] mt-1">
              Displays above the main title (e.g. Off-the-Grill Meats • Traditional Zimbabwean Plates...)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Main Hero Title
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2.5 text-sm font-bold text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Hero Tagline / Welcome Paragraph
            </label>
            <textarea
              rows={3}
              value={formData.heroTagline}
              onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg p-3 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* OUR STORY CONTENT */}
        <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-[#C9A24B] pb-2 border-b border-[#332E26]">
            <FileText className="w-4 h-4" />
            <h3 className="font-display text-base font-bold text-[#F4ECDA]">
              Our Story &amp; Heritage
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Story Headline
            </label>
            <input
              type="text"
              value={formData.storyHeadline}
              onChange={(e) => setFormData({ ...formData, storyHeadline: e.target.value })}
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2.5 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Story Introduction &amp; Philosophy
            </label>
            <textarea
              rows={4}
              value={formData.storyIntro}
              onChange={(e) => setFormData({ ...formData, storyIntro: e.target.value })}
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg p-3 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Patio, Sports &amp; Music Atmosphere Statement
            </label>
            <textarea
              rows={3}
              value={formData.patioTagline}
              onChange={(e) => setFormData({ ...formData, patioTagline: e.target.value })}
              className="w-full bg-[#141210] border border-[#332E26] rounded-lg p-3 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs transition-colors shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save All Website Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
