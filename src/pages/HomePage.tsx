import React from 'react';
import { motion } from 'motion/react';
import { Flame, Music, Tv, Utensils, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { PageRoute } from '../components/Layout';
import {
  RESTAURANT_CONFIG,
  MENU_ITEMS,
  VIBE_HIGHLIGHTS,
  VIBE_SECTIONS,
} from '../data/menuData';
import { GENERATED_IMAGES } from '../data/images';
import { ResilientImage } from '../components/ResilientImage';
import { AmbientEmberCanvas } from '../components/AmbientEmberCanvas';
import { useContent } from '../context/ContentContext';

interface HomePageProps {
  onNavigate: (page: PageRoute, category?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { menuItems, restaurantConfig, siteContent, appearance } = useContent();
  const config = restaurantConfig?.name ? restaurantConfig : RESTAURANT_CONFIG;
  const items = menuItems?.length ? menuItems : MENU_ITEMS;
  const heroImageSrc = appearance?.customHeroUrl || GENERATED_IMAGES.heroFeast;

  const grillDishes = items.filter((item) => item.category === 'grill' && !item.comingSoon && item.isAvailable !== false);
  const traditionalHighlights = items.filter((item) => item.category === 'traditional' && item.isAvailable !== false).slice(0, 4);

  return (
    <div>
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[84vh] flex items-end overflow-hidden bg-[#141210] border-b border-[#332E26]">
        {/* Background Feast Photography */}
        <div className="absolute inset-0 z-0">
          <ResilientImage
            src={heroImageSrc}
            alt={`${config.name} candlelit feast with sticky BBQ pork ribs, traditional white sadza, slow-braised oxtail in a clay pot, and whole grilled Kariba bream`}
            loading="eager"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Measured Contrast Scrim for WCAG AA Legibility */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/75 to-[#141210]/30"
            aria-hidden="true"
          />
        </div>

        {/* Subtle Interactive Ember Canvas Overlay */}
        <AmbientEmberCanvas className="absolute inset-0 z-10 w-full h-full opacity-75" />

        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#C9A24B] mb-3">
              {siteContent?.heroBadge || 'Off-the-Grill Meats · Traditional Zimbabwean Plates · Craft Cocktails · Live Music'}
            </p>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F4ECDA] leading-[1.05]">
              {siteContent?.heroTitle || config.name}
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-[#F4ECDA]/90 leading-relaxed max-w-2xl">
              {siteContent?.heroTagline || config.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#reservations"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('reservations');
                }}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-lg"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Book a Table</span>
              </a>
              <a
                href="#menu"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('menu');
                }}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold bg-[#1E1B17]/90 text-[#F4ECDA] border border-[#F4ECDA]/30 rounded-lg hover:border-[#C9A24B] hover:text-[#C9A24B] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Utensils className="w-4 h-4" aria-hidden="true" />
                <span>Explore Full Menu</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. OFF THE GRILL & TRADITIONAL SHOWCASE */}
      <section className="py-20 md:py-24 bg-[#141210] border-b border-[#332E26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-semibold text-[#C9A24B] tracking-wide mb-2">
                01. Signature Flame-Grilled Favorites
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F4ECDA]">
                Off the Grill
              </h2>
              <p className="mt-2 text-base text-[#B8AD96] max-w-xl">
                Fire-grilled meat, glazed in our signature BBQ sauce and served with fries.
              </p>
            </div>
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('menu', 'grill');
              }}
              className="text-sm font-semibold text-[#C9A24B] hover:text-[#DFB85E] flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>See All 45+ Menu Items</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* 6 Off-the-Grill Cards with Supplied Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grillDishes.map((dish, idx) => (
              <motion.article
                key={dish.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group bg-[#1E1B17] border border-[#332E26] rounded-xl overflow-hidden flex flex-col hover:border-[#C9A24B]/60 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="h-48 w-full overflow-hidden">
                  <ResilientImage
                    src={dish.image}
                    alt={dish.imageAlt}
                    fallbackTitle={dish.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h3 className="font-display text-xl font-bold text-[#F4ECDA]">
                        {dish.name}
                      </h3>
                      {dish.price && (
                        <span className="font-mono-num text-lg font-bold text-[#C9A24B] shrink-0">
                          {dish.price}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#B8AD96] leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                  {dish.dietaryOrNote && (
                    <p className="mt-4 pt-3 border-t border-[#332E26]/80 text-xs text-[#B8AD96]/80">
                      {dish.dietaryOrNote}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {/* Coming Soon Callout */}
          <div className="mt-8 p-5 rounded-xl bg-[#1E1B17] border border-[#332E26] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-[#C9A24B] shrink-0" aria-hidden="true" />
              <p className="text-sm font-medium text-[#F4ECDA]">
                <span className="text-[#C9A24B] font-semibold">Coming soon:</span> Sweet Pork &amp; Frites — sticky pork belly served with fries.
              </p>
            </div>
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('menu');
              }}
              className="text-xs font-semibold text-[#C9A24B] hover:underline whitespace-nowrap shrink-0"
            >
              View Full Menu &amp; Drinks →
            </a>
          </div>

          {/* Traditional Zimbabwean Kitchen Preview */}
          <div className="mt-20 pt-16 border-t border-[#332E26] grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#C9A24B] tracking-wide mb-2">
                  02. Heritage &amp; Heart
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F4ECDA]">
                  Traditional Zimbabwean Mains, Sadza &amp; Starters
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#B8AD96] leading-relaxed">
                  From slow-braised Oxtail &amp; Beans, free-range Road Runner, and whole Kariba Bream with Soup to Impala Curry, Rabbit (Tsuro), Madora, and Derere Rine Matemba — served with steaming White or Brown Sadza or Rice, Beans &amp; Nuts.
                </p>

                <ul className="mt-6 space-y-3">
                  {traditionalHighlights.map((item) => (
                    <li
                      key={item.id}
                      className="pb-3 border-b border-[#332E26] flex items-start justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-base font-semibold text-[#F4ECDA]">{item.name}</h3>
                        <p className="text-xs text-[#B8AD96] mt-0.5">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#menu"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('menu', 'traditional');
                  }}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors whitespace-nowrap shrink-0"
                >
                  Explore Traditional Dishes
                </a>
                <a
                  href="#story"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('story');
                  }}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold bg-[#1E1B17] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B] transition-colors whitespace-nowrap shrink-0"
                >
                  Read Our Story
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl overflow-hidden border border-[#332E26] bg-[#1E1B17] flex flex-col">
                <div className="h-64 sm:h-full">
                  <ResilientImage
                    src={GENERATED_IMAGES.oxtailSadza}
                    alt="Traditional Zimbabwean Oxtail and Beans stew with steaming white sadza and greens"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-[#1E1B17] border-t border-[#332E26]">
                  <p className="font-display text-sm font-semibold text-[#F4ECDA]">
                    Oxtail &amp; Beans with White Sadza
                  </p>
                  <p className="text-xs text-[#B8AD96]">
                    Slow-braised oxtail, sugar beans, steaming white sadza &amp; greens
                  </p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-[#332E26] bg-[#1E1B17] flex flex-col">
                <div className="h-64 sm:h-full">
                  <ResilientImage
                    src={GENERATED_IMAGES.bigDadBurger}
                    alt="The Big Dad Burger with beef patty, fried egg, bacon, melted cheese and fries"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-[#1E1B17] border-t border-[#332E26]">
                  <p className="font-display text-sm font-semibold text-[#F4ECDA]">
                    Brunch, Burgers &amp; Afro Platter
                  </p>
                  <p className="text-xs text-[#B8AD96]">
                    Big Dad Burger, Afropolitan Breakfast &amp; sharing platters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE VIBE SECTION ("Come for the food, stay for the night") */}
      <section className="py-20 md:py-24 bg-[#172B21] border-b border-[#332E26] text-[#F4ECDA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold text-[#C9A24B] tracking-wide mb-2">
                03. The Velquarath Atmosphere
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F4ECDA]">
                Come for the food, stay for the night
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#E2D9C5] max-w-2xl leading-relaxed">
                Casual, cosy and a little trendy. A good spot for groups, tourists and a quiet meal on your own.
              </p>

              {/* Unboxed Clean Typography Separator List (Zero-Pill Discipline) */}
              <div className="mt-6 pt-6 border-t border-[#C9A24B]/30">
                <p className="text-xs font-semibold text-[#C9A24B] mb-2">
                  What Awaits You at Velquarath Cafe
                </p>
                <p className="text-sm sm:text-base text-[#F4ECDA] leading-loose">
                  {VIBE_HIGHLIGHTS.map((item, index) => (
                    <React.Fragment key={item}>
                      <span className="font-medium">{item}</span>
                      {index < VIBE_HIGHLIGHTS.length - 1 && (
                        <span className="mx-2.5 text-[#C9A24B]" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#C9A24B]/30">
                {VIBE_SECTIONS.map((sec) => (
                  <div key={sec.title}>
                    <h3 className="font-display text-lg font-semibold text-[#C9A24B] mb-1">
                      {sec.title}
                    </h3>
                    <p className="text-sm text-[#E2D9C5] leading-relaxed">{sec.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#C9A24B]/40 shadow-2xl bg-[#141210]">
                <div className="h-80 sm:h-96">
                  <ResilientImage
                    src={GENERATED_IMAGES.interiorPatio}
                    alt="Velquarath Cafe outdoor patio, indoor fireplace, and emerald-lit cocktail bar at night"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 bg-[#141210] border-t border-[#332E26]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#F4ECDA]">
                        Patio, Fireplace &amp; Cocktail Bar
                      </h3>
                      <p className="text-xs text-[#B8AD96] mt-1">
                        Afrotopia Gnt · Njuzu Fever · The Somgaga · Summa Yo Muthi · The Pungwe · Chi Slender
                      </p>
                    </div>
                    <a
                      href="#gallery"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('gallery');
                      }}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#1E1B17] text-[#C9A24B] border border-[#332E26] rounded-lg hover:border-[#C9A24B] whitespace-nowrap shrink-0"
                    >
                      View Gallery
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SAVE A TABLE / VISIT CALLOUT */}
      <section className="py-20 bg-[#141210]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1E1B17] border border-[#332E26] rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold text-[#C9A24B] tracking-wide mb-2">
                04. Reservations &amp; Enquiries
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F4ECDA]">
                Save a table for brunch, lunch, or live music nights
              </h2>
              <p className="mt-3 text-base text-[#B8AD96] max-w-2xl leading-relaxed">
                Ask about happy-hour drinks, live music nights, private dining room bookings, and what’s showing on the big screen. Brunch and lunch reservations are recommended.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[#B8AD96]">
                <span className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                  <span>Live Music &amp; Late-Night Grill</span>
                </span>
                <span className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                  <span>Live Sport on Screen</span>
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                  <span>Private Dining &amp; Catering</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <a
                href="#reservations"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('reservations');
                }}
                className="w-full text-center px-6 py-3.5 text-sm font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors whitespace-nowrap"
              >
                Book a Table Online
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contact');
                }}
                className="w-full text-center px-6 py-3.5 text-sm font-semibold bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B] transition-colors whitespace-nowrap"
              >
                Contact &amp; Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
