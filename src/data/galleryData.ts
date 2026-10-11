import { GENERATED_IMAGES } from './images';

export type GalleryCategory = 'all' | 'grill' | 'traditional' | 'burgers-platters' | 'drinks-vibe';

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: Exclude<GalleryCategory, 'all'>;
  categoryLabel: string;
  src: string;
  alt: string;
  spanWide?: boolean;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-feast-table',
    title: 'The Velquarath Evening Feast',
    caption: 'Sticky BBQ pork ribs, slow-braised oxtail in clay pot, steaming white sadza, whole grilled Kariba bream, and craft cocktails by candlelight.',
    category: 'traditional',
    categoryLabel: 'Traditional & Grill',
    src: GENERATED_IMAGES.heroFeast,
    alt: 'Candlelit table spread with sticky ribs, white sadza, clay pot oxtail stew, and whole grilled Kariba bream',
    spanWide: true,
  },
  {
    id: 'gal-sticky-ribs',
    title: 'Signature Sticky Ribs & BBQ Chicken',
    caption: 'Fall-off-the-bone pork ribs and flame-grilled chicken glazed in our house smoky barbecue sauce, served with crispy skin-on fries and roasted cherry tomatoes.',
    category: 'grill',
    categoryLabel: 'Off the Grill',
    src: GENERATED_IMAGES.stickyRibsGrill,
    alt: 'Flame-grilled sticky BBQ pork ribs and quarter chicken served on a wooden board with fries',
  },
  {
    id: 'gal-oxtail-sadza',
    title: 'Oxtail & Beans with White Sadza',
    caption: 'Rich, gelatinous slow-braised oxtail and sugar beans paired with steaming traditional white sadza and sautéed greens.',
    category: 'traditional',
    categoryLabel: 'Traditional Mains',
    src: GENERATED_IMAGES.oxtailSadza,
    alt: 'Traditional Zimbabwean oxtail and beans stew with white sadza and greens on dark stoneware',
  },
  {
    id: 'gal-big-dad-burger',
    title: 'The Big Dad Burger',
    caption: 'Char-grilled patty stacked with melted cheddar, crispy smoked bacon, a golden fried egg, braised onions, lettuce, tomato, and seasoned fries.',
    category: 'burgers-platters',
    categoryLabel: 'Brunch & Burgers',
    src: GENERATED_IMAGES.bigDadBurger,
    alt: 'Towering gourmet beef burger with fried egg, bacon, melted cheese, and fries',
  },
  {
    id: 'gal-patio-bar-vibe',
    title: 'The Patio, Fireplace & Emerald Bar',
    caption: 'Eat on the covered patio, gather around the indoor fireplace, watch live sport on screen, or stay late for live music and cold cocktails.',
    category: 'drinks-vibe',
    categoryLabel: 'Interior & Vibe',
    src: GENERATED_IMAGES.interiorPatio,
    alt: 'Velquarath Cafe evening patio, glowing fireplace, and emerald-lit cocktail bar',
    spanWide: true,
  },
];
