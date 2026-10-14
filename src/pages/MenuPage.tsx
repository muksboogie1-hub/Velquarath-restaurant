import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Flame, Calendar, Info, ArrowUpRight } from 'lucide-react';
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  MenuCategoryId,
  MenuItem,
} from '../data/menuData';
import { ResilientImage } from '../components/ResilientImage';
import { PageRoute } from '../components/Layout';
import { useContent } from '../context/ContentContext';

interface MenuPageProps {
  initialCategory?: string;
  onNavigate: (page: PageRoute) => void;
}

const POPULAR_SEARCH_TERMS = [
  'Sticky Ribs',
  'Oxtail',
  'Sadza',
  'Kariba Bream',
  'Big Dad Burger',
  'Road Runner',
  'Cocktail',
  'Coffee',
];

function scoreMenuItem(item: MenuItem, rawQuery: string): number {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return 1;

  const searchableText = [
    item.name,
    item.description,
    item.categoryLabel,
    item.dietaryOrNote || '',
  ]
    .join(' ')
    .toLowerCase();

  const nameLower = item.name.toLowerCase();

  // Exact or substring match gets highest priority
  if (nameLower === q) return 100;
  if (nameLower.startsWith(q)) return 85;
  if (nameLower.includes(q)) return 75;
  if (searchableText.includes(q)) return 60;

  // Multi-word token matching (all words or any word)
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const matchedTokens = tokens.filter((t) => searchableText.includes(t));
    if (matchedTokens.length === tokens.length) return 55;
    if (matchedTokens.length > 0) return 30 + matchedTokens.length * 5;
  }

  // Typo-tolerant prefix/character subsequence check for queries >= 3 chars
  if (q.length >= 3) {
    const words = searchableText.split(/[^a-z0-9]+/).filter(Boolean);
    for (const w of words) {
      if (w.startsWith(q.slice(0, 3))) {
        return 20;
      }
    }
  }

  return 0;
}

