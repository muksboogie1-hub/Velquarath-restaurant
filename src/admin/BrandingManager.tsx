import React, { useState } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Save,
  X,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { GalleryItem, GalleryCategory } from '../data/galleryData';
import { uploadImage } from '../services/contentService';
import { GENERATED_IMAGES } from '../data/images';

export const BrandingManager: React.FC = () => {
  const {
    appearance,
    updateAppearance,
    galleryItems,
    addGalleryItem,
    removeGalleryItem,
  } = useContent();

  const [heroUrl, setHeroUrl] = useState(appearance.customHeroUrl || '');
  const [logoUrl, setLogoUrl] = useState(appearance.customLogoUrl || '');
  const [savingHero, setSavingHero] = useState(false);
  const [heroSavedMsg, setHeroSavedMsg] = useState<string | null>(null);

  // Gallery item form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({
    id: '',
    title: '',
    caption: '',
    category: 'traditional',
    categoryLabel: 'Traditional & Grill',
    src: '',
    alt: '',
    spanWide: false,
  });
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const handleSaveHeroBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    const ok = await updateAppearance({
      ...appearance,
      customHeroUrl: heroUrl.trim() || undefined,
      customLogoUrl: logoUrl.trim() || undefined,
    });
    setSavingHero(false);
    if (ok) {
      setHeroSavedMsg('Hero & branding images saved!');
      setTimeout(() => setHeroSavedMsg(null), 3000);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    const res = await uploadImage(file);
    if (res.url) {
      setHeroUrl(res.url);
    }
    setUploadingHero(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(true);
    const res = await uploadImage(file);
    if (res.url) {
      setNewGalleryItem((prev) => ({
        ...prev,
        src: res.url,
        alt: prev.alt || prev.title || 'Velquarath Cafe gallery photo',
      }));
    }
    setUploadingGallery(false);
  };

  const handleAddGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.src || !newGalleryItem.title) return;

    const item: GalleryItem = {
      id: 'gal_' + Date.now(),
      title: newGalleryItem.title,
      caption: newGalleryItem.caption || '',
      category: newGalleryItem.category || 'traditional',
      categoryLabel: newGalleryItem.categoryLabel || 'Traditional & Grill',
      src: newGalleryItem.src,
      alt: newGalleryItem.alt || newGalleryItem.title,
      spanWide: Boolean(newGalleryItem.spanWide),
    };

    await addGalleryItem(item);
    setShowAddModal(false);
    setNewGalleryItem({
      title: '',
      caption: '',
      category: 'traditional',
      categoryLabel: 'Traditional & Grill',
      src: '',
      alt: '',
      spanWide: false,
    });
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#332E26]">
        <h2 className="font-display text-2xl font-bold text-[#F4ECDA]">Images &amp; Branding</h2>
        <p className="text-xs text-[#B8AD96] mt-1">
          Manage key visual assets: homepage hero feast banner, custom logo, and photo gallery.
        </p>
      </div>

      {heroSavedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{heroSavedMsg}</span>
        </div>
      )}

      {/* HERO BANNER SECTION */}
      <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-[#C9A24B] pb-2 border-b border-[#332E26]">
          <ImageIcon className="w-4 h-4" />
          <h3 className="font-display text-base font-bold text-[#F4ECDA]">
            Main Homepage Hero Feast Banner
          </h3>
        </div>

        <form onSubmit={handleSaveHeroBranding} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
              Hero Banner Image (Upload or enter image URL)
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={heroUrl}
                onChange={(e) => setHeroUrl(e.target.value)}
                placeholder="Leave blank to use default feast photography, or enter URL"
                className="flex-1 bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
              />
              <label className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-xs font-semibold text-[#C9A24B] cursor-pointer border border-[#332E26] shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingHero ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroUpload}
                  disabled={uploadingHero}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="relative rounded-lg overflow-hidden h-44 border border-[#332E26] bg-[#141210]">
            <img
              src={heroUrl || GENERATED_IMAGES.heroFeast}
              alt="Hero Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/90 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-[#F4ECDA] font-semibold bg-[#141210]/70 px-2.5 py-1 rounded border border-[#332E26]">
                Current Live Hero Banner
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingHero}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs transition-colors shadow-lg cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingHero ? 'Saving...' : 'Save Hero Banner'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* GALLERY MANAGEMENT */}
      <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#332E26]">
          <div>
            <h3 className="font-display text-base font-bold text-[#F4ECDA]">
              Website Photo Gallery
            </h3>
            <p className="text-xs text-[#B8AD96] mt-0.5">
              Images displayed in the public Gallery page and patio features.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photo to Gallery</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#141210] border border-[#332E26] rounded-xl overflow-hidden group hover:border-[#C9A24B]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-[#1E1B17]">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#141210]/80 text-[#C9A24B] border border-[#332E26]">
                    {item.categoryLabel || item.category}
                  </span>
                  {item.spanWide && (
                    <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                      Wide Feature
                    </span>
                  )}
                </div>
                <div className="p-3.5">
                  <h4 className="font-semibold text-sm text-[#F4ECDA]">{item.title}</h4>
                  <p className="text-xs text-[#B8AD96] mt-1 line-clamp-2 leading-relaxed">
                    {item.caption || 'No caption'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeGalleryItem(item.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#26221D] hover:bg-red-950/60 text-[#B8AD96] hover:text-red-400 text-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD PHOTO MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#1E1B17] border border-[#332E26] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#332E26] mb-4">
              <h3 className="font-display text-lg font-bold text-[#F4ECDA]">
                Add Photo to Gallery
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#B8AD96] hover:text-[#F4ECDA] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGallerySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={newGalleryItem.title}
                  onChange={(e) =>
                    setNewGalleryItem({ ...newGalleryItem, title: e.target.value })
                  }
                  placeholder="e.g. Saturday Night Patio Vibe"
                  className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={newGalleryItem.caption}
                  onChange={(e) =>
                    setNewGalleryItem({ ...newGalleryItem, caption: e.target.value })
                  }
                  placeholder="Brief story or description behind the photo..."
                  className="w-full bg-[#141210] border border-[#332E26] rounded-lg p-2.5 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newGalleryItem.category}
                    onChange={(e) =>
                      setNewGalleryItem({
                        ...newGalleryItem,
                        category: e.target.value as Exclude<GalleryCategory, 'all'>,
                        categoryLabel:
                          e.target.value === 'grill'
                            ? 'Off the Grill'
                            : e.target.value === 'drinks-vibe'
                            ? 'Interior & Vibe'
                            : e.target.value === 'burgers-platters'
                            ? 'Brunch & Burgers'
                            : 'Traditional & Grill',
                      })
                    }
                    className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                  >
                    <option value="traditional">Traditional &amp; Grill</option>
                    <option value="grill">Off the Grill</option>
                    <option value="burgers-platters">Brunch &amp; Burgers</option>
                    <option value="drinks-vibe">Interior &amp; Bar Vibe</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(newGalleryItem.spanWide)}
                      onChange={(e) =>
                        setNewGalleryItem({ ...newGalleryItem, spanWide: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#C9A24B]"
                    />
                    <span className="text-xs text-[#F4ECDA]">Wide Landscape Feature</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                  Photo Source (Upload or URL) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newGalleryItem.src}
                    onChange={(e) =>
                      setNewGalleryItem({ ...newGalleryItem, src: e.target.value })
                    }
                    placeholder="https://... image address"
                    className="flex-1 bg-[#141210] border border-[#332E26] rounded-lg px-3 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                  />
                  <label className="px-3 py-2 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-xs font-semibold text-[#C9A24B] cursor-pointer border border-[#332E26] shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    <span>{uploadingGallery ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      disabled={uploadingGallery}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#332E26]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#B8AD96] bg-[#26221D] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newGalleryItem.src || !newGalleryItem.title}
                  className="px-5 py-2 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs disabled:opacity-50 cursor-pointer"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
