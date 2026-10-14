import { GENERATED_IMAGES } from './images';

/**
 * OWNER CONFIGURATION BLOCK
 * Edit the fields below to update restaurant contact details, WhatsApp booking number,
 * and menu item prices at any time.
 * Leave price as undefined or "" if price is not yet set — the UI will cleanly display
 * "Price on menu / Ask your server" without inventing any prices.
 */
export interface RestaurantConfig {
  name: string;
  tagline: string;
  phone: string; // e.g. "263771234567" (country code, no + or spaces for WhatsApp)
  displayPhone: string; // e.g. "+263 77 123 4567"
  email: string;
  address: string;
  city: string;
  country: string;
  hours: {
    days: string;
    time: string;
  }[];
  backendConfigured: boolean; // Set to true once /api/reservations and /api/contact are connected to email/database
}

export const RESTAURANT_CONFIG: RestaurantConfig = {
  name: 'Velquarath Cafe',
  tagline: 'Sticky ribs, sadza and bream, strong coffee and cold cocktails. Eat on the patio, watch the game, stay for the music.',
  phone: '', // Owner: fill in e.g. "263771234567" to activate direct WhatsApp & phone links
  displayPhone: 'Phone number to be confirmed by owner',
  email: '', // Owner: fill in e.g. "bookings@afropiacafe.co.zw"
  address: 'Harare, Zimbabwe (Exact street address to be confirmed by owner)',
  city: 'Harare',
  country: 'Zimbabwe',
  hours: [
    { days: 'Monday – Thursday', time: '08:00 – 22:00 (Breakfast, Brunch, Lunch & Dinner)' },
    { days: 'Friday – Saturday', time: '08:00 – Late (Live Music, Sport & Late-Night Grill)' },
    { days: 'Sunday', time: '08:30 – 21:00 (Sunday Brunch, Traditional Plates & Jazz)' },
  ],
  backendConfigured: false,
};

export type MenuCategoryId =
  | 'all'
  | 'grill'
  | 'traditional'
  | 'starters-soups'
  | 'starches'
  | 'breakfast'
  | 'brunch-burgers-platters'
  | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategoryId, 'all'>;
  categoryLabel: string;
  price?: string; // Preserved ONLY where supplied in original HTML ($11, $15, $8, $7, $6). Never invented.
  description: string;
  image: string;
  imageAlt: string;
  dietaryOrNote?: string;
  comingSoon?: boolean;
  featured?: boolean;
  isAvailable?: boolean;
  displayOrder?: number;
}

