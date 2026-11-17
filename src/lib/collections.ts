// Collection pages (bridal styles). Each entry drives one page from the "Collection Pages template".
// Product photos come from the Figma design; the design repeats ER2001 on every card, so style numbers
// here are placeholders in sequence until the client sends the real catalog.

export type Metal = 'White Gold' | 'Yellow Gold';

export type StoneShape = 'Baguette' | 'Marquise' | 'Princess' | 'Round';
export type Setting = 'Bezel' | 'Carved' | 'Channel' | 'Micro Pavé' | 'Micro Prong' | 'Pavé' | 'Prong';

export type Product = {
  style: string;
  name: string;
  image: string;
  metal: Metal;
  stone?: 'Diamond';
  shapes: StoneShape[];
  settings: Setting[];
};

// Filter drawer options, in the order the design shows them
export const STONE_SHAPES: StoneShape[] = ['Baguette', 'Marquise', 'Princess', 'Round'];
export const SETTINGS: Setting[] = ['Bezel', 'Carved', 'Channel', 'Micro Pavé', 'Micro Prong', 'Pavé', 'Prong'];

export const DEPARTMENTS = [
  { label: 'Bridal', href: '/bridal/' },
  { label: 'Wedding Bands', href: '/wedding-bands/' },
  { label: 'Fashion', href: '/fashion/' },
] as const;

// "Product Categories" tiles in the filter drawer (Bridal). Only Cathedral has a page so far.
export const BRIDAL_CATEGORIES = [
  { slug: 'classic', label: 'Classic', image: '/images/filters/classic.jpg' },
  { slug: 'halo', label: 'Halo', image: '/images/filters/halo.jpg' },
  { slug: 'solitaire', label: 'Solitaire', image: '/images/filters/solitaire.jpg' },
  { slug: 'cathedral', label: 'Cathedral', image: '/images/filters/cathedral.jpg', contain: true },
  { slug: 'carved', label: 'Carved', image: '/images/filters/carved.jpg' },
  { slug: 'vintage', label: 'Vintage', image: '/images/filters/vintage.jpg' },
] as const;

export type Collection = {
  slug: string;
  parent: { label: string; href: string };
  title: string;
  intro: string;
  heroImage: string;
  products: Product[];
};

const RING_PHOTOS: { image: string; metal: Metal }[] = [
  { image: '/images/collections/ring-1.jpg', metal: 'Yellow Gold' },
  { image: '/images/collections/ring-2.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-3.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-4.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-5.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-6.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-7.jpg', metal: 'White Gold' },
];

// Placeholder attributes spread across the styles so every filter returns something,
// until the client's catalogue export replaces them.
const SETTING_CYCLE: Setting[] = ['Carved', 'Pavé', 'Prong', 'Carved', 'Channel', 'Carved', 'Pavé', 'Bezel'];
const ODD_SHAPES: Record<number, StoneShape> = { 5: 'Baguette', 11: 'Marquise', 17: 'Princess' };

function placeholderProducts(count: number, name: string): Product[] {
  return Array.from({ length: count }, (_, i) => {
    // first row as in the design, then the design's repeating 4-photo row
    const photo = i < 4 ? RING_PHOTOS[i] : RING_PHOTOS[[4, 5, 6, 1][i % 4]];
    const settings: Setting[] = [SETTING_CYCLE[i % SETTING_CYCLE.length]];
    if (i === 9) settings.push('Micro Pavé');
    if (i === 14) settings.push('Micro Prong');
    return {
      style: `ER${2001 + i}`,
      name,
      ...photo,
      stone: i < 26 ? 'Diamond' : undefined,
      shapes: ODD_SHAPES[i] ? [ODD_SHAPES[i]] : i < 27 ? ['Round'] : [],
      settings,
    };
  });
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'cathedral',
    parent: { label: 'Bridal', href: '/bridal/' },
    title: 'Cathedral Engagement Rings',
    intro:
      'Discover cathedral settings for your bridal collection. Explore each design, then call our team with the style number for pricing and ordering.',
    heroImage: '/images/collections/cathedral-hero.jpg',
    products: placeholderProducts(30, 'Micro-pavé cathedral ring'),
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
