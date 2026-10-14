import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Calendar } from 'lucide-react';
import {
  GALLERY_ITEMS,
  GalleryCategory,
  GalleryItem,
} from '../data/galleryData';
import { ResilientImage } from '../components/ResilientImage';
import { PageRoute } from '../components/Layout';
import { useContent } from '../context/ContentContext';

interface GalleryPageProps {
  onNavigate: (page: PageRoute) => void;
}

const GALLERY_FILTERS: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All Photography' },
  { id: 'grill', label: 'Off the Grill' },
  { id: 'traditional', label: 'Traditional Dishes' },
  { id: 'burgers-platters', label: 'Brunch, Burgers & Platters' },
  { id: 'drinks-vibe', label: 'Cocktails, Bar & Patio' },
];

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const { galleryItems } = useContent();
  const allGalleryItems = galleryItems && galleryItems.length > 0 ? galleryItems : GALLERY_ITEMS;
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredGallery =
    activeFilter === 'all'
      ? allGalleryItems
      : allGalleryItems.filter((item) => item.category === activeFilter);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredGallery.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredGallery.length) % filteredGallery.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredGallery.length]);

  const currentLightboxItem: GalleryItem | null =
    lightboxIndex !== null && filteredGallery[lightboxIndex]
      ? filteredGallery[lightboxIndex]
      : null;

  return (
    <div className="py-12 md:py-20 bg-[#141210] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold text-[#C9A24B] tracking-wide mb-2">
            Visual Showcase · Food, Cocktails &amp; Atmosphere
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#F4ECDA]">
            Gallery
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#B8AD96] leading-relaxed">
            Explore our flame-grilled sticky ribs, traditional oxtail and sadza, whole Kariba bream, gourmet burgers, sharing platters, craft cocktails, and emerald-lit patio bar. Click any photograph to inspect in full screen.
          </p>
        </div>

        {/* Interactive Filter Tabs */}
        <div
          role="tablist"
          aria-label="Gallery category filter"
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#332E26]"
        >
          {GALLERY_FILTERS.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.id);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#C9A24B] text-[#141210] font-semibold'
                    : 'bg-[#1E1B17] text-[#B8AD96] border border-[#332E26] hover:text-[#F4ECDA]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => (
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className={`group relative rounded-xl overflow-hidden bg-[#1E1B17] border border-[#332E26] flex flex-col ${
                item.spanWide && activeFilter === 'all' ? 'md:col-span-2' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`View larger image of ${item.title}`}
                className="relative h-72 sm:h-80 w-full overflow-hidden text-left focus:outline-none"
              >
                <ResilientImage
                  src={item.src}
                  alt={item.alt}
                  fallbackTitle={item.title}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute top-3 right-3 p-2 rounded-lg bg-[#141210]/80 text-[#F4ECDA] border border-[#332E26] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-medium text-[#C9A24B] mb-1">
                    {item.categoryLabel}
                  </p>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#F4ECDA]">
                    {item.title}
                  </h2>
                </div>
              </button>
              <figcaption className="p-4 text-xs sm:text-sm text-[#B8AD96] leading-relaxed border-t border-[#332E26] bg-[#1E1B17]">
                {item.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-[#1E1B17] border border-[#332E26] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#F4ECDA]">
              Ready to experience Velquarath Cafe in person?
            </h2>
            <p className="text-sm text-[#B8AD96] mt-1">
              Book a table on the patio, reserve our private dining room, or join us for live music and sport.
            </p>
          </div>
          <a
            href="#reservations"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('reservations');
            }}
            className="px-6 py-3 text-sm font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Book a Table</span>
          </a>
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {currentLightboxItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentLightboxItem.title}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-5xl w-full bg-[#1E1B17] border border-[#332E26] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#332E26] bg-[#141210]">
              <div>
                <span className="text-xs text-[#C9A24B] font-medium">
                  {currentLightboxItem.categoryLabel}
                </span>
                <span className="mx-2 text-[#332E26]">·</span>
                <span className="text-xs font-mono-num text-[#B8AD96]">
                  Image {lightboxIndex + 1} of {filteredGallery.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close image viewer"
                className="p-2 text-[#B8AD96] hover:text-[#F4ECDA] rounded-lg bg-[#1E1B17] border border-[#332E26]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={currentLightboxItem.src}
                alt={currentLightboxItem.alt}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />

              {filteredGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + filteredGallery.length) %
                          filteredGallery.length
                      )
                    }
                    aria-label="Previous image"
                    className="absolute left-3 p-2.5 rounded-full bg-[#141210]/85 text-[#F4ECDA] border border-[#332E26] hover:border-[#C9A24B]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % filteredGallery.length)
                    }
                    aria-label="Next image"
                    className="absolute right-3 p-2.5 rounded-full bg-[#141210]/85 text-[#F4ECDA] border border-[#332E26] hover:border-[#C9A24B]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-5 bg-[#1E1B17] border-t border-[#332E26]">
              <h3 className="font-display text-xl font-bold text-[#F4ECDA]">
                {currentLightboxItem.title}
              </h3>
              <p className="text-sm text-[#B8AD96] mt-1">
                {currentLightboxItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