export const MENU_CATEGORIES: { id: MenuCategoryId; label: string; subtitle: string }[] = [
  {
    id: 'all',
    label: 'All Dishes & Drinks',
    subtitle: 'Complete Velquarath Cafe menu across our grill, traditional kitchen, brunch, and bar.',
  },
  {
    id: 'grill',
    label: 'Off the Grill',
    subtitle: 'Fire-grilled meat, glazed in our signature BBQ sauce and served with fries.',
  },
  {
    id: 'traditional',
    label: 'Traditional Mains',
    subtitle: 'Authentic Zimbabwean slow-cooked stews, game, road runner, and whole Kariba bream.',
  },
  {
    id: 'starters-soups',
    label: 'Starters & Soups',
    subtitle: 'Traditional Zimbabwean snacks, roasted groundnuts, mopane worms, and rich broths.',
  },
  {
    id: 'starches',
    label: 'Sadza & Rice',
    subtitle: 'Traditional white and brown sadza, steamed rice, and peanut-enriched grains.',
  },
  {
    id: 'breakfast',
    label: 'Breakfast',
    subtitle: 'Hearty morning plates served with farm eggs, grilled tomato, toast, and beans.',
  },
  {
    id: 'brunch-burgers-platters',
    label: 'Brunch, Burgers & Platters',
    subtitle: 'Stacked gourmet burgers, sharing platters for the table, and crisp salads.',
  },
  {
    id: 'drinks',
    label: 'Cocktails, Beers & Coffee',
    subtitle: 'Signature Velquarath cocktails, ice-cold lagers, specialty espresso, and milkshakes.',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // ========================
  // 1. OFF THE GRILL (with supplied prices preserved)
  // ========================
  {
    id: 'sticky-ribs',
    name: 'Sticky Ribs',
    category: 'grill',
    categoryLabel: 'Off the Grill',
    price: '$11',
    description: 'Fall-off-the-bone pork ribs glazed in signature BBQ sauce, served with fries.',
    image: GENERATED_IMAGES.stickyRibsGrill,
    imageAlt: 'Flame-grilled sticky pork ribs glazed in dark BBQ sauce served with crispy golden fries',
    dietaryOrNote: 'Signature Grill · Served with fries',
    featured: true,
  },
  {
    id: 'xl-ribs',
    name: 'XL Ribs',
    category: 'grill',
    categoryLabel: 'Off the Grill',
    price: '$15',
    description: 'A double portion of our ribs, for double the deliciousness.',
    image: GENERATED_IMAGES.stickyRibsGrill,
    imageAlt: 'Double rack of flame-grilled XL pork ribs with smoky barbecue glaze and fries',
    dietaryOrNote: 'Double Portion · Served with fries',
    featured: true,
  },
  {
    id: 'the-bro-meal',
    name: 'The Bro Meal',
    category: 'grill',
    categoryLabel: 'Off the Grill',
    price: '$8',
    description: 'Steak and two fried eggs, served with fries.',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Char-grilled steak topped with two fried eggs and served with golden fries',
    dietaryOrNote: 'Steak & Eggs · Served with fries',
    featured: true,
  },
  {
    id: 'the-bambazonke',
    name: 'The Bambazonke',
    category: 'grill',
    categoryLabel: 'Off the Grill',
    price: '$7',
    description: 'Two kebabs of sausage, chicken tenders, grilled peppers and cherry tomatoes, with two wings and fries.',
    image: GENERATED_IMAGES.stickyRibsGrill,
    imageAlt: 'Two grilled skewers of sausage, chicken tenders, peppers and cherry tomatoes with wings and fries',
    dietaryOrNote: '2 Kebabs + 2 Wings · Served with fries',
    featured: true,
  },
  {
    id: 'bbq-chicken',
    name: 'BBQ Chicken',
    category: 'grill',
    categoryLabel: 'Off the Grill',
    price: '$6',
    description: 'Quarter or half chicken, grilled and glazed in BBQ sauce.',
    image: GENERATED_IMAGES.stickyRibsGrill,
    imageAlt: 'Fire-grilled chicken glazed in rich smoky BBQ sauce',
    dietaryOrNote: 'Quarter or Half Chicken',
  },
  {
    id: 'issa-wrap-remix',
    name: 'Issa Wrap Remix',
    category: 'grill',
    categoryLabel: 'Off the Grill',
    price: '$6',
    description: 'Your favourite wrap, bigger and better. Choose chicken or veggie explosion.',
    image: GENERATED_IMAGES.bigDadBurger,
    imageAlt: 'Toasted gourmet wrap filled with grilled chicken or roasted vegetables',
    dietaryOrNote: 'Chicken or Veggie Explosion',
  },
  {
    id: 'sweet-pork-frites',
    name: 'Sweet Pork & Frites',
    category: 'grill',
    categoryLabel: 'Off the Grill',
    description: 'Sticky pork belly served with fries.',
    image: GENERATED_IMAGES.stickyRibsGrill,
    imageAlt: 'Glazed sticky pork belly slices served with crispy fries',
    dietaryOrNote: 'Coming Soon to the Grill',
    comingSoon: true,
  },

  // ========================
  // 2. TRADITIONAL MAINS
  // ========================
  {
    id: 'oxtail-and-beans',
    name: 'Oxtail & Beans',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    description: 'Slow-braised tender oxtail simmered with sugar beans in a rich, savory gravy. Pairs with white or brown sadza or rice.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Slow-cooked Zimbabwean oxtail and beans stew in a clay bowl with white sadza and greens',
    dietaryOrNote: 'House Traditional Specialty',
    featured: true,
  },
  {
    id: 'road-runner',
    name: 'Road Runner',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    description: 'Authentic free-range country chicken (huku yemusha) slow-simmered until tender in a traditional tomato and onion broth.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Traditional free-range road runner chicken stew served hot',
    dietaryOrNote: 'Free-Range Country Chicken',
  },
  {
    id: 'smoked-pork-bones',
    name: 'Smoked Pork Bones',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    description: 'Meaty smoked pork bones braised with aromatic herbs, onions, and tomatoes for a deep, smoky broth.',
    image: GENERATED_IMAGES.stickyRibsGrill,
    imageAlt: 'Braised smoked pork bones in rich savory sauce',
    dietaryOrNote: 'Slow-Braised & Smoky',
  },
  {
    id: 'beef-bones-chicken-livers',
    name: 'Beef Bones & Chicken Livers',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    description: 'Hearty combination of marrow-rich beef bones and tender pan-simmered chicken livers in a spiced onion gravy.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Traditional beef bones and chicken livers stew',
    dietaryOrNote: 'Rich & Hearty',
  },
  {
    id: 'rabbit-tsuro',
    name: 'Rabbit (Tsuro)',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    description: 'Traditional Zimbabwean prepared rabbit (tsuro), gently roasted and braised in a savory herb and tomato reduction.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Traditional braised rabbit tsuro dish',
    dietaryOrNote: 'Traditional Delicacy',
  },
  {
    id: 'kariba-bream-with-soup',
    name: 'Kariba Bream with Soup',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    description: 'Whole fresh Kariba bream, seasoned and flame-grilled or pan-crisped, served with a light, aromatic tomato and onion soup.',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Whole grilled Kariba bream fish with fresh lemon, herbs, and savory broth',
    dietaryOrNote: 'Whole Fresh Fish',
    featured: true,
  },
  {
    id: 'impala-curry',
    name: 'Impala Curry',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    description: 'Lean, tender impala venison slow-cooked in a warming blend of roasted spices, garlic, ginger, and rich curry sauce.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Spiced impala venison curry in a stoneware bowl',
    dietaryOrNote: 'Game Specialty',
  },
  {
    id: 'rabbit-masala',
    name: 'Rabbit Masala',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    description: 'Succulent rabbit pieces simmered in a fragrant masala sauce with toasted spices, tomatoes, and fresh coriander.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Fragrant rabbit masala curry with fresh coriander',
    dietaryOrNote: 'Spiced Masala',
  },
  {
    id: 'grilled-guinea-fowl',
    name: 'Grilled Guinea Fowl',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    description: 'Char-grilled guinea fowl (hanga) basted with herbs and served tender with traditional accompaniments.',
    image: GENERATED_IMAGES.stickyRibsGrill,
    imageAlt: 'Flame-grilled guinea fowl with charred skin and herbs',
    dietaryOrNote: 'Flame-Grilled Game Bird',
  },

  // ========================
  // 3. STARTERS & SOUPS
  // ========================
  {
    id: 'roasted-nzungu',
    name: 'Roasted Nzungu',
    category: 'starters-soups',
    categoryLabel: 'Starters & Soups',
    description: 'Traditionally pan-roasted Zimbabwean groundnuts (peanuts) lightly salted and served warm.',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Bowl of warm pan-roasted Zimbabwean groundnuts nzungu',
    dietaryOrNote: 'Vegan · Traditional Snack',
  },
  {
    id: 'madora',
    name: 'Madora',
    category: 'starters-soups',
    categoryLabel: 'Starters & Soups',
    description: 'Traditional protein-rich emperor moth caterpillars pan-fried crisp or simmered with onions, tomatoes, and chilli.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Traditional Zimbabwean madora sautéed with onions and tomatoes',
    dietaryOrNote: 'Authentic Zimbabwean Delicacy',
  },
  {
    id: 'mopane-worms',
    name: 'Mopane Worms',
    category: 'starters-soups',
    categoryLabel: 'Starters & Soups',
    description: 'Crisp roasted or saucy braised mopane worms seasoned with sea salt, garlic, and mild pepper.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Seasoned mopane worms served as a traditional starter',
    dietaryOrNote: 'High-Protein Traditional Starter',
  },
  {
    id: 'mhandire',
    name: 'Mhandire',
    category: 'starters-soups',
    categoryLabel: 'Starters & Soups',
    description: 'Crunchy fire-roasted dry maize kernels lightly salted — a beloved Zimbabwean fireside snack.',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Bowl of roasted maize kernels mhandire',
    dietaryOrNote: 'Vegan · Roasted Maize',
  },
  {
    id: 'chibage-and-nzungu',
    name: 'Chibage & Nzungu',
    category: 'starters-soups',
    categoryLabel: 'Starters & Soups',
    description: 'Classic pairing of boiled or roasted maize (corn) served together with roasted groundnuts.',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Traditional pairing of maize chibage and roasted groundnuts nzungu',
    dietaryOrNote: 'Vegan · Classic Pairing',
  },
  {
    id: 'derere-rine-matemba',
    name: 'Derere Rine Matemba',
    category: 'starters-soups',
    categoryLabel: 'Starters & Soups',
    description: 'Traditional okra (derere) cooked with crispy dried Kariba kapenta (matemba), tomatoes, and onions.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Traditional okra derere cooked with dried kapenta matemba',
    dietaryOrNote: 'Okra & Kariba Kapenta',
  },
  {
    id: 'oxtail-soup',
    name: 'Oxtail Soup',
    category: 'starters-soups',
    categoryLabel: 'Starters & Soups',
    description: 'Velvety, slow-simmered oxtail broth infused with root vegetables, herbs, and tender shredded oxtail.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Steaming bowl of rich slow-simmered oxtail soup',
    dietaryOrNote: 'Warming Broth',
  },
  {
    id: 'zondo-soup',
    name: 'Zondo Soup',
    category: 'starters-soups',
    categoryLabel: 'Starters & Soups',
    description: 'Rich, gelatinous cow heels (mazondo) slow-cooked into a deeply comforting, flavorful traditional soup.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Traditional Zimbabwean mazondo zondo soup in a warm bowl',
    dietaryOrNote: 'Slow-Cooked Mazondo Broth',
  },

  // ========================
  // 4. STARCHES (SADZA & RICE)
  // ========================
  {
    id: 'white-sadza',
    name: 'White Sadza',
    category: 'starches',
    categoryLabel: 'Sadza & Rice',
    description: 'Zimbabwe’s staple smooth, steaming white maize meal cooked to perfection for scooping stews and relishes.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Steaming mound of traditional Zimbabwean white sadza',
    dietaryOrNote: 'Traditional Maize Staple',
  },
  {
    id: 'brown-sadza',
    name: 'Brown Sadza',
    category: 'starches',
    categoryLabel: 'Sadza & Rice',
    description: 'Nutritious finger millet (zviyo / rapoko) or sorghum brown sadza with a rich, earthy, nutty flavor.',
    image: GENERATED_IMAGES.oxtailSadza,
    imageAlt: 'Wholesome brown finger millet sadza',
    dietaryOrNote: 'Millet / Sorghum Grain',
  },
  {
    id: 'plain-white-rice',
    name: 'Plain White Rice',
    category: 'starches',
    categoryLabel: 'Sadza & Rice',
    description: 'Fluffy, lightly seasoned steamed white long-grain rice.',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Bowl of fluffy steamed white rice',
    dietaryOrNote: 'Steamed Long-Grain',
  },
  {
    id: 'brown-rice',
    name: 'Brown Rice',
    category: 'starches',
    categoryLabel: 'Sadza & Rice',
    description: 'Wholesome whole-grain brown rice steamed until tender.',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Bowl of wholesome steamed brown rice',
    dietaryOrNote: 'Whole-Grain',
  },
  {
    id: 'rice-beans-and-nuts',
    name: 'Rice, Beans & Nuts',
    category: 'starches',
    categoryLabel: 'Sadza & Rice',
    description: 'Traditional Zimbabwean rice cooked with sugar beans and creamy groundnut butter (dovi).',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Traditional rice cooked with beans and peanut butter dovi',
    dietaryOrNote: 'Enriched with Groundnut Dovi',
  },

  // ========================
  // 5. BREAKFAST
  // ========================
  {
    id: 'breakfast-afropolitan',
    name: 'Afropolitan',
    category: 'breakfast',
    categoryLabel: 'Breakfast',
    description: '2 eggs, 2 slices of bread, bacon, chipolata, beans, grilled tomato.',
    image: GENERATED_IMAGES.bigDadBurger,
    imageAlt: 'Full Afropolitan breakfast with two eggs, bacon, chipolata sausage, baked beans, grilled tomato and toast',
    dietaryOrNote: 'Full Morning Grill',
  },
  {
    id: 'breakfast-ranger',
    name: 'Ranger',
    category: 'breakfast',
    categoryLabel: 'Breakfast',
    description: '2 eggs, BBQ beef strips, 2 slices of bread, braised onions, grilled tomato, beans.',
    image: GENERATED_IMAGES.stickyRibsGrill,
    imageAlt: 'Ranger breakfast plate with BBQ beef strips, two eggs, braised onions, beans and toast',
    dietaryOrNote: 'With BBQ Beef Strips',
  },
  {
    id: 'breakfast-early-bird',
    name: 'Early Bird',
    category: 'breakfast',
    categoryLabel: 'Breakfast',
    description: '2 eggs, 2 slices of bread, beans, bacon, grilled tomato.',
    image: GENERATED_IMAGES.bigDadBurger,
    imageAlt: 'Classic Early Bird breakfast with eggs, crispy bacon, beans, grilled tomato and toast',
    dietaryOrNote: 'Classic Morning Plate',
  },

  // ========================
  // 6. BRUNCH, BURGERS & PLATTERS
  // ========================
  {
    id: 'bbq-burgers',
    name: 'BBQ Burgers',
    category: 'brunch-burgers-platters',
    categoryLabel: 'Brunch, Burgers & Platters',
    description: 'Beef or chicken patty, lettuce, onion, tomato.',
    image: GENERATED_IMAGES.bigDadBurger,
    imageAlt: 'Flame-grilled BBQ beef or chicken burger with crisp lettuce, onion and tomato',
    dietaryOrNote: 'Choice of Beef or Chicken Patty',
  },
  {
    id: 'big-dad-burger',
    name: 'Big Dad Burger',
    category: 'brunch-burgers-platters',
    categoryLabel: 'Brunch, Burgers & Platters',
    description: 'Patty, egg, bacon, cheese, fries.',
    image: GENERATED_IMAGES.bigDadBurger,
    imageAlt: 'Towering Big Dad Burger with beef patty, fried egg, crispy bacon, melted cheese and fries',
    dietaryOrNote: 'Served with Fries',
    featured: true,
  },
  {
    id: 'afro-platter',
    name: 'Afro Platter',
    category: 'brunch-burgers-platters',
    categoryLabel: 'Brunch, Burgers & Platters',
    description: 'Wings, samosas, spring rolls, meatballs, BBQ beef strips, chicken strips, fries.',
    image: GENERATED_IMAGES.stickyRibsGrill,
    imageAlt: 'Generous sharing Afro Platter with wings, samosas, spring rolls, meatballs, BBQ beef strips, chicken strips and fries',
    dietaryOrNote: 'Sharing Platter for the Table',
    featured: true,
  },
  {
    id: 'chicken-and-bacon-salad',
    name: 'Chicken & Bacon Salad',
    category: 'brunch-burgers-platters',
    categoryLabel: 'Brunch, Burgers & Platters',
    description: 'Grilled chicken strips and crispy smoked bacon tossed with fresh garden greens, cherry tomatoes, cucumber, and house dressing.',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Fresh chicken and crispy bacon garden salad',
    dietaryOrNote: 'Fresh & Crisp',
  },

  // ========================
  // 7. DRINKS (COCKTAILS, BEERS, COFFEE, SHAKES)
  // ========================
  {
    id: 'cocktail-afrotopia-gnt',
    name: 'Afrotopia Gnt',
    category: 'drinks',
    categoryLabel: 'Cocktails, Beers & Coffee',
    description: 'Our signature house gin & tonic elevated with African botanicals, fresh citrus, and aromatic garnish.',
    image: GENERATED_IMAGES.interiorPatio,
    imageAlt: 'Chilled Afrotopia Gnt botanical gin cocktail at the bar',
    dietaryOrNote: 'Signature Cocktail',
  },
  {
    id: 'cocktail-njuzu-fever',
    name: 'Njuzu Fever',
    category: 'drinks',
    categoryLabel: 'Cocktails, Beers & Coffee',
    description: 'Refreshing, vibrant house cocktail crafted for warm patio afternoons and late-night music sessions.',
    image: GENERATED_IMAGES.interiorPatio,
    imageAlt: 'Vibrant Njuzu Fever craft cocktail garnished with fresh fruit',
    dietaryOrNote: 'Signature Cocktail',
  },
  {
    id: 'cocktail-the-somgaga',
    name: 'The Somgaga',
    category: 'drinks',
    categoryLabel: 'Cocktails, Beers & Coffee',
    description: 'Bold, glamorous house cocktail bursting with bright tropical and citrus notes.',
    image: GENERATED_IMAGES.interiorPatio,
    imageAlt: 'The Somgaga signature cocktail served over crushed ice',
    dietaryOrNote: 'Signature Cocktail',
  },
  {
    id: 'cocktail-summa-yo-muthi',
    name: 'Summa Yo Muthi',
    category: 'drinks',
    categoryLabel: 'Cocktails, Beers & Coffee',
    description: 'Herbal and citrus-infused summer refresher mixed to perfection by our bartenders.',
    image: GENERATED_IMAGES.interiorPatio,
    imageAlt: 'Summa Yo Muthi craft cocktail with botanical garnish',
    dietaryOrNote: 'Signature Cocktail',
  },
  {
    id: 'cocktail-the-pungwe',
    name: 'The Pungwe',
    category: 'drinks',
    categoryLabel: 'Cocktails, Beers & Coffee',
    description: 'Named for the all-night celebration — a spirited, energetic cocktail built to carry you through the night.',
    image: GENERATED_IMAGES.interiorPatio,
    imageAlt: 'The Pungwe late-night signature cocktail',
    dietaryOrNote: 'Signature Cocktail',
  },
  {
    id: 'cocktail-chi-slender',
    name: 'Chi Slender',
    category: 'drinks',
    categoryLabel: 'Cocktails, Beers & Coffee',
    description: 'Crisp, tall, and effortlessly smooth house cocktail served ice-cold.',
    image: GENERATED_IMAGES.interiorPatio,
    imageAlt: 'Tall chilled Chi Slender cocktail',
    dietaryOrNote: 'Signature Cocktail',
  },
  {
    id: 'lagers-zambezi-black-label',
    name: 'Ice-Cold Lagers: Zambezi & Black Label',
    category: 'drinks',
    categoryLabel: 'Cocktails, Beers & Coffee',
    description: 'Zimbabwe’s iconic Zambezi Lager and Carling Black Label, served frost-cold from the bar, plus our wider beer and wine list.',
    image: GENERATED_IMAGES.interiorPatio,
    imageAlt: 'Frosty bottles of Zambezi Lager and Black Label beer at the bar',
    dietaryOrNote: ' Zambezi · Black Label · Wine List Available',
  },
  {
    id: 'coffee-bar-hot-drinks',
    name: 'Espresso, Cappuccino, Frappès & Hot Chocolate',
    category: 'drinks',
    categoryLabel: 'Cocktails, Beers & Coffee',
    description: 'Barista-pulled strong espresso, velvety cappuccino, blended iced frappès, and rich hot chocolate.',
    image: GENERATED_IMAGES.heroFeast,
    imageAlt: 'Freshly brewed artisan cappuccino and espresso',
    dietaryOrNote: 'Specialty Coffee Bar',
  },
  {
    id: 'milkshakes-and-smoothies',
    name: 'Milkshakes, Smoothies & Soft Drinks',
    category: 'drinks',
    categoryLabel: 'Cocktails, Beers & Coffee',
    description: 'Thick spun gourmet milkshakes, blended real-fruit smoothies, and chilled soft drinks.',
    image: GENERATED_IMAGES.bigDadBurger,
    imageAlt: 'Chilled gourmet milkshake and fruit smoothie',
    dietaryOrNote: 'Non-Alcoholic Refreshers',
  },
];

export const VIBE_HIGHLIGHTS = [
  'Live music',
  'Sport on screen',
  'Fireplace',
  'Great cocktails',
  'Great beer selection',
  'Great wine list',
  'Great coffee',
  'Happy-hour drinks',
  'Late-night food',
  'Private dining room',
  'Outdoor seating',
];

export const VIBE_SECTIONS = [
  {
    title: 'How to enjoy us',
    body: 'Dine-in, takeaway or delivery. Table service, catering and reservations accepted. Brunch and lunch reservations are recommended.',
  },
  {
    title: 'When to come',
    body: 'Breakfast, brunch, lunch and dinner, plus desserts and small plates.',
  },
  {
    title: 'Families',
    body: "High chairs and a kids' menu.",
  },
  {
    title: 'Access & parking',
    body: 'Wheelchair-accessible entrance, seating, toilet and car park. Free parking lot and street parking.',
  },
  {
    title: 'Paying',
    body: 'Credit cards, debit cards and NFC mobile payments.',
  },
];
