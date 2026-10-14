import React from 'react';
import { motion } from 'motion/react';
import { Flame, Coffee, Music, Users, Accessibility, CreditCard, Calendar } from 'lucide-react';
import { GENERATED_IMAGES } from '../data/images';
import { VIBE_HIGHLIGHTS, VIBE_SECTIONS } from '../data/menuData';
import { ResilientImage } from '../components/ResilientImage';
import { PageRoute } from '../components/Layout';
import { useContent } from '../context/ContentContext';

interface StoryPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ onNavigate }) => {
  const { siteContent } = useContent();

  return (
    <div className="py-12 md:py-20 bg-[#141210] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-16 border-b border-[#332E26]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            <p className="text-xs font-semibold text-[#C9A24B] tracking-wide mb-2">
              Our Story &amp; Philosophy
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#F4ECDA] leading-tight">
              {siteContent?.storyHeadline || 'Where Zimbabwean Heritage Meets the Open Flame'}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#B8AD96] leading-relaxed">
              {siteContent?.storyIntro || 'Velquarath Cafe was born from a simple conviction: that traditional Zimbabwean plates, smoky off-the-grill ribs, strong barista coffee, and cold craft cocktails belong together under one roof.'}
            </p>
            <p className="mt-4 text-sm sm:text-base text-[#B8AD96] leading-relaxed">
              Whether you are stopping in for an early Afropolitan breakfast, gathering with colleagues over Oxtail &amp; Beans and steaming White or Brown Sadza, watching live sport on the big screen, or staying late by the fireplace for live music and an Afrotopia Gnt, our space is crafted to feel warm, unpretentious, and unmistakably African.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#menu"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('menu');
                }}
                className="px-5 py-3 text-sm font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors whitespace-nowrap shrink-0"
              >
                Explore Our Menu
              </a>
              <a
                href="#reservations"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('reservations');
                }}
                className="px-5 py-3 text-sm font-semibold bg-[#1E1B17] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B] transition-colors whitespace-nowrap shrink-0"
              >
                Book a Table
              </a>
            </div>
          </motion.div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#332E26] shadow-2xl bg-[#1E1B17]">
              <div className="h-80 sm:h-[420px]">
                <ResilientImage
                  src={GENERATED_IMAGES.interiorPatio}
                  alt="Velquarath Cafe evening patio, glowing fireplace, and emerald-lit bar"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-[#1E1B17] border-t border-[#332E26] text-xs text-[#B8AD96]">
                Eat on the patio, gather around the indoor fireplace, watch the game, and stay for the music.
              </div>
            </div>
          </div>
        </div>

        {/* Three Pillars of Velquarath */}
        <div className="py-16 border-b border-[#332E26]">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4ECDA] mb-10">
            The Three Pillars of Velquarath Cafe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6">
              <Flame className="w-6 h-6 text-[#C9A24B] mb-4" aria-hidden="true" />
              <h3 className="font-display text-xl font-bold text-[#F4ECDA] mb-2">
                01. Fire-Grilled Mastery &amp; Traditional Pots
              </h3>
              <p className="text-sm text-[#B8AD96] leading-relaxed">
                We honour both the open braai grill and the slow clay pot. Our Sticky Ribs, XL Ribs, Bambazonke kebabs, and BBQ Chicken share the stage with Road Runner, Kariba Bream with Soup, Impala Curry, Rabbit (Tsuro), and Derere Rine Matemba.
              </p>
            </div>

            <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6">
              <Coffee className="w-6 h-6 text-[#C9A24B] mb-4" aria-hidden="true" />
              <h3 className="font-display text-xl font-bold text-[#F4ECDA] mb-2">
                02. From Morning Espresso to Late-Night Cocktails
              </h3>
              <p className="text-sm text-[#B8AD96] leading-relaxed">
                Mornings begin with strong espresso, cappuccinos, and hearty breakfasts (Afropolitan, Ranger, Early Bird). As the sun sets, our bartenders shake signature cocktails — Njuzu Fever, The Somgaga, Summa Yo Muthi, The Pungwe, and Chi Slender — alongside ice-cold Zambezi and Black Label lagers.
              </p>
            </div>

            <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-6">
              <Music className="w-6 h-6 text-[#C9A24B] mb-4" aria-hidden="true" />
              <h3 className="font-display text-xl font-bold text-[#F4ECDA] mb-2">
                03. A Welcoming Space for Every Guest
              </h3>
              <p className="text-sm text-[#B8AD96] leading-relaxed">
                Casual, cosy, and a little trendy. Whether you need a private dining room for a celebration, outdoor patio seating with friends, high chairs and a kids’ menu for family brunch, or a quiet table on your own, everyone has a place at our table.
              </p>
            </div>
          </div>
        </div>

        {/* Full Hospitality & Accessibility Details Preserved from Original HTML */}
        <div className="py-16">
          <div className="mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4ECDA]">
              Hospitality, Amenities &amp; Guest Experience
            </h2>
            <p className="text-sm text-[#B8AD96] mt-2">
              Everything we offer to make your visit effortless and memorable:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIBE_SECTIONS.map((sec) => (
              <div
                key={sec.title}
                className="p-6 rounded-xl bg-[#1E1B17] border border-[#332E26]"
              >
                <h3 className="font-display text-lg font-bold text-[#C9A24B] mb-2">
                  {sec.title}
                </h3>
                <p className="text-sm text-[#F4ECDA]/90 leading-relaxed">{sec.body}</p>
              </div>
            ))}

            <div className="p-6 rounded-xl bg-[#172B21] border border-[#C9A24B]/30">
              <h3 className="font-display text-lg font-bold text-[#C9A24B] mb-2">
                Highlights &amp; Features
              </h3>
              <p className="text-xs sm:text-sm text-[#F4ECDA] leading-relaxed">
                {VIBE_HIGHLIGHTS.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
