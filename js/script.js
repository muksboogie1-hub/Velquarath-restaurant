/* ==========================================================================
   Velquarath Cafe — Complete Static Vanilla JavaScript (js/script.js)
   Zero Dependencies · Works directly on GitHub Pages & Local Static Servers
   ========================================================================== */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. OWNER CONFIGURATION BLOCK
  // -------------------------------------------------------------------------
  var RESTAURANT_CONFIG = {
    name: 'Velquarath Cafe',
    tagline: 'Sticky ribs, sadza and bream, strong coffee and cold cocktails. Eat on the patio, watch the game, stay for the music.',
    phone: '', // Owner: e.g. "263771234567" (country code, no + or spaces)
    displayPhone: 'Phone number to be confirmed by owner',
    email: '',
    address: 'Harare, Zimbabwe (Exact street address to be confirmed by owner)'
  };

  var IMAGES = {
    heroFeast: new URL('../assets/images/hero_feast.jpg', import.meta.url).href,
    oxtailSadza: new URL('../assets/images/dish_oxtail_sadza.jpg', import.meta.url).href,
    stickyRibsGrill: new URL('../assets/images/dish_sticky_ribs.jpg', import.meta.url).href,
    bigDadBurger: new URL('../assets/images/dish_big_dad_burger.jpg', import.meta.url).href,
    interiorPatio: new URL('../assets/images/interior_patio.jpg', import.meta.url).href
  };

  // -------------------------------------------------------------------------
  // 2. COMPLETE MENU DATASET (All 45+ Dishes & Drinks Preserved)
  // -------------------------------------------------------------------------
  var MENU_CATEGORIES = [
    { id: 'all', label: 'All Dishes & Drinks', subtitle: 'Complete Velquarath Cafe menu across our grill, traditional kitchen, brunch, and bar.' },
    { id: 'grill', label: 'Off the Grill', subtitle: 'Fire-grilled meat, glazed in our signature BBQ sauce and served with fries.' },
    { id: 'traditional', label: 'Traditional Mains', subtitle: 'Authentic Zimbabwean slow-cooked stews, game, road runner, and whole Kariba bream.' },
    { id: 'starters-soups', label: 'Starters & Soups', subtitle: 'Traditional Zimbabwean snacks, roasted groundnuts, mopane worms, and rich broths.' },
    { id: 'starches', label: 'Sadza & Rice', subtitle: 'Traditional white and brown sadza, steamed rice, and peanut-enriched grains.' },
    { id: 'breakfast', label: 'Breakfast', subtitle: 'Hearty morning plates served with farm eggs, grilled tomato, toast, and beans.' },
    { id: 'brunch-burgers-platters', label: 'Brunch, Burgers & Platters', subtitle: 'Stacked gourmet burgers, sharing platters for the table, and crisp salads.' },
    { id: 'drinks', label: 'Cocktails, Beers & Coffee', subtitle: 'Signature Velquarath cocktails, ice-cold lagers, specialty espresso, and milkshakes.' }
  ];

  var MENU_ITEMS = [
    // OFF THE GRILL
    { id: 'sticky-ribs', name: 'Sticky Ribs', category: 'grill', categoryLabel: 'Off the Grill', price: '$11', description: 'Fall-off-the-bone pork ribs glazed in signature BBQ sauce, served with fries.', image: IMAGES.stickyRibsGrill, imageAlt: 'Flame-grilled sticky pork ribs glazed in dark BBQ sauce served with crispy golden fries', dietaryOrNote: 'Signature Grill · Served with fries', featured: true },
    { id: 'xl-ribs', name: 'XL Ribs', category: 'grill', categoryLabel: 'Off the Grill', price: '$15', description: 'A double portion of our ribs, for double the deliciousness.', image: IMAGES.stickyRibsGrill, imageAlt: 'Double rack of flame-grilled XL pork ribs with smoky barbecue glaze and fries', dietaryOrNote: 'Double Portion · Served with fries', featured: true },
    { id: 'the-bro-meal', name: 'The Bro Meal', category: 'grill', categoryLabel: 'Off the Grill', price: '$8', description: 'Steak and two fried eggs, served with fries.', image: IMAGES.heroFeast, imageAlt: 'Char-grilled steak topped with two fried eggs and served with golden fries', dietaryOrNote: 'Steak & Eggs · Served with fries', featured: true },
    { id: 'the-bambazonke', name: 'The Bambazonke', category: 'grill', categoryLabel: 'Off the Grill', price: '$7', description: 'Two kebabs of sausage, chicken tenders, grilled peppers and cherry tomatoes, with two wings and fries.', image: IMAGES.stickyRibsGrill, imageAlt: 'Two grilled skewers of sausage, chicken tenders, peppers and cherry tomatoes with wings and fries', dietaryOrNote: '2 Kebabs + 2 Wings · Served with fries', featured: true },
    { id: 'bbq-chicken', name: 'BBQ Chicken', category: 'grill', categoryLabel: 'Off the Grill', price: '$6', description: 'Quarter or half chicken, grilled and glazed in BBQ sauce.', image: IMAGES.stickyRibsGrill, imageAlt: 'Fire-grilled chicken glazed in rich smoky BBQ sauce', dietaryOrNote: 'Quarter or Half Chicken' },
    { id: 'issa-wrap-remix', name: 'Issa Wrap Remix', category: 'grill', categoryLabel: 'Off the Grill', price: '$6', description: 'Your favourite wrap, bigger and better. Choose chicken or veggie explosion.', image: IMAGES.bigDadBurger, imageAlt: 'Toasted gourmet wrap filled with grilled chicken or roasted vegetables', dietaryOrNote: 'Chicken or Veggie Explosion' },
    { id: 'sweet-pork-frites', name: 'Sweet Pork & Frites', category: 'grill', categoryLabel: 'Off the Grill', description: 'Sticky pork belly served with fries.', image: IMAGES.stickyRibsGrill, imageAlt: 'Glazed sticky pork belly slices served with crispy fries', dietaryOrNote: 'Coming Soon to the Grill', comingSoon: true },

    // TRADITIONAL MAINS
    { id: 'oxtail-and-beans', name: 'Oxtail & Beans', category: 'traditional', categoryLabel: 'Traditional Mains', description: 'Slow-braised tender oxtail simmered with sugar beans in a rich, savory gravy. Pairs with white or brown sadza or rice.', image: IMAGES.oxtailSadza, imageAlt: 'Slow-cooked Zimbabwean oxtail and beans stew in a clay bowl with white sadza and greens', dietaryOrNote: 'House Traditional Specialty', featured: true },
    { id: 'road-runner', name: 'Road Runner', category: 'traditional', categoryLabel: 'Traditional Mains', description: 'Authentic free-range country chicken (huku yemusha) slow-simmered until tender in a traditional tomato and onion broth.', image: IMAGES.oxtailSadza, imageAlt: 'Traditional free-range road runner chicken stew served hot', dietaryOrNote: 'Free-Range Country Chicken' },
    { id: 'smoked-pork-bones', name: 'Smoked Pork Bones', category: 'traditional', categoryLabel: 'Traditional Mains', description: 'Meaty smoked pork bones braised with aromatic herbs, onions, and tomatoes for a deep, smoky broth.', image: IMAGES.stickyRibsGrill, imageAlt: 'Braised smoked pork bones in rich savory sauce', dietaryOrNote: 'Slow-Braised & Smoky' },
    { id: 'beef-bones-chicken-livers', name: 'Beef Bones & Chicken Livers', category: 'traditional', categoryLabel: 'Traditional Mains', description: 'Hearty combination of marrow-rich beef bones and tender pan-simmered chicken livers in a spiced onion gravy.', image: IMAGES.oxtailSadza, imageAlt: 'Traditional beef bones and chicken livers stew', dietaryOrNote: 'Rich & Hearty' },
    { id: 'rabbit-tsuro', name: 'Rabbit (Tsuro)', category: 'traditional', categoryLabel: 'Traditional Mains', description: 'Traditional Zimbabwean prepared rabbit (tsuro), gently roasted and braised in a savory herb and tomato reduction.', image: IMAGES.oxtailSadza, imageAlt: 'Traditional braised rabbit tsuro dish', dietaryOrNote: 'Traditional Delicacy' },
    { id: 'kariba-bream-with-soup', name: 'Kariba Bream with Soup', category: 'traditional', categoryLabel: 'Traditional Mains', description: 'Whole fresh Kariba bream, seasoned and flame-grilled or pan-crisped, served with a light, aromatic tomato and onion soup.', image: IMAGES.heroFeast, imageAlt: 'Whole grilled Kariba bream fish with fresh lemon, herbs, and savory broth', dietaryOrNote: 'Whole Fresh Fish', featured: true },
    { id: 'impala-curry', name: 'Impala Curry', category: 'traditional', categoryLabel: 'Traditional Mains', description: 'Lean, tender impala venison slow-cooked in a warming blend of roasted spices, garlic, ginger, and rich curry sauce.', image: IMAGES.oxtailSadza, imageAlt: 'Spiced impala venison curry in a stoneware bowl', dietaryOrNote: 'Game Specialty' },
    { id: 'rabbit-masala', name: 'Rabbit Masala', category: 'traditional', categoryLabel: 'Traditional Mains', description: 'Succulent rabbit pieces simmered in a fragrant masala sauce with toasted spices, tomatoes, and fresh coriander.', image: IMAGES.oxtailSadza, imageAlt: 'Fragrant rabbit masala curry with fresh coriander', dietaryOrNote: 'Spiced Masala' },
    { id: 'grilled-guinea-fowl', name: 'Grilled Guinea Fowl', category: 'traditional', categoryLabel: 'Traditional Mains', description: 'Char-grilled guinea fowl (hanga) basted with herbs and served tender with traditional accompaniments.', image: IMAGES.stickyRibsGrill, imageAlt: 'Flame-grilled guinea fowl with charred skin and herbs', dietaryOrNote: 'Flame-Grilled Game Bird' },

    // STARTERS & SOUPS
    { id: 'roasted-nzungu', name: 'Roasted Nzungu', category: 'starters-soups', categoryLabel: 'Starters & Soups', description: 'Traditionally pan-roasted Zimbabwean groundnuts (peanuts) lightly salted and served warm.', image: IMAGES.heroFeast, imageAlt: 'Bowl of warm pan-roasted Zimbabwean groundnuts nzungu', dietaryOrNote: 'Vegan · Traditional Snack' },
    { id: 'madora', name: 'Madora', category: 'starters-soups', categoryLabel: 'Starters & Soups', description: 'Traditional protein-rich emperor moth caterpillars pan-fried crisp or simmered with onions, tomatoes, and chilli.', image: IMAGES.oxtailSadza, imageAlt: 'Traditional Zimbabwean madora sautéed with onions and tomatoes', dietaryOrNote: 'Authentic Zimbabwean Delicacy' },
    { id: 'mopane-worms', name: 'Mopane Worms', category: 'starters-soups', categoryLabel: 'Starters & Soups', description: 'Crisp roasted or saucy braised mopane worms seasoned with sea salt, garlic, and mild pepper.', image: IMAGES.oxtailSadza, imageAlt: 'Seasoned mopane worms served as a traditional starter', dietaryOrNote: 'High-Protein Traditional Starter' },
    { id: 'mhandire', name: 'Mhandire', category: 'starters-soups', categoryLabel: 'Starters & Soups', description: 'Crunchy fire-roasted dry maize kernels lightly salted — a beloved Zimbabwean fireside snack.', image: IMAGES.heroFeast, imageAlt: 'Bowl of roasted maize kernels mhandire', dietaryOrNote: 'Vegan · Roasted Maize' },
    { id: 'chibage-and-nzungu', name: 'Chibage & Nzungu', category: 'starters-soups', categoryLabel: 'Starters & Soups', description: 'Classic pairing of boiled or roasted maize (corn) served together with roasted groundnuts.', image: IMAGES.heroFeast, imageAlt: 'Traditional pairing of maize chibage and roasted groundnuts nzungu', dietaryOrNote: 'Vegan · Classic Pairing' },
    { id: 'derere-rine-matemba', name: 'Derere Rine Matemba', category: 'starters-soups', categoryLabel: 'Starters & Soups', description: 'Traditional okra (derere) cooked with crispy dried Kariba kapenta (matemba), tomatoes, and onions.', image: IMAGES.oxtailSadza, imageAlt: 'Traditional okra derere cooked with dried kapenta matemba', dietaryOrNote: 'Okra & Kariba Kapenta' },
    { id: 'oxtail-soup', name: 'Oxtail Soup', category: 'starters-soups', categoryLabel: 'Starters & Soups', description: 'Velvety, slow-simmered oxtail broth infused with root vegetables, herbs, and tender shredded oxtail.', image: IMAGES.oxtailSadza, imageAlt: 'Steaming bowl of rich slow-simmered oxtail soup', dietaryOrNote: 'Warming Broth' },
    { id: 'zondo-soup', name: 'Zondo Soup', category: 'starters-soups', categoryLabel: 'Starters & Soups', description: 'Rich, gelatinous cow heels (mazondo) slow-cooked into a deeply comforting, flavorful traditional soup.', image: IMAGES.oxtailSadza, imageAlt: 'Traditional Zimbabwean mazondo zondo soup in a warm bowl', dietaryOrNote: 'Slow-Cooked Mazondo Broth' },

    // STARCHES
    { id: 'white-sadza', name: 'White Sadza', category: 'starches', categoryLabel: 'Sadza & Rice', description: 'Zimbabwe’s staple smooth, steaming white maize meal cooked to perfection for scooping stews and relishes.', image: IMAGES.oxtailSadza, imageAlt: 'Steaming mound of traditional Zimbabwean white sadza', dietaryOrNote: 'Traditional Maize Staple' },
    { id: 'brown-sadza', name: 'Brown Sadza', category: 'starches', categoryLabel: 'Sadza & Rice', description: 'Nutritious finger millet (zviyo / rapoko) or sorghum brown sadza with a rich, earthy, nutty flavor.', image: IMAGES.oxtailSadza, imageAlt: 'Wholesome brown finger millet sadza', dietaryOrNote: 'Millet / Sorghum Grain' },
    { id: 'plain-white-rice', name: 'Plain White Rice', category: 'starches', categoryLabel: 'Sadza & Rice', description: 'Fluffy, lightly seasoned steamed white long-grain rice.', image: IMAGES.heroFeast, imageAlt: 'Bowl of fluffy steamed white rice', dietaryOrNote: 'Steamed Long-Grain' },
    { id: 'brown-rice', name: 'Brown Rice', category: 'starches', categoryLabel: 'Sadza & Rice', description: 'Wholesome whole-grain brown rice steamed until tender.', image: IMAGES.heroFeast, imageAlt: 'Bowl of wholesome steamed brown rice', dietaryOrNote: 'Whole-Grain' },
    { id: 'rice-beans-and-nuts', name: 'Rice, Beans & Nuts', category: 'starches', categoryLabel: 'Sadza & Rice', description: 'Traditional Zimbabwean rice cooked with sugar beans and creamy groundnut butter (dovi).', image: IMAGES.heroFeast, imageAlt: 'Traditional rice cooked with beans and peanut butter dovi', dietaryOrNote: 'Enriched with Groundnut Dovi' },

    // BREAKFAST
    { id: 'breakfast-afropolitan', name: 'Afropolitan', category: 'breakfast', categoryLabel: 'Breakfast', description: '2 eggs, 2 slices of bread, bacon, chipolata, beans, grilled tomato.', image: IMAGES.bigDadBurger, imageAlt: 'Full Afropolitan breakfast with two eggs, bacon, chipolata sausage, baked beans, grilled tomato and toast', dietaryOrNote: 'Full Morning Grill' },
    { id: 'breakfast-ranger', name: 'Ranger', category: 'breakfast', categoryLabel: 'Breakfast', description: '2 eggs, BBQ beef strips, 2 slices of bread, braised onions, grilled tomato, beans.', image: IMAGES.stickyRibsGrill, imageAlt: 'Ranger breakfast plate with BBQ beef strips, two eggs, braised onions, beans and toast', dietaryOrNote: 'With BBQ Beef Strips' },
    { id: 'breakfast-early-bird', name: 'Early Bird', category: 'breakfast', categoryLabel: 'Breakfast', description: '2 eggs, 2 slices of bread, beans, bacon, grilled tomato.', image: IMAGES.bigDadBurger, imageAlt: 'Classic Early Bird breakfast with eggs, crispy bacon, beans, grilled tomato and toast', dietaryOrNote: 'Classic Morning Plate' },

    // BRUNCH, BURGERS & PLATTERS
    { id: 'bbq-burgers', name: 'BBQ Burgers', category: 'brunch-burgers-platters', categoryLabel: 'Brunch, Burgers & Platters', description: 'Beef or chicken patty, lettuce, onion, tomato.', image: IMAGES.bigDadBurger, imageAlt: 'Flame-grilled BBQ beef or chicken burger with crisp lettuce, onion and tomato', dietaryOrNote: 'Choice of Beef or Chicken Patty' },
    { id: 'big-dad-burger', name: 'Big Dad Burger', category: 'brunch-burgers-platters', categoryLabel: 'Brunch, Burgers & Platters', description: 'Patty, egg, bacon, cheese, fries.', image: IMAGES.bigDadBurger, imageAlt: 'Towering Big Dad Burger with beef patty, fried egg, crispy bacon, melted cheese and fries', dietaryOrNote: 'Served with Fries', featured: true },
    { id: 'afro-platter', name: 'Afro Platter', category: 'brunch-burgers-platters', categoryLabel: 'Brunch, Burgers & Platters', description: 'Wings, samosas, spring rolls, meatballs, BBQ beef strips, chicken strips, fries.', image: IMAGES.stickyRibsGrill, imageAlt: 'Generous sharing Afro Platter with wings, samosas, spring rolls, meatballs, BBQ beef strips, chicken strips and fries', dietaryOrNote: 'Sharing Platter for the Table', featured: true },
    { id: 'chicken-and-bacon-salad', name: 'Chicken & Bacon Salad', category: 'brunch-burgers-platters', categoryLabel: 'Brunch, Burgers & Platters', description: 'Grilled chicken strips and crispy smoked bacon tossed with fresh garden greens, cherry tomatoes, cucumber, and house dressing.', image: IMAGES.heroFeast, imageAlt: 'Fresh chicken and crispy bacon garden salad', dietaryOrNote: 'Fresh & Crisp' },

    // DRINKS
    { id: 'cocktail-afrotopia-gnt', name: 'Afrotopia Gnt', category: 'drinks', categoryLabel: 'Cocktails, Beers & Coffee', description: 'Our signature house gin & tonic elevated with African botanicals, fresh citrus, and aromatic garnish.', image: IMAGES.interiorPatio, imageAlt: 'Chilled Afrotopia Gnt botanical gin cocktail at the bar', dietaryOrNote: 'Signature Cocktail' },
    { id: 'cocktail-njuzu-fever', name: 'Njuzu Fever', category: 'drinks', categoryLabel: 'Cocktails, Beers & Coffee', description: 'Refreshing, vibrant house cocktail crafted for warm patio afternoons and late-night music sessions.', image: IMAGES.interiorPatio, imageAlt: 'Vibrant Njuzu Fever craft cocktail garnished with fresh fruit', dietaryOrNote: 'Signature Cocktail' },
    { id: 'cocktail-the-somgaga', name: 'The Somgaga', category: 'drinks', categoryLabel: 'Cocktails, Beers & Coffee', description: 'Bold, glamorous house cocktail bursting with bright tropical and citrus notes.', image: IMAGES.interiorPatio, imageAlt: 'The Somgaga signature cocktail served over crushed ice', dietaryOrNote: 'Signature Cocktail' },
    { id: 'cocktail-summa-yo-muthi', name: 'Summa Yo Muthi', category: 'drinks', categoryLabel: 'Cocktails, Beers & Coffee', description: 'Herbal and citrus-infused summer refresher mixed to perfection by our bartenders.', image: IMAGES.interiorPatio, imageAlt: 'Summa Yo Muthi craft cocktail with botanical garnish', dietaryOrNote: 'Signature Cocktail' },
    { id: 'cocktail-the-pungwe', name: 'The Pungwe', category: 'drinks', categoryLabel: 'Cocktails, Beers & Coffee', description: 'Named for the all-night celebration — a spirited, energetic cocktail built to carry you through the night.', image: IMAGES.interiorPatio, imageAlt: 'The Pungwe late-night signature cocktail', dietaryOrNote: 'Signature Cocktail' },
    { id: 'cocktail-chi-slender', name: 'Chi Slender', category: 'drinks', categoryLabel: 'Cocktails, Beers & Coffee', description: 'Crisp, tall, and effortlessly smooth house cocktail served ice-cold.', image: IMAGES.interiorPatio, imageAlt: 'Tall chilled Chi Slender cocktail', dietaryOrNote: 'Signature Cocktail' },
    { id: 'lagers-zambezi-black-label', name: 'Ice-Cold Lagers: Zambezi & Black Label', category: 'drinks', categoryLabel: 'Cocktails, Beers & Coffee', description: 'Zimbabwe’s iconic Zambezi Lager and Carling Black Label, served frost-cold from the bar, plus our wider beer and wine list.', image: IMAGES.interiorPatio, imageAlt: 'Frosty bottles of Zambezi Lager and Black Label beer at the bar', dietaryOrNote: 'Zambezi · Black Label · Wine List Available' },
    { id: 'coffee-bar-hot-drinks', name: 'Espresso, Cappuccino, Frappès & Hot Chocolate', category: 'drinks', categoryLabel: 'Cocktails, Beers & Coffee', description: 'Barista-pulled strong espresso, velvety cappuccino, blended iced frappès, and rich hot chocolate.', image: IMAGES.heroFeast, imageAlt: 'Freshly brewed artisan cappuccino and espresso', dietaryOrNote: 'Specialty Coffee Bar' },
    { id: 'milkshakes-and-smoothies', name: 'Milkshakes, Smoothies & Soft Drinks', category: 'drinks', categoryLabel: 'Cocktails, Beers & Coffee', description: 'Thick spun gourmet milkshakes, blended real-fruit smoothies, and chilled soft drinks.', image: IMAGES.bigDadBurger, imageAlt: 'Chilled gourmet milkshake and fruit smoothie', dietaryOrNote: 'Non-Alcoholic Refreshers' }
  ];

  var GALLERY_ITEMS = [
    { id: 'gal-feast-table', title: 'The Velquarath Evening Feast', caption: 'Sticky BBQ pork ribs, slow-braised oxtail in clay pot, steaming white sadza, whole grilled Kariba bream, and craft cocktails by candlelight.', category: 'traditional', categoryLabel: 'Traditional & Grill', src: IMAGES.heroFeast, alt: 'Candlelit table spread with sticky ribs, white sadza, clay pot oxtail stew, and whole grilled Kariba bream', spanWide: true },
    { id: 'gal-sticky-ribs', title: 'Signature Sticky Ribs & BBQ Chicken', caption: 'Fall-off-the-bone pork ribs and flame-grilled chicken glazed in our house smoky barbecue sauce, served with crispy skin-on fries and roasted cherry tomatoes.', category: 'grill', categoryLabel: 'Off the Grill', src: IMAGES.stickyRibsGrill, alt: 'Flame-grilled sticky BBQ pork ribs and quarter chicken served on a wooden board with fries', spanWide: false },
    { id: 'gal-oxtail-sadza', title: 'Oxtail & Beans with White Sadza', caption: 'Rich, gelatinous slow-braised oxtail and sugar beans paired with steaming traditional white sadza and sautéed greens.', category: 'traditional', categoryLabel: 'Traditional Mains', src: IMAGES.oxtailSadza, alt: 'Traditional Zimbabwean oxtail and beans stew with white sadza and greens on dark stoneware', spanWide: false },
    { id: 'gal-big-dad-burger', title: 'The Big Dad Burger', caption: 'Char-grilled patty stacked with melted cheddar, crispy smoked bacon, a golden fried egg, braised onions, lettuce, tomato, and seasoned fries.', category: 'burgers-platters', categoryLabel: 'Brunch & Burgers', src: IMAGES.bigDadBurger, alt: 'Towering gourmet beef burger with fried egg, bacon, melted cheese, and fries', spanWide: false },
    { id: 'gal-patio-bar-vibe', title: 'The Patio, Fireplace & Emerald Bar', caption: 'Eat on the covered patio, gather around the indoor fireplace, watch live sport on screen, or stay late for live music and cold cocktails.', category: 'drinks-vibe', categoryLabel: 'Interior & Vibe', src: IMAGES.interiorPatio, alt: 'Velquarath Cafe evening patio, glowing fireplace, and emerald-lit cocktail bar', spanWide: true }
  ];

  // -------------------------------------------------------------------------
  // 3. MOBILE HAMBURGER MENU WITH BACKGROUND SCROLL LOCK
  // -------------------------------------------------------------------------
  function initMobileMenu() {
    var toggleBtn = document.getElementById('mobile-menu-toggle');
    var drawer = document.getElementById('mobile-navigation-drawer');
    var backdrop = document.getElementById('mobile-menu-backdrop');
    if (!toggleBtn || !drawer || !backdrop) return;

    var lockedScrollY = 0;
    var isOpen = false;

    function openMenu() {
      isOpen = true;
      lockedScrollY = window.scrollY || window.pageYOffset || 0;
      document.body.classList.add('menu-locked');
      document.body.style.top = '-' + lockedScrollY + 'px';
      drawer.classList.add('open');
      backdrop.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close navigation menu');
      toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
      document.body.classList.remove('menu-locked');
      document.body.style.top = '';
      window.scrollTo(0, lockedScrollY);
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open navigation menu');
      toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M4 6h16M4 18h16"/></svg>';
    }

    toggleBtn.addEventListener('click', function () {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. AMBIENT HEARTH EMBER CANVAS (Hero Animation)
  // -------------------------------------------------------------------------
  function initEmberCanvas() {
    var canvas = document.getElementById('ember-canvas');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    var height = (canvas.height = canvas.offsetHeight || 600);

    window.addEventListener('resize', function () {
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 600;
    });

    var colors = ['#C9A24B', '#DFB85E', '#D97724', '#F4ECDA'];
    var count = Math.min(36, Math.floor(width / 36));
    var embers = [];

    for (var i = 0; i < count; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.1 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.45 + 0.15),
        alpha: Math.random() * 0.55 + 0.1,
        targetAlpha: Math.random() * 0.65 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      for (var j = 0; j < embers.length; j++) {
        var e = embers[j];
        e.x += e.vx;
        e.y += e.vy;
        if (e.y < -10) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }
        if (e.x < -10) e.x = width + 10;
        if (e.x > width + 10) e.x = -10;

        e.alpha += (e.targetAlpha - e.alpha) * 0.02;
        if (Math.abs(e.alpha - e.targetAlpha) < 0.05) {
          e.targetAlpha = Math.random() * 0.65 + 0.1;
        }

        ctx.save();
        ctx.globalAlpha = e.alpha;
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // -------------------------------------------------------------------------
  // 5. MENU PAGE: LIVE SEARCH, AUTOCOMPLETE RECOMMENDATIONS & FILTER TABS
  // -------------------------------------------------------------------------
  function scoreMenuItem(item, rawQuery) {
    var q = (rawQuery || '').trim().toLowerCase();
    if (!q) return 1;

    var searchable = [
      item.name,
      item.description,
      item.categoryLabel,
      item.dietaryOrNote || ''
    ].join(' ').toLowerCase();

    var nameLower = item.name.toLowerCase();
    if (nameLower === q) return 100;
    if (nameLower.indexOf(q) === 0) return 85;
    if (nameLower.indexOf(q) !== -1) return 75;
    if (searchable.indexOf(q) !== -1) return 60;

    var tokens = q.split(/\s+/).filter(Boolean);
    if (tokens.length > 1) {
      var matched = tokens.filter(function (t) {
        return searchable.indexOf(t) !== -1;
      });
      if (matched.length === tokens.length) return 55;
      if (matched.length > 0) return 30 + matched.length * 5;
    }

    if (q.length >= 3) {
      var words = searchable.split(/[^a-z0-9]+/).filter(Boolean);
      for (var i = 0; i < words.length; i++) {
        if (words[i].indexOf(q.slice(0, 3)) === 0) return 20;
      }
    }
    return 0;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function initMenuPage() {
    var sectionsContainer = document.getElementById('menu-sections-container');
    if (!sectionsContainer) return;

    var searchInput = document.getElementById('menu-search-input');
    var searchForm = document.getElementById('menu-search-form');
    var clearBtn = document.getElementById('menu-search-clear');
    var resetBtn = document.getElementById('menu-reset-btn');
    var countLabel = document.getElementById('menu-count-label');
    var tabsContainer = document.getElementById('menu-category-tabs');
    var dropdown = document.getElementById('menu-search-dropdown');
    var dropdownResults = document.getElementById('menu-dropdown-results');
    var dropdownTitle = document.getElementById('menu-dropdown-title');
    var dropdownClose = document.getElementById('menu-dropdown-close');
    var searchBanner = document.getElementById('menu-active-search-banner');
    var searchWrap = document.getElementById('menu-search-wrap');

    var selectedCategory = 'all';
    var searchQuery = '';
    var highlightedId = null;

    // Check URL query parameter ?category=grill
    try {
      var params = new URLSearchParams(window.location.search);
      var catParam = params.get('category');
      if (catParam && MENU_CATEGORIES.some(function (c) { return c.id === catParam; })) {
        selectedCategory = catParam;
      }
    } catch (e) {}

    function getFilteredItems() {
      var isSearching = searchQuery.trim().length > 0;
      if (!isSearching) {
        return MENU_ITEMS.filter(function (item) {
          return selectedCategory === 'all' || item.category === selectedCategory;
        });
      }
      return MENU_ITEMS
        .map(function (item) {
          return { item: item, score: scoreMenuItem(item, searchQuery) };
        })
        .filter(function (entry) { return entry.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .map(function (entry) { return entry.item; });
    }

    function renderTabs() {
      if (!tabsContainer) return;
      var isSearching = searchQuery.trim().length > 0;
      var html = '';
      for (var i = 0; i < MENU_CATEGORIES.length; i++) {
        var cat = MENU_CATEGORIES[i];
        var isActive = !isSearching && selectedCategory === cat.id;
        html += '<button type="button" role="tab" aria-selected="' + (isActive ? 'true' : 'false') + '" data-cat="' + cat.id + '" class="filter-tab-btn' + (isActive ? ' active' : '') + '">' + escapeHtml(cat.label) + '</button>';
      }
      tabsContainer.innerHTML = html;

      var btns = tabsContainer.querySelectorAll('button[data-cat]');
      for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', function () {
          selectedCategory = this.getAttribute('data-cat') || 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          updateAll();
        });
      }
    }

    function renderDropdown(filtered) {
      if (!dropdownResults || !dropdownTitle) return;
      var isSearching = searchQuery.trim().length > 0;
      var list = isSearching
        ? filtered.slice(0, 6)
        : MENU_ITEMS.filter(function (i) { return i.featured; }).slice(0, 6);

      dropdownTitle.textContent = isSearching
        ? 'Recommended Matches (' + filtered.length + ' found)'
        : 'Chef & Bar Recommendations';

      if (list.length === 0) {
        dropdownResults.innerHTML = '<div style="padding:0.75rem;font-size:0.8rem;color:var(--ink-muted);">No direct match for "' + escapeHtml(searchQuery) + '". Try clicking one of the Popular Searches above.</div>';
        return;
      }

      var html = '';
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        html += '<button type="button" data-select-id="' + item.id + '" class="dropdown-item-btn">' +
          '<div style="min-width:0;">' +
            '<div style="display:flex;align-items:center;gap:0.5rem;">' +
              '<span class="font-display" style="font-size:0.9rem;font-weight:700;color:var(--ink-primary);">' + escapeHtml(item.name) + '</span>' +
              (item.price ? '<span class="font-mono-num" style="font-size:0.75rem;font-weight:600;color:var(--accent-gold);">' + escapeHtml(item.price) + '</span>' : '') +
            '</div>' +
            '<p style="font-size:0.75rem;color:var(--ink-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtml(item.categoryLabel + ' · ' + item.description) + '</p>' +
          '</div>' +
          '<span style="color:var(--accent-gold);font-size:0.85rem;flex-shrink:0;">↗</span>' +
        '</button>';
      }
      dropdownResults.innerHTML = html;

      var itemBtns = dropdownResults.querySelectorAll('button[data-select-id]');
      for (var k = 0; k < itemBtns.length; k++) {
        itemBtns[k].addEventListener('click', function () {
          var id = this.getAttribute('data-select-id');
          var chosen = MENU_ITEMS.find(function (m) { return m.id === id; });
          if (!chosen) return;
          searchQuery = chosen.name;
          if (searchInput) searchInput.value = chosen.name;
          selectedCategory = 'all';
          highlightedId = chosen.id;
          if (dropdown) dropdown.classList.remove('open');
          updateAll();
          setTimeout(function () {
            var cardEl = document.getElementById('menu-card-' + chosen.id);
            if (cardEl) cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 60);
          setTimeout(function () {
            highlightedId = null;
            updateAll();
          }, 2600);
        });
      }
    }

    function renderMenuSections(filtered) {
      var isSearching = searchQuery.trim().length > 0;
      if (countLabel) {
        countLabel.textContent = 'Showing ' + filtered.length + ' of ' + MENU_ITEMS.length + ' items';
      }
      if (clearBtn) {
        clearBtn.style.display = isSearching ? 'inline-block' : 'none';
      }
      if (resetBtn) {
        resetBtn.style.display = (isSearching || selectedCategory !== 'all') ? 'inline-block' : 'none';
      }

      if (searchBanner) {
        if (isSearching) {
          searchBanner.style.display = 'flex';
          searchBanner.innerHTML =
            '<div style="font-size:0.9rem;">Search results for <strong style="color:var(--accent-gold);">"' + escapeHtml(searchQuery) + '"</strong> across all menu categories (' + filtered.length + ' ' + (filtered.length === 1 ? 'match' : 'matches') + ')</div>' +
            '<button type="button" id="banner-clear-search" class="btn-secondary" style="padding:0.35rem 0.75rem;font-size:0.75rem;">Clear Search</button>';
          var bannerClear = document.getElementById('banner-clear-search');
          if (bannerClear) {
            bannerClear.addEventListener('click', function () {
              searchQuery = '';
              if (searchInput) searchInput.value = '';
              updateAll();
            });
          }
        } else {
          searchBanner.style.display = 'none';
        }
      }

      var activeCats = (isSearching || selectedCategory === 'all')
        ? MENU_CATEGORIES.filter(function (c) { return c.id !== 'all'; })
        : MENU_CATEGORIES.filter(function (c) { return c.id === selectedCategory; });

      var sections = activeCats
        .map(function (cat) {
          return {
            id: cat.id,
            label: cat.label,
            subtitle: cat.subtitle,
            items: filtered.filter(function (item) { return item.category === cat.id; })
          };
        })
        .filter(function (s) { return s.items.length > 0; });

      if (sections.length === 0) {
        sectionsContainer.innerHTML =
          '<div class="form-panel" style="text-align:center;max-width:38rem;margin:2rem auto;padding:3rem 1.5rem;">' +
            '<h2 class="font-display" style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">No exact match for "' + escapeHtml(searchQuery) + '"</h2>' +
            '<p style="font-size:0.9rem;color:var(--ink-muted);margin-bottom:1.5rem;">Try resetting the menu filter to browse all 45+ dishes and drinks.</p>' +
            '<button type="button" id="empty-reset-btn" class="btn-primary">Show All 45+ Menu Items</button>' +
          '</div>';
        var emptyReset = document.getElementById('empty-reset-btn');
        if (emptyReset) {
          emptyReset.addEventListener('click', function () {
            selectedCategory = 'all';
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            updateAll();
          });
        }
        return;
      }

      var out = '';
      for (var s = 0; s < sections.length; s++) {
        var sec = sections[s];
        out += '<section style="margin-bottom:4rem;" aria-labelledby="heading-' + sec.id + '">' +
          '<div style="padding-bottom:1rem;margin-bottom:2rem;border-bottom:1px solid var(--border-hairline);display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:0.5rem;">' +
            '<div>' +
              '<h2 id="heading-' + sec.id + '" class="font-display" style="font-size:1.75rem;font-weight:700;">' + escapeHtml(sec.label) + '</h2>' +
              '<p style="font-size:0.875rem;color:var(--ink-muted);margin-top:0.25rem;">' + escapeHtml(sec.subtitle) + '</p>' +
            '</div>' +
            '<span class="font-mono-num" style="font-size:0.75rem;color:var(--accent-gold);">' + sec.items.length + (sec.items.length === 1 ? ' item' : ' items') + '</span>' +
          '</div>' +
          '<div class="grid-cards">';

        for (var m = 0; m < sec.items.length; m++) {
          var item = sec.items[m];
          var cardClasses = 'menu-card' +
            (item.comingSoon ? ' coming-soon' : '') +
            (highlightedId === item.id ? ' highlighted' : '');

          var priceHtml = item.price
            ? '<span class="card-price">' + escapeHtml(item.price) + '</span>'
            : item.comingSoon
            ? '<span style="font-size:0.75rem;font-weight:600;color:var(--accent-gold);">Coming Soon</span>'
            : '<span class="card-price-note">Ask server</span>';

          out += '<article id="menu-card-' + item.id + '" class="' + cardClasses + '">' +
            '<div>' +
              '<div class="card-img-wrap">' +
                '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.imageAlt) + '" loading="lazy" />' +
              '</div>' +
              '<div class="card-body">' +
                '<div class="card-title-row">' +
                  '<h3 class="card-title">' + escapeHtml(item.name) + '</h3>' +
                  priceHtml +
                '</div>' +
                '<p class="card-desc">' + escapeHtml(item.description) + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="card-footer">' +
              '<span>' + escapeHtml(item.categoryLabel) + '</span>' +
              (item.dietaryOrNote ? '<span class="card-note-gold">' + escapeHtml(item.dietaryOrNote) + '</span>' : '') +
            '</div>' +
          '</article>';
        }

        out += '</div></section>';
      }

      sectionsContainer.innerHTML = out;
    }

    function updateAll() {
      var filtered = getFilteredItems();
      renderTabs();
      renderDropdown(filtered);
      renderMenuSections(filtered);
    }

    if (searchInput) {
      searchInput.addEventListener('focus', function () {
        if (dropdown) dropdown.classList.add('open');
        updateAll();
      });
      searchInput.addEventListener('input', function () {
        searchQuery = this.value || '';
        if (dropdown) dropdown.classList.add('open');
        updateAll();
      });
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && dropdown) {
          dropdown.classList.remove('open');
        }
      });
    }

    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (dropdown) dropdown.classList.remove('open');
        updateAll();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        updateAll();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        searchQuery = '';
        selectedCategory = 'all';
        if (searchInput) searchInput.value = '';
        updateAll();
      });
    }

    if (dropdownClose) {
      dropdownClose.addEventListener('click', function () {
        if (dropdown) dropdown.classList.remove('open');
      });
    }

    var popularTagBtns = document.querySelectorAll('button[data-popular-term]');
    for (var p = 0; p < popularTagBtns.length; p++) {
      popularTagBtns[p].addEventListener('click', function () {
        var term = this.getAttribute('data-popular-term') || '';
        searchQuery = term;
        selectedCategory = 'all';
        if (searchInput) searchInput.value = term;
        if (dropdown) dropdown.classList.remove('open');
        updateAll();
      });
    }

    document.addEventListener('mousedown', function (e) {
      if (searchWrap && dropdown && !searchWrap.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    updateAll();
  }

  // -------------------------------------------------------------------------
  // 6. GALLERY PAGE: CATEGORY FILTER & ACCESSIBLE LIGHTBOX
  // -------------------------------------------------------------------------
  function initGalleryPage() {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    var filterBtns = document.querySelectorAll('button[data-gallery-filter]');
    var modal = document.getElementById('lightbox-modal');
    var modalImg = document.getElementById('lightbox-img');
    var modalTitle = document.getElementById('lightbox-title');
    var modalCaption = document.getElementById('lightbox-caption');
    var modalCategory = document.getElementById('lightbox-category');
    var modalCounter = document.getElementById('lightbox-counter');
    var closeBtn = document.getElementById('lightbox-close');
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');

    var activeFilter = 'all';
    var currentIndex = null;

    function getFilteredGallery() {
      if (activeFilter === 'all') return GALLERY_ITEMS;
      return GALLERY_ITEMS.filter(function (g) { return g.category === activeFilter; });
    }

    function renderGallery() {
      var list = getFilteredGallery();
      var html = '';
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var wideClass = (item.spanWide && activeFilter === 'all') ? ' span-wide' : '';
        html += '<figure class="gallery-card' + wideClass + '">' +
          '<button type="button" data-idx="' + i + '" class="gallery-trigger" aria-label="View larger image of ' + escapeHtml(item.title) + '">' +
            '<img src="' + escapeHtml(item.src) + '" alt="' + escapeHtml(item.alt) + '" loading="lazy" />' +
            '<div class="gallery-overlay"></div>' +
            '<div class="gallery-overlay-text">' +
              '<p style="font-size:0.75rem;font-weight:600;color:var(--accent-gold);margin-bottom:0.25rem;">' + escapeHtml(item.categoryLabel) + '</p>' +
              '<h2 class="font-display" style="font-size:1.25rem;font-weight:700;color:var(--ink-primary);">' + escapeHtml(item.title) + '</h2>' +
            '</div>' +
          '</button>' +
          '<figcaption class="gallery-caption">' + escapeHtml(item.caption) + '</figcaption>' +
        '</figure>';
      }
      grid.innerHTML = html;

      var triggers = grid.querySelectorAll('button[data-idx]');
      for (var j = 0; j < triggers.length; j++) {
        triggers[j].addEventListener('click', function () {
          openLightbox(parseInt(this.getAttribute('data-idx') || '0', 10));
        });
      }
    }

    function openLightbox(idx) {
      var list = getFilteredGallery();
      if (!list[idx] || !modal) return;
      currentIndex = idx;
      var item = list[idx];
      if (modalImg) {
        modalImg.src = item.src;
        modalImg.alt = item.alt;
      }
      if (modalTitle) modalTitle.textContent = item.title;
      if (modalCaption) modalCaption.textContent = item.caption;
      if (modalCategory) modalCategory.textContent = item.categoryLabel;
      if (modalCounter) modalCounter.textContent = 'Image ' + (idx + 1) + ' of ' + list.length;
      modal.classList.add('open');
    }

    function closeLightbox() {
      currentIndex = null;
      if (modal) modal.classList.remove('open');
    }

    for (var i = 0; i < filterBtns.length; i++) {
      filterBtns[i].addEventListener('click', function () {
        activeFilter = this.getAttribute('data-gallery-filter') || 'all';
        for (var k = 0; k < filterBtns.length; k++) {
          var isSelected = filterBtns[k].getAttribute('data-gallery-filter') === activeFilter;
          filterBtns[k].classList.toggle('active', isSelected);
          filterBtns[k].setAttribute('aria-selected', isSelected ? 'true' : 'false');
        }
        closeLightbox();
        renderGallery();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var list = getFilteredGallery();
        if (currentIndex === null || !list.length) return;
        openLightbox((currentIndex - 1 + list.length) % list.length);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var list = getFilteredGallery();
        if (currentIndex === null || !list.length) return;
        openLightbox((currentIndex + 1) % list.length);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (currentIndex === null) return;
      var list = getFilteredGallery();
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') openLightbox((currentIndex + 1) % list.length);
      if (e.key === 'ArrowLeft') openLightbox((currentIndex - 1 + list.length) % list.length);
    });

    renderGallery();
  }

  // -------------------------------------------------------------------------
  // 7. RESERVATIONS FORM VALIDATION
  // -------------------------------------------------------------------------
  function initReservationsForm() {
    var form = document.getElementById('reservation-form');
    if (!form) return;

    var dateInput = document.getElementById('res-date');
    var todayStr = new Date().toISOString().split('T')[0];
    if (dateInput) {
      dateInput.value = todayStr;
      dateInput.min = todayStr;
    }

    var summaryBox = document.getElementById('res-summary-box');
    var summaryPre = document.getElementById('res-summary-pre');
    var copyBtn = document.getElementById('res-copy-btn');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fullName = (document.getElementById('res-fullName').value || '').trim();
      var phone = (document.getElementById('res-phone').value || '').trim();
      var email = (document.getElementById('res-email').value || '').trim();
      var date = document.getElementById('res-date').value || '';
      var time = document.getElementById('res-time').value || '19:00';
      var guests = document.getElementById('res-guests').value || '2';
      var seatingArea = document.getElementById('res-seatingArea').value || 'Outdoor Patio';
      var notes = (document.getElementById('res-notes').value || '').trim();
      var consent = document.getElementById('res-consent').checked;

      var valid = true;

      function setErr(id, msg) {
        var el = document.getElementById(id);
        if (!el) return;
        if (msg) {
          el.textContent = msg;
          el.classList.add('visible');
          valid = false;
        } else {
          el.textContent = '';
          el.classList.remove('visible');
        }
      }

      setErr('err-res-fullName', fullName.length < 2 ? 'Please enter your full name (at least 2 characters).' : '');
      var phoneClean = phone.replace(/[\s\-()]/g, '');
      setErr('err-res-phone', !/^\+?[0-9]{7,15}$/.test(phoneClean) ? 'Please enter a valid phone or WhatsApp number (7 to 15 digits).' : '');
      setErr('err-res-email', (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? 'Please enter a valid email address or leave blank.' : '');
      setErr('err-res-date', (!date || date < todayStr) ? 'Please select today or a future reservation date.' : '');
      var gNum = parseInt(guests, 10);
      setErr('err-res-guests', (isNaN(gNum) || gNum < 1 || gNum > 50) ? 'Please specify between 1 and 50 guests.' : '');
      setErr('err-res-consent', !consent ? 'Please confirm that Velquarath Cafe may use these details to process your reservation.' : '');

      if (!valid) {
        if (summaryBox) summaryBox.classList.remove('visible');
        return;
      }

      var lines = [
        'Hi Velquarath Cafe, I would like to request a table reservation:',
        '• Name: ' + fullName,
        '• Date: ' + date + ' at ' + time,
        '• Party Size: ' + guests + (Number(guests) === 1 ? ' guest' : ' guests'),
        '• Preferred Area: ' + seatingArea,
        '• Phone: ' + phone
      ];
      if (email) lines.push('• Email: ' + email);
      if (notes) lines.push('• Notes / Dietary: ' + notes);

      if (summaryPre) summaryPre.textContent = lines.join('\n');
      if (summaryBox) summaryBox.classList.add('visible');
      if (copyBtn) copyBtn.textContent = 'Copy Booking Summary';
    });

    if (copyBtn && summaryPre) {
      copyBtn.addEventListener('click', function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(summaryPre.textContent || '').then(function () {
            copyBtn.textContent = 'Copied to Clipboard!';
          });
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 8. CONTACT FORM VALIDATION
  // -------------------------------------------------------------------------
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var summaryBox = document.getElementById('contact-summary-box');
    var summaryPre = document.getElementById('contact-summary-pre');
    var copyBtn = document.getElementById('contact-copy-btn');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('contact-name').value || '').trim();
      var reply = (document.getElementById('contact-reply').value || '').trim();
      var topic = document.getElementById('contact-topic').value || 'General Enquiry';
      var message = (document.getElementById('contact-message').value || '').trim();
      var consent = document.getElementById('contact-consent').checked;

      var valid = true;
      function setErr(id, msg) {
        var el = document.getElementById(id);
        if (!el) return;
        if (msg) {
          el.textContent = msg;
          el.classList.add('visible');
          valid = false;
        } else {
          el.textContent = '';
          el.classList.remove('visible');
        }
      }

      setErr('err-contact-name', name.length < 2 ? 'Please enter your name.' : '');
      setErr('err-contact-reply', reply.length < 5 ? 'Please provide a valid phone number or email address.' : '');
      setErr('err-contact-message', message.length < 10 ? 'Please enter a message of at least 10 characters.' : '');
      setErr('err-contact-consent', !consent ? 'Please confirm consent to process your enquiry.' : '');

      if (!valid) {
        if (summaryBox) summaryBox.classList.remove('visible');
        return;
      }

      var text = [
        'Velquarath Cafe Enquiry (' + topic + ')',
        'From: ' + name,
        'Contact: ' + reply,
        'Message: ' + message
      ].join('\n');

      if (summaryPre) summaryPre.textContent = text;
      if (summaryBox) summaryBox.classList.add('visible');
      if (copyBtn) copyBtn.textContent = 'Copy Enquiry Text';
    });

    if (copyBtn && summaryPre) {
      copyBtn.addEventListener('click', function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(summaryPre.textContent || '').then(function () {
            copyBtn.textContent = 'Copied to Clipboard!';
          });
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 9. COOKIE CONSENT & PREFERENCES MANAGER
  // -------------------------------------------------------------------------
  var STORAGE_KEY = 'afrotopia_cookie_consent_v1';

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { essential: true, functional: false, analytics: false, marketing: false, timestamp: '', decided: false };
      var parsed = JSON.parse(raw);
      return {
        essential: true,
        functional: Boolean(parsed.functional),
        analytics: false,
        marketing: false,
        timestamp: parsed.timestamp || '',
        decided: Boolean(parsed.decided)
      };
    } catch (e) {
      return { essential: true, functional: false, analytics: false, marketing: false, timestamp: '', decided: false };
    }
  }

  function saveConsent(functionalVal) {
    var state = {
      essential: true,
      functional: Boolean(functionalVal),
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      decided: true
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
    return state;
  }

  function initCookieManager() {
    var banner = document.getElementById('cookie-consent-banner');
    var modal = document.getElementById('cookie-preferences-modal');
    var functionalCheckbox = document.getElementById('toggle-functional');
    var statusText = document.getElementById('cookie-page-status-text');
    var functionalBadge = document.getElementById('cookie-page-functional-status');

    function syncUI() {
      var c = getConsent();
      if (functionalCheckbox) functionalCheckbox.checked = c.functional;
      if (statusText) {
        statusText.textContent = c.decided
          ? 'Preferences saved on ' + new Date(c.timestamp).toLocaleString()
          : 'You have not yet saved custom cookie preferences (Non-essential storage is off by default).';
      }
      if (functionalBadge) {
        functionalBadge.textContent = c.functional ? 'Allowed' : 'Disabled';
      }
    }

    syncUI();

    var current = getConsent();
    if (!current.decided && banner) {
      setTimeout(function () {
        if (!getConsent().decided) {
          banner.classList.add('visible');
        }
      }, 10500);
    }

    var openModalBtns = document.querySelectorAll('[data-open-cookie-modal]');
    for (var i = 0; i < openModalBtns.length; i++) {
      openModalBtns[i].addEventListener('click', function () {
        syncUI();
        if (banner) banner.classList.remove('visible');
        if (modal) modal.classList.add('open');
      });
    }

    var closeModalBtns = document.querySelectorAll('[data-close-cookie-modal]');
    for (var j = 0; j < closeModalBtns.length; j++) {
      closeModalBtns[j].addEventListener('click', function () {
        if (modal) modal.classList.remove('open');
      });
    }

    var acceptAllBtns = document.querySelectorAll('[data-cookie-accept-all]');
    for (var a = 0; a < acceptAllBtns.length; a++) {
      acceptAllBtns[a].addEventListener('click', function () {
        saveConsent(true);
        syncUI();
        if (banner) banner.classList.remove('visible');
        if (modal) modal.classList.remove('open');
      });
    }

    var rejectBtns = document.querySelectorAll('[data-cookie-reject]');
    for (var r = 0; r < rejectBtns.length; r++) {
      rejectBtns[r].addEventListener('click', function () {
        saveConsent(false);
        syncUI();
        if (banner) banner.classList.remove('visible');
        if (modal) modal.classList.remove('open');
      });
    }

    var customForm = document.getElementById('cookie-custom-form');
    if (customForm) {
      customForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveConsent(functionalCheckbox ? functionalCheckbox.checked : false);
        syncUI();
        if (banner) banner.classList.remove('visible');
        if (modal) modal.classList.remove('open');
      });
    }

    var dismissBannerBtn = document.getElementById('cookie-banner-dismiss');
    if (dismissBannerBtn && banner) {
      dismissBannerBtn.addEventListener('click', function () {
        banner.classList.remove('visible');
      });
    }
  }

  // -------------------------------------------------------------------------
  // INITIALIZE ALL MODULES ON DOM READY
  // -------------------------------------------------------------------------
  function bootstrapAll() {
    initMobileMenu();
    initEmberCanvas();
    initMenuPage();
    initGalleryPage();
    initReservationsForm();
    initContactForm();
    initCookieManager();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapAll);
  } else {
    bootstrapAll();
  }
})();