export const MenuPage: React.FC<MenuPageProps> = ({ initialCategory, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      initialCategory &&
      MENU_CATEGORIES.some((cat) => cat.id === initialCategory)
    ) {
      setSelectedCategory(initialCategory as MenuCategoryId);
    }
  }, [initialCategory]);

  // Close autocomplete dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { menuItems } = useContent();
  const activeMenuItems = useMemo(() => {
    return menuItems && menuItems.length > 0 ? menuItems : MENU_ITEMS;
  }, [menuItems]);

  const isSearching = searchQuery.trim().length > 0;

  // Global search across ALL categories whenever a query is typed,
  // or category-filtered items when no search query is entered.
  const searchScoredItems = useMemo(() => {
    if (!isSearching) {
      return activeMenuItems.filter(
        (item) => selectedCategory === 'all' || item.category === selectedCategory
      );
    }

    return activeMenuItems
      .map((item) => ({
        item,
        score: scoreMenuItem(item, searchQuery),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [activeMenuItems, selectedCategory, searchQuery, isSearching]);

  // Autocomplete recommendations shown in the dropdown
  const recommendedDropdownItems = useMemo(() => {
    if (!isSearching) {
      return activeMenuItems.filter((i) => i.featured).slice(0, 6);
    }
    return searchScoredItems.slice(0, 6);
  }, [activeMenuItems, isSearching, searchScoredItems]);

  // Group items by category when not actively searching
  const groupedSections = useMemo(() => {
    const activeCategories =
      isSearching || selectedCategory === 'all'
        ? MENU_CATEGORIES.filter((c) => c.id !== 'all')
        : MENU_CATEGORIES.filter((c) => c.id === selectedCategory);

    return activeCategories
      .map((cat) => ({
        ...cat,
        items: searchScoredItems.filter((item) => item.category === cat.id),
      }))
      .filter((section) => section.items.length > 0);
  }, [selectedCategory, searchScoredItems, isSearching]);

  const handleSelectRecommendation = (item: MenuItem) => {
    setSearchQuery(item.name);
    setSelectedCategory('all');
    setIsSearchFocused(false);
    setHighlightedItemId(item.id);

    setTimeout(() => {
      const el = document.getElementById(`menu-card-${item.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);

    setTimeout(() => {
      setHighlightedItemId(null);
    }, 2600);
  };

  return (
    <div className="py-12 md:py-20 bg-[#141210] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold text-[#C9A24B] tracking-wide mb-2">
            Velquarath Cafe · Complete Culinary &amp; Bar Menu
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#F4ECDA]">
            The Menu
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#B8AD96] leading-relaxed">
            From our signature BBQ-glazed sticky ribs and flame-grilled meats to traditional Zimbabwean oxtail, free-range road runner, Kariba bream, steaming sadza, hearty breakfasts, stacked burgers, and house cocktails.
          </p>
        </div>

        {/* Search & Interactive Category Filter Bar */}
        <div className="sticky top-16 z-30 py-4 bg-[#141210]/95 backdrop-blur-md border-y border-[#332E26] mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search input + Instant Autocomplete & Recommendations Dropdown */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-xl">
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSearchFocused(false);
                }}
                className="relative"
              >
                <label htmlFor="menu-search-input" className="sr-only">
                  Search dishes or drinks
                </label>
                <Search
                  className="w-4 h-4 text-[#C9A24B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="menu-search-input"
                  type="text"
                  autoComplete="off"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSearchFocused(false);
                    }
                  }}
                  placeholder="Search ribs, oxtail, sadza, bream, burger, cocktail..."
                  className="w-full pl-10 pr-24 py-2.5 text-sm bg-[#1E1B17] text-[#F4ECDA] placeholder-[#B8AD96]/60 border border-[#332E26] rounded-lg focus:border-[#C9A24B]"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setHighlightedItemId(null);
                      }}
                      aria-label="Clear search query"
                      className="p-1.5 text-[#B8AD96] hover:text-[#F4ECDA] rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-xs font-semibold bg-[#C9A24B] text-[#141210] rounded hover:bg-[#DFB85E] transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Live Search Recommendations & Autocomplete Popover */}
              {isSearchFocused && (
                <div
                  role="listbox"
                  aria-label="Menu search recommendations"
                  className="absolute left-0 right-0 top-full mt-2 bg-[#1E1B17] border border-[#C9A24B]/50 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
                >
                  {/* Quick Popular Search Suggestions */}
                  <div className="p-3 bg-[#141210] border-b border-[#332E26]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#B8AD96]">
                        {isSearching ? 'Quick Filter Suggestions' : 'Popular Searches'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSearchFocused(false)}
                        className="text-[11px] text-[#B8AD96] hover:text-[#F4ECDA]"
                      >
                        Close
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SEARCH_TERMS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setSearchQuery(term);
                            setSelectedCategory('all');
                            setIsSearchFocused(false);
                          }}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                            searchQuery.toLowerCase() === term.toLowerCase()
                              ? 'bg-[#C9A24B] text-[#141210] border-[#C9A24B] font-semibold'
                              : 'bg-[#1E1B17] text-[#F4ECDA] border-[#332E26] hover:border-[#C9A24B]'
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Matching Dish & Drink Recommendations */}
                  <div className="p-2">
                    <p className="px-2.5 py-1.5 text-[11px] font-semibold text-[#C9A24B]">
                      {isSearching
                        ? `Recommended Matches (${searchScoredItems.length} found)`
                        : 'Chef & Bar Recommendations'}
                    </p>

                    {recommendedDropdownItems.length === 0 ? (
                      <div className="px-3 py-4 text-xs text-[#B8AD96]">
                        No direct match for "{searchQuery}". Try searching for{' '}
                        <button
                          type="button"
                          onClick={() => setSearchQuery('Ribs')}
                          className="text-[#C9A24B] underline"
                        >
                          Ribs
                        </button>
                        ,{' '}
                        <button
                          type="button"
                          onClick={() => setSearchQuery('Oxtail')}
                          className="text-[#C9A24B] underline"
                        >
                          Oxtail
                        </button>
                        , or{' '}
                        <button
                          type="button"
                          onClick={() => setSearchQuery('Cocktail')}
                          className="text-[#C9A24B] underline"
                        >
                          Cocktail
                        </button>
                        .
                      </div>
                    ) : (
                      <ul className="divide-y divide-[#332E26]/60">
                        {recommendedDropdownItems.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => handleSelectRecommendation(item)}
                              className="w-full px-3 py-2.5 text-left hover:bg-[#26221D] rounded-lg flex items-center justify-between gap-3 transition-colors group"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-display text-sm font-bold text-[#F4ECDA] group-hover:text-[#C9A24B] truncate">
                                    {item.name}
                                  </span>
                                  {item.price && (
                                    <span className="font-mono-num text-xs font-semibold text-[#C9A24B]">
                                      {item.price}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#B8AD96] truncate">
                                  {item.categoryLabel} · {item.description}
                                </p>
                              </div>
                              <ArrowUpRight
                                className="w-4 h-4 text-[#B8AD96] group-hover:text-[#C9A24B] shrink-0"
                                aria-hidden="true"
                              />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-[#B8AD96] font-mono-num">
              <span>
                Showing {searchScoredItems.length} of {MENU_ITEMS.length} items
              </span>
              {(isSearching || selectedCategory !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setHighlightedItemId(null);
                  }}
                  className="text-[#C9A24B] hover:underline font-sans font-semibold"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Interactive Filter Controls */}
          <div
            role="tablist"
            aria-label="Menu category filter"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
          >
            {MENU_CATEGORIES.map((category) => {
              const isSelected = !isSearching && selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    if (isSearching) {
                      setSearchQuery('');
                    }
                  }}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#C9A24B] text-[#141210] font-semibold shadow-sm'
                      : 'bg-[#1E1B17] text-[#B8AD96] border border-[#332E26] hover:text-[#F4ECDA] hover:border-[#C9A24B]/40'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Search Banner */}
        {isSearching && (
          <div className="mb-8 p-4 rounded-xl bg-[#1E1B17] border border-[#C9A24B]/40 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-[#F4ECDA]">
              Search results for <span className="font-bold text-[#C9A24B]">"{searchQuery}"</span> across all menu categories ({searchScoredItems.length} {searchScoredItems.length === 1 ? 'match' : 'matches'})
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3 py-1.5 text-xs font-semibold bg-[#26221D] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B]"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Empty Search State with Recommended Dishes */}
        {groupedSections.length === 0 ? (
          <div className="bg-[#1E1B17] border border-[#332E26] rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-8">
            <h2 className="font-display text-2xl font-bold text-[#F4ECDA] mb-2">
              No exact match for "{searchQuery}"
            </h2>
            <p className="text-sm text-[#B8AD96] mb-6">
              Try one of our popular dishes or categories below, or reset the search to browse the full menu:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {POPULAR_SEARCH_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="px-3.5 py-2 text-xs font-semibold bg-[#141210] text-[#F4ECDA] border border-[#332E26] rounded-lg hover:border-[#C9A24B]"
                >
                  {term}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 text-xs font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors"
            >
              Show All 45+ Menu Items
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {groupedSections.map((section) => (
              <section
                key={section.id}
                aria-labelledby={`heading-${section.id}`}
                className="scroll-mt-36"
              >
                <div className="pb-4 mb-8 border-b border-[#332E26] flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <h2
                      id={`heading-${section.id}`}
                      className="font-display text-2xl sm:text-3xl font-bold text-[#F4ECDA]"
                    >
                      {section.label}
                    </h2>
                    <p className="text-sm text-[#B8AD96] mt-1">{section.subtitle}</p>
                  </div>
                  <span className="text-xs font-mono-num text-[#C9A24B]">
                    {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item: MenuItem) => {
                    const isHighlighted = highlightedItemId === item.id;
                    return (
                      <article
                        id={`menu-card-${item.id}`}
                        key={item.id}
                        className={`bg-[#1E1B17] border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                          isHighlighted
                            ? 'border-[#C9A24B] ring-2 ring-[#C9A24B]'
                            : item.comingSoon
                            ? 'border-[#7A4A22] opacity-90'
                            : 'border-[#332E26] hover:border-[#C9A24B]/60'
                        }`}
                      >
                        <div>
                          <div className="h-44 w-full overflow-hidden">
                            <ResilientImage
                              src={item.image}
                              alt={item.imageAlt}
                              fallbackTitle={item.name}
                              containerClassName="w-full h-full"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-5">
                            <div className="flex items-baseline justify-between gap-3 mb-2">
                              <h3 className="font-display text-lg font-bold text-[#F4ECDA]">
                                {item.name}
                              </h3>
                              {item.isAvailable === false ? (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60 shrink-0">
                                  Sold Out
                                </span>
                              ) : item.price ? (
                                <span className="font-mono-num text-base font-bold text-[#C9A24B] shrink-0">
                                  {item.price}
                                </span>
                              ) : item.comingSoon ? (
                                <span className="text-xs font-semibold text-[#C9A24B] shrink-0 flex items-center gap-1">
                                  <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>Coming Soon</span>
                                </span>
                              ) : (
                                <span
                                  className="text-xs text-[#B8AD96]/80 shrink-0 italic"
                                  title="Seasonal or daily board pricing — ask your server"
                                >
                                  Ask server
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#B8AD96] leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-4 pt-3 border-t border-[#332E26]/60 flex items-center justify-between text-xs text-[#B8AD96]/80">
                          <span>{item.categoryLabel}</span>
                          {item.dietaryOrNote && (
                            <span className="text-[#C9A24B]/90 truncate max-w-[180px]">
                              {item.dietaryOrNote}
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Pricing & Dietary Note + CTA */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-[#1E1B17] border border-[#332E26] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-3.5 max-w-2xl">
            <Info className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm text-[#B8AD96] leading-relaxed">
              <p className="font-semibold text-[#F4ECDA] mb-1">
                Menu Pricing, Allergens &amp; Group Catering
              </p>
              <p>
                Off-the-grill prices are listed in USD. For traditional mains, daily market fish (Kariba bream), game curries, and bar specials, please check our in-house chalkboards or ask your server. High chairs and a kids’ menu are available for families.
              </p>
            </div>
          </div>

          <a
            href="#reservations"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('reservations');
            }}
            className="px-5 py-3 text-xs sm:text-sm font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Reserve Your Table</span>
          </a>
        </div>
      </div>
    </div>
  );
};
